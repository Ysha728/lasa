#!/usr/bin/env node
// PocketIC backend lane for a generated Caffeine app.
//
// Attaches to the platform's PocketIC sidecar, hands its URL to Vitest, and
// lets Vitest drive the app's real canister. The root `test` script calls this
// file, so it is part of the deployment gate: a backend test that fails here
// fails the build's cover.
//
// This runner NEVER starts a PocketIC process. It has no binary path and no
// fallback, deliberately: a fallback would fire exactly when no sidecar is
// configured, which is indistinguishable from a misconfigured production
// container, and a PocketIC server started inside one would exhaust its memory.
// No sidecar means no lane, not a locally started replica.
//
// That makes one property load-bearing: **this runner can only ever exit 0 or
// forward Vitest's exit code.** Everything it owns is infrastructure — the
// production artifacts, the PocketIC client, the test runner, the sidecar, and
// the previous revision an upgrade test needs — and a missing or broken one
// prints `backend test lane skipped: <reason>` and exits 0 without running a
// test, so an environment that cannot host the lane never blocks a deployment.
// Only what Vitest observes after being handed a live replica, starting with
// the canister install, can fail the build — and only for as long as that
// replica is still there to have observed it.

import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { constants as fsConstants, realpathSync } from "node:fs";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

/** Every reason the lane can decline to run. Each one exits 0. */
export const SKIP_REASONS = [
  "converted_project",
  "no_backend_wasm",
  "stale_backend_wasm",
  "no_declarations",
  "no_backend_tests",
  "no_pocketic_client",
  "pocketic_client_unreachable",
  "no_backend_test_runner",
  "no_pocketic_sidecar",
  "pocketic_sidecar_unreachable",
  "lane_runner_error",
];

const BACKEND_WASM_RELATIVE_PATH = path.join("src", "backend", "dist", "backend.wasm");
/**
 * Written into the container by the platform for a converted project: the
 * `{url, sha256, size}` of the last pre-EM revision's wasm. A converted chain
 * replays from that schema rather than from `{}`, so a fresh install of the
 * current wasm alone traps IC0503 — the reason this lane used to decline the
 * whole project. `.platform/` is a one-way delivery path, never read back into
 * a draft, so a baseline landing here cannot reach the user's committed files.
 */
const LEGACY_BASELINE_REF_RELATIVE_PATH = path.join(".platform", "em-legacy-baseline.json");
const LEGACY_BASELINE_CACHE_DIRECTORY = "caffeine-backend-lane-baseline";
const LEGACY_BASELINE_FETCH_TIMEOUT_MS = 30_000;
/** The orchestrator mirrors the previous revision's whole source tree here. */
const PREVIOUS_TREE_RELATIVE_PATH = ".old";
const PREVIOUS_DECLARATIONS_RELATIVE_PATH = path.join(
  ".old",
  "src",
  "frontend",
  "src",
  "declarations",
  "backend.did.js",
);
/**
 * Upgrade tests need the previous build, so they only run when one exists.
 * The glob and the predicate must select the same files: the predicate decides
 * whether the previous revision is built at all, and the glob is what removes
 * those tests when it could not be. Both select exactly the collected test
 * files whose basename contains `upgrade` — the glob's `*`s do not cross a
 * path separator, so it too matches on the basename, and its leading globstar
 * matches zero directories.
 *
 * Recognition is deliberately wider than the name the skill teaches, because a
 * near-miss is silently catastrophic rather than merely unsupported. A file
 * named `backend-upgrade.test.ts` is unmistakably an upgrade test and misses
 * `.upgrade.test.` by one character; under the old exact pattern the previous
 * revision was never built, `BACKEND_WASM_PREVIOUS` was never set, AND the
 * exclusion never applied, so the test ran against an empty wasm path and
 * failed the gate with `ENOENT: open ''`. Observed on a live build, from a
 * worked example whose own header comment used the near-miss name. Reading the
 * intent costs nothing and turns a silent trap into a working test.
 */
const UPGRADE_TEST_GLOB = "**/*upgrade*";
const UPGRADE_TEST_NAME = /upgrade/u;
/** The name the skill teaches. Anything else works, and is reported so it can be fixed. */
const UPGRADE_TEST_CONVENTION = /\.upgrade\.test\./u;
/**
 * Bounds the previous-revision build inside the gate's own `pnpm test` budget.
 * A warm build measures ~8s; anything an order of magnitude past that is
 * anomalous, and excluding upgrade tests is a better outcome than crowding the
 * gate timeout, which would surface as a product failure.
 */
const PREVIOUS_BUILD_TIMEOUT_MS = 90_000;
const SIDECAR_TIMEOUT_MS = 10_000;
const PREVIOUS_BUILD_CACHE_DIRECTORY = "caffeine-backend-lane-previous";
const DECLARATIONS_RELATIVE_PATH = path.join("src", "frontend", "src", "declarations", "backend.did.js");
const BACKEND_SOURCE_RELATIVE_PATH = path.join("src", "backend");
/** `dist` holds the artifact under test; `.old` mirrors the previous revision's sources. */
const BACKEND_SOURCE_SKIP_DIRECTORIES = new Set(["dist", ".old", "node_modules", ".mops"]);
const TEST_FILE_PATTERN = /\.(test|spec)\.[cm]?[jt]sx?$/u;

async function pathExists(candidate) {
  try {
    await fs.access(candidate, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/** Newest mtime across the backend's Motoko sources, or 0 when there are none. */
async function newestMotokoSourceTime(directory) {
  let newest = 0;
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch {
    return newest;
  }
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (BACKEND_SOURCE_SKIP_DIRECTORIES.has(entry.name)) {
        continue;
      }
      newest = Math.max(newest, await newestMotokoSourceTime(entryPath));
      continue;
    }
    if (!entry.isFile() || path.extname(entry.name) !== ".mo") {
      continue;
    }
    try {
      newest = Math.max(newest, (await fs.stat(entryPath)).mtimeMs);
    } catch {
      /* a source that vanished mid-scan cannot make the artifact stale */
    }
  }
  return newest;
}

/**
 * How the runner reads one lane file name: whether it is an upgrade test, and
 * whether it is named the way the skill teaches. The two answers are separate
 * because a near-miss name still has to work — it is only reported, never
 * excluded for its name alone.
 */
export function classifyLaneTestFile(name) {
  if (!TEST_FILE_PATTERN.test(name) || !UPGRADE_TEST_NAME.test(name)) {
    return "not_an_upgrade_test";
  }
  return UPGRADE_TEST_CONVENTION.test(name) ? "upgrade_test" : "upgrade_test_misnamed";
}

/**
 * `{ tests, upgradeTests, misnamedUpgradeTests }` — whether the lane directory
 * holds each kind, and the names of any upgrade tests the runner had to guess
 * at, so the build log can name what to rename.
 */
export async function scanLaneTestFiles(directory) {
  const found = { tests: false, upgradeTests: false, misnamedUpgradeTests: [] };
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const nested = await scanLaneTestFiles(path.join(directory, entry.name));
      found.tests ||= nested.tests;
      found.upgradeTests ||= nested.upgradeTests;
      found.misnamedUpgradeTests.push(...nested.misnamedUpgradeTests);
      continue;
    }
    if (!entry.isFile() || !TEST_FILE_PATTERN.test(entry.name)) {
      continue;
    }
    found.tests = true;
    const classification = classifyLaneTestFile(entry.name);
    if (classification === "not_an_upgrade_test") {
      continue;
    }
    found.upgradeTests = true;
    if (classification === "upgrade_test_misnamed") {
      found.misnamedUpgradeTests.push(entry.name);
    }
  }
  return found;
}

const DEFAULT_MIGRATIONS_CHAIN_DIR = path.join("src", "backend", "migrations");

// The chain path comes from [canisters.<name>.migrations] in mops.toml;
// a project imported under a non-default canister name can point elsewhere.
async function migrationsChainDirectory(projectRoot) {
  const raw = await fs.readFile(path.join(projectRoot, "mops.toml"), "utf8").catch(() => undefined);
  return /chain\s*=\s*"([^"]+)"/u.exec(raw ?? "")?.[1] ?? DEFAULT_MIGRATIONS_CHAIN_DIR;
}

// Weak temporary heuristic, not a Motoko parser: only `OldActor = {}` and a `public func run` taking an inline empty record count as empty.
// Keep in sync with oldActorIsEmptyRecord in agent-teams local-deploy-e2e-runtime.ts.
function oldActorIsEmptyRecord(code) {
  const withoutComments = code.replace(/\/\*[\s\S]*?\*\//gu, "").replace(/\/\/[^\n]*/gu, "");
  if (/public\s+func\s+run\s*\(\s*\w+\s*:\s*\{\s*\}\s*\)/u.test(withoutComments)) {
    return true;
  }
  const rhs = /type\s+OldActor\s*=\s*([^;=]*)/u.exec(withoutComments)?.[1];
  if (rhs === undefined) {
    return undefined;
  }
  return /^\{\s*\}$/u.test(rhs.trim());
}

/**
 * A frozen first migration with a non-empty `OldActor` means the chain replays
 * from state a fresh PocketIC install cannot supply: `setupCanister` replays it
 * from an empty actor and traps (IC0503) before any test runs, so the lane must
 * decline instead of failing the gate. Hosted installs recover via the
 * em-legacy-bootstrap sidecar, which no local replica has access to.
 *
 * Frozen-ness comes from the mode bits, NOT fs.access(W_OK): POSIX grants root
 * write regardless of mode, and the container typically runs as root. A writable
 * first migration is pending from this build, so its trap is a real, fixable bug
 * the lane should surface.
 */
/**
 * Resolve the platform-supplied legacy baseline for a converted project.
 *
 * Returns `{ wasm }` with a local path, or `{ reason }` naming why it could not
 * be used. Every failure is a reason rather than a throw: a baseline that cannot
 * be fetched must leave the lane exactly where it was before this existed —
 * declining a converted project — never failing a gate over platform delivery.
 *
 * The digest is verified because a presigned URL is a bearer token with a TTL:
 * a truncated or substituted body would otherwise be installed as if it were the
 * project's own history.
 */
export async function resolveLegacyBaseline(projectRoot, fetchImpl = globalThis.fetch) {
  const refPath = path.join(projectRoot, LEGACY_BASELINE_REF_RELATIVE_PATH);
  const raw = await fs.readFile(refPath, "utf8").catch(() => undefined);
  if (raw === undefined) {
    return { reason: "no_legacy_baseline" };
  }
  let ref;
  try {
    ref = JSON.parse(raw);
  } catch {
    return { reason: "legacy_baseline_unreadable" };
  }
  if (typeof ref?.url !== "string" || typeof ref?.sha256 !== "string" || ref.sha256.length === 0) {
    return { reason: "legacy_baseline_unreadable" };
  }

  const cacheDirectory = path.join(os.tmpdir(), LEGACY_BASELINE_CACHE_DIRECTORY);
  const cached = path.join(cacheDirectory, `${ref.sha256}.wasm`);
  if (await pathExists(cached)) {
    return { wasm: cached, cached: true };
  }

  let body;
  try {
    const response = await fetchImpl(ref.url, { signal: AbortSignal.timeout(LEGACY_BASELINE_FETCH_TIMEOUT_MS) });
    if (!response.ok) {
      return { reason: "legacy_baseline_unreachable" };
    }
    body = Buffer.from(await response.arrayBuffer());
  } catch {
    return { reason: "legacy_baseline_unreachable" };
  }

  const digest = createHash("sha256").update(body).digest("hex");
  if (digest !== ref.sha256) {
    return { reason: "legacy_baseline_digest_mismatch" };
  }

  await fs.mkdir(cacheDirectory, { recursive: true });
  const staging = `${cached}.${process.pid}.partial`;
  await fs.writeFile(staging, body);
  // Publish through a rename so a concurrent reader never sees a partial file.
  await fs.rename(staging, cached);
  return { wasm: cached, cached: false };
}

export async function isConvertedProject(projectRoot) {
  const chainDir = path.join(projectRoot, await migrationsChainDirectory(projectRoot));
  const entries = await fs.readdir(chainDir).catch(() => undefined);
  const first = entries?.filter((name) => name.endsWith(".mo")).sort()[0];
  if (first === undefined) {
    return false;
  }
  const firstPath = path.join(chainDir, first);
  const code = await fs.readFile(firstPath, "utf8").catch(() => undefined);
  if (code === undefined || oldActorIsEmptyRecord(code) !== false) {
    return false;
  }
  const mode = await fs.stat(firstPath).then(
    (stat) => stat.mode,
    () => 0,
  );
  return (mode & 0o222) === 0;
}

/**
 * Production artifacts the lane installs and calls, plus the tester's own lane
 * file. They are written by the backend `check` lane; the tester never builds
 * them, so their absence means the lane has nothing to test rather than that
 * anything is wrong. A frontend-only build reaches `no_backend_wasm` and the
 * gate is satisfied without a replica, exactly as before this lane existed.
 */
export async function backendLaneArtifactSkip(projectRoot, laneDirectory, baselineWasm = undefined) {
  // A converted chain is only untestable here without the pre-EM revision to
  // replay from. With one supplied the install becomes `[baseline, current]`,
  // which is the same contract the hosted deploy uses, so the decline lifts.
  if (baselineWasm === undefined && (await isConvertedProject(projectRoot))) {
    return "converted_project";
  }
  const wasmPath = path.join(projectRoot, BACKEND_WASM_RELATIVE_PATH);
  if (!(await pathExists(wasmPath))) {
    return "no_backend_wasm";
  }
  if (!(await pathExists(path.join(projectRoot, DECLARATIONS_RELATIVE_PATH)))) {
    return "no_declarations";
  }
  const wasmTime = (await fs.stat(wasmPath)).mtimeMs;
  const sourceTime = await newestMotokoSourceTime(path.join(projectRoot, BACKEND_SOURCE_RELATIVE_PATH));
  if (sourceTime > wasmTime) {
    return "stale_backend_wasm";
  }
  // Vitest exits non-zero on "No test files found". Under the gate that would
  // block a deployment over a lane the tester simply never authored.
  if (laneDirectory !== undefined && !(await scanLaneTestFiles(laneDirectory)).tests) {
    return "no_backend_tests";
  }
  return null;
}

function runCommand(command, args, options, timeoutMs) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { ...options, stdio: ["ignore", "pipe", "ignore"] });
    let stdout = "";
    const timer = setTimeout(() => child.kill("SIGKILL"), timeoutMs);
    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.once("error", () => {
      clearTimeout(timer);
      resolve({ code: null, stdout: "" });
    });
    child.once("close", (code) => {
      clearTimeout(timer);
      resolve({ code, stdout });
    });
  });
}

function resolveFrom(roots, specifier) {
  for (const root of roots) {
    try {
      return createRequire(root).resolve(specifier);
    } catch {
      /* try the next resolution root */
    }
  }
  return undefined;
}

/**
 * The lane's two npm-side preconditions, which do NOT have the same resolution
 * rules — the difference is load-bearing and was a real defect.
 *
 * Vitest is spawned by absolute path and never imported by the lane file, so it
 * may live in any root this runner can see. The skill's own bootstrap installs
 * the test stack with `pnpm --dir app/src/frontend add`, and pnpm links a
 * workspace package's dependencies into that package's `node_modules`, never
 * into the workspace root's — so the frontend package has to be a root or the
 * lane skips on every build the skill itself produces.
 *
 * `@dfinity/pic` is different: the lane file imports it as a bare specifier, and
 * Vite resolves those from the importer upward. A client installed only in the
 * frontend package is therefore invisible to a lane file under `app/test/`,
 * verified directly — Vitest runs, then fails with "Cannot find package
 * '@dfinity/pic'". Accepting it would boot a replica and fail the gate on an
 * unresolved import, which is worse than declining. It gets its own reason so a
 * build log distinguishes "not installed" from "installed where the lane file
 * cannot reach it".
 */
export function resolveLaneModules(laneRequirePath, projectRoot) {
  const appRoot = pathToFileURL(path.join(projectRoot, "package.json")).href;
  const frontendRoot = pathToFileURL(path.join(projectRoot, "src", "frontend", "package.json")).href;

  if (resolveFrom([laneRequirePath], "@dfinity/pic/package.json") === undefined) {
    return {
      skip:
        resolveFrom([appRoot, frontendRoot], "@dfinity/pic/package.json") === undefined
          ? "no_pocketic_client"
          : "pocketic_client_unreachable",
    };
  }

  // Nearest root first: a lane-local pin wins over the app root, which wins
  // over the frontend package that the bootstrap uses by default.
  const vitestManifest = resolveFrom([laneRequirePath, appRoot, frontendRoot], "vitest/package.json");
  return vitestManifest === undefined
    ? { skip: "no_backend_test_runner" }
    : { vitestBin: path.join(path.dirname(vitestManifest), "vitest.mjs") };
}

function skip(reason) {
  console.log(`backend test lane skipped: ${reason}`);
  process.exitCode = 0;
}

function describeError(error) {
  return error instanceof Error ? error.message.split("\n")[0] : String(error);
}

/**
 * The platform's PocketIC sidecar is the lane's ONLY replica source. This runner
 * deliberately cannot start a PocketIC process of its own: a local-binary
 * fallback would fire exactly when no sidecar is configured, which is what a
 * misconfigured production container looks like, and a PocketIC server started
 * inside one would exhaust its memory. An absent sidecar therefore skips.
 *
 * `PocketIc.create` POSTs to `/instances` on the server's own port, so each
 * client gets its own instance — verified directly that two clients on one
 * server have independent canister id spaces, cannot see each other's
 * canisters, and that one client's `tearDown` leaves the other working. Sharing
 * the sidecar with local-deploy QA is therefore safe with both experiments on.
 */
export async function resolveSidecarServerUrl(env, fetchJson = fetchJsonWithTimeout) {
  const configured = env.POCKETIC_SIDECAR_URL?.trim().replace(/\/+$/u, "");
  if (configured === undefined || configured.length === 0) {
    return { skip: "no_pocketic_sidecar" };
  }
  try {
    const health = await fetchJson(`${configured}/healthz`);
    if (health?.ok !== true) {
      return { skip: "pocketic_sidecar_unreachable" };
    }
    const descriptor = await fetchJson(`${configured}/descriptor`);
    const host = descriptor?.gatewayHost;
    const port = descriptor?.pocketicConfigPort;
    // The sidecar exposes an HTTP gateway for icp-cli and, separately, the
    // PocketIC server's own port. Only the latter can create instances.
    if (typeof host !== "string" || host.length === 0 || typeof port !== "number" || !Number.isInteger(port)) {
      return { skip: "pocketic_sidecar_unreachable" };
    }
    return { url: `http://${host}:${String(port)}` };
  } catch {
    return { skip: "pocketic_sidecar_unreachable" };
  }
}

async function fetchJsonWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SIDECAR_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response.ok ? await response.json() : undefined;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * A backstop only. The client's own `processingTimeoutMs` is the bound that
 * matters, because it aborts the request and frees the socket; this one merely
 * stops a wedged client from holding the gate open, and is deliberately looser
 * so the client's abort is what normally ends the wait.
 */
function withTimeout(work, timeoutMs) {
  // The loser of the race is never awaited, and an unhandled rejection would
  // reach this runner's own fail-safe and exit the process from under Vitest.
  work.catch(() => {
    /* the race has already produced the verdict */
  });
  let timer;
  const expiry = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("probe timed out")), timeoutMs);
  });
  return Promise.race([work, expiry]).finally(() => clearTimeout(timer));
}

async function createProbeInstance(url) {
  const { PocketIc } = await import("@dfinity/pic");
  const pic = await PocketIc.create(url, { processingTimeoutMs: SIDECAR_TIMEOUT_MS });
  await pic.tearDown().catch(() => {
    /* a sidecar that will not release an instance still made one */
  });
}

/**
 * Proves the sidecar can do the one thing the lane needs from it: create an
 * instance.
 *
 * `/healthz` and `/descriptor` belong to the sidecar wrapper, not to the
 * PocketIC server behind it, so both can answer while `POST /instances` accepts
 * the connection and then closes the socket. Observed on a live build, over and
 * over: the lane passed its own reachability gate and died inside Vitest with
 * `TypeError: fetch failed`, which is precisely the outcome this runner exists
 * to prevent, and which left the tester no way to decline except to edit the
 * runner it is told never to edit. Creating an instance is the same call every
 * test makes, so it is the only probe that says anything about the run to come.
 *
 * Each client gets its own instance, so this neither sees nor disturbs the
 * instances local-deploy QA holds on the same sidecar, and the probe's own
 * instance is released rather than held for the length of the build.
 */
export async function canHostReplica(url, createInstance = createProbeInstance) {
  try {
    await withTimeout(createInstance(url), SIDECAR_TIMEOUT_MS * 2);
    return true;
  } catch {
    return false;
  }
}

async function replayBaselineChain(url, baselineWasm, currentWasm) {
  const { PocketIc } = await import("@dfinity/pic");
  const pic = await PocketIc.create(url, { processingTimeoutMs: SIDECAR_TIMEOUT_MS });
  try {
    const canisterId = await pic.createCanister();
    await pic.installCode({ canisterId, wasm: baselineWasm });
    await pic.upgradeCanister({ canisterId, wasm: currentWasm, arg: new Uint8Array() });
  } finally {
    await pic.tearDown().catch(() => {
      /* a sidecar that will not release an instance still made one */
    });
  }
}

/**
 * Proves the supplied baseline actually replays into this build before any test
 * depends on it.
 *
 * The tester installs `[baseline, current]` inside `beforeAll`, so a baseline
 * that does not belong to this chain traps there — and a trap in `beforeAll` is
 * a failing suite, which under the gate blocks the deployment. That would turn a
 * platform mis-resolution into a verdict about the app, which is the one thing
 * this runner exists to prevent.
 *
 * It is not hypothetical. The baseline is resolved from the platform's
 * legacy-baseline stamp, which `spec/enhanced-migration.md` still runs in shadow
 * mode: the deploy path deliberately keeps deriving its own Install payload from
 * the lineage probe until the mismatch metric is clean. Replaying the chain here
 * first keeps a wrong answer costing exactly what a converted project cost
 * before any baseline existed — no coverage — rather than a blocked deploy.
 *
 * No `idlFactory` is needed: installing and upgrading are management-canister
 * calls, and nothing here calls the app's own interface.
 */
export async function canReplayLegacyBaseline(url, baselineWasm, currentWasm, replay = replayBaselineChain) {
  try {
    // Two installs and an upgrade against a cold canister, so this is allowed
    // more room than the single-instance reachability probe.
    await withTimeout(replay(url, baselineWasm, currentWasm), SIDECAR_TIMEOUT_MS * 4);
    return true;
  } catch {
    return false;
  }
}

/**
 * A digest of everything the previous build depends on. The tool layer reruns
 * the root `test` script independently of the tester's own run, so an uncached
 * build is paid at least twice per gated build. Keying the artifact on tree
 * content means there is no invalidation logic at all: different sources
 * produce a different key, and stale entries are simply never read again.
 */
async function previousTreeDigest(previousRoot) {
  const hash = createHash("sha256");
  const walk = async (directory, relative) => {
    const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
    for (const entry of [...entries].sort((a, b) => a.name.localeCompare(b.name))) {
      const entryPath = path.join(directory, entry.name);
      const entryRelative = `${relative}/${entry.name}`;
      if (entry.isDirectory()) {
        await walk(entryPath, entryRelative);
      } else if (entry.isFile()) {
        hash.update(entryRelative);
        hash.update(await fs.readFile(entryPath));
      }
    }
  };
  for (const manifest of ["mops.toml", "mops.lock"]) {
    const manifestPath = path.join(previousRoot, manifest);
    if (await pathExists(manifestPath)) {
      hash.update(manifest);
      hash.update(await fs.readFile(manifestPath));
    }
  }
  await walk(path.join(previousRoot, "src", "backend"), "src/backend");
  return hash.digest("hex").slice(0, 32);
}

/**
 * Builds the previous revision's canister so an upgrade test can install it and
 * upgrade to the current one. Without this, an upgrade test could only reinstall
 * the same wasm, which runs no migration at all and so can never fail.
 *
 * The sources are copied out of `.old/` and built in a scratch directory rather
 * than in place: `mops build` writes `src/backend/dist/backend.most`, and inside
 * `.old/` that is the exact file `mops check --fix` reads for its upgrade
 * compatibility check. Verified that a scratch build leaves `.old/` untouched.
 */
export async function buildPreviousBackend(projectRoot, runner = runCommand) {
  const previousRoot = path.join(projectRoot, PREVIOUS_TREE_RELATIVE_PATH);
  const manifest = path.join(previousRoot, "mops.toml");
  if (!(await pathExists(path.join(previousRoot, "src", "backend", "main.mo"))) || !(await pathExists(manifest))) {
    return { reason: "no_previous_backend" };
  }

  const cacheDirectory = path.join(os.tmpdir(), PREVIOUS_BUILD_CACHE_DIRECTORY);
  const cached = path.join(cacheDirectory, `${await previousTreeDigest(previousRoot)}.wasm`);
  if (await pathExists(cached)) {
    return { wasm: cached, cached: true };
  }

  const scratch = await fs.mkdtemp(path.join(os.tmpdir(), "backend-lane-previous-"));
  try {
    await fs.cp(manifest, path.join(scratch, "mops.toml"));
    if (await pathExists(path.join(previousRoot, "mops.lock"))) {
      await fs.cp(path.join(previousRoot, "mops.lock"), path.join(scratch, "mops.lock"));
    }
    await fs.cp(path.join(previousRoot, "src"), path.join(scratch, "src"), { recursive: true });

    const build = await runner("mops", ["build"], { cwd: scratch }, PREVIOUS_BUILD_TIMEOUT_MS);
    const wasm = path.join(scratch, "src", "backend", "dist", "backend.wasm");
    if (build.code !== 0 || !(await pathExists(wasm))) {
      return { reason: "previous_backend_build_failed", scratch };
    }
    // Publish through a rename so a concurrent reader never sees a partial file.
    await fs.mkdir(cacheDirectory, { recursive: true });
    const staged = `${cached}.${String(process.pid)}`;
    await fs.copyFile(wasm, staged);
    await fs.rename(staged, cached);
    return { wasm: cached, scratch };
  } catch (error) {
    return { reason: `previous_backend_build_failed (${describeError(error)})`, scratch };
  }
}

/**
 * `--fileParallelism=false` is load-bearing, not a tuning knob.
 *
 * Vitest runs test files in parallel by default — verified against the pinned
 * 3.1.4 that three lane files all start before any of them finishes. Every one
 * of them creates its own PocketIC instance, so the run demands several at once
 * while the pre-run probe only ever proves one. Serializing makes the probe
 * representative of the run it is gating.
 *
 * It also lowers the peak the sidecar has to absorb, which is the thing that
 * actually broke: creating an instance spawns threads, and a live sidecar hit
 * its pid cgroup ceiling (511/512, sustained) so `POST /instances` failed with
 * EAGAIN and the socket closed. There is nothing to win here anyway — the lane
 * is I/O-bound against one shared replica, not CPU-bound across many.
 *
 * These go AFTER the forwarded arguments, and that ordering is the enforcement.
 * The skill tells the tester to append arguments for focused iteration, and a
 * flag it can silently undo is not load-bearing. Measured against the pinned
 * 3.1.4: repeating the SAME spelling is a hard parse error ("Expected a single
 * value for option"), but the kebab spelling of the same option does not
 * collide with the camel one and resolves last-wins — so a forwarded
 * `--file-parallelism=true` after this flag silently restores parallelism, and
 * placed before it does not. Positional filters still select correctly with
 * options trailing them, which is the focused run the skill documents.
 */
const VITEST_SUBCOMMAND = "run";
const VITEST_FIXED_OPTIONS = ["--environment", "node", "--fileParallelism=false"];

function runVitest(vitestBin, laneDirectory, vitestArguments, environment) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [vitestBin, VITEST_SUBCOMMAND, ...vitestArguments, ...VITEST_FIXED_OPTIONS], {
      cwd: laneDirectory,
      stdio: "inherit",
      env: environment,
    });
    child.once("error", () => resolve(1));
    child.once("close", (code) => resolve(code ?? 1));
  });
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  const laneDirectory = path.dirname(fileURLToPath(import.meta.url));
  const projectRoot = path.resolve(laneDirectory, "..", "..");

  // Only a converted project needs a baseline; resolving it otherwise would pay
  // a fetch on every greenfield build for a file that is never delivered.
  let baseline = { reason: "not_converted" };
  if (await isConvertedProject(projectRoot)) {
    baseline = await resolveLegacyBaseline(projectRoot);
    if (baseline.wasm === undefined) {
      console.log(`backend legacy baseline unavailable: ${baseline.reason}`);
    }
  }

  const artifactSkip = await backendLaneArtifactSkip(projectRoot, laneDirectory, baseline.wasm);
  if (artifactSkip !== null) {
    skip(artifactSkip);
    return;
  }

  const modules = resolveLaneModules(pathToFileURL(path.join(laneDirectory, "run-backend-lane.mjs")).href, projectRoot);
  if (modules.skip !== undefined) {
    skip(modules.skip);
    return;
  }

  // Resolving the client proves it is installed; only loading it proves its own
  // dependency tree is intact. A partial install must skip, not fail the gate.
  try {
    await import("@dfinity/pic");
  } catch (error) {
    skip(`no_pocketic_client (${describeError(error)})`);
    return;
  }

  // The platform's sidecar is the only replica source; this runner never starts
  // a PocketIC process itself.
  const sidecar = await resolveSidecarServerUrl(env);
  if (sidecar.skip !== undefined) {
    skip(sidecar.skip);
    return;
  }

  // The descriptor only says where the PocketIC server is. Creating an instance
  // is what proves it can host the run, and a half-dead server answers the
  // first question while failing the second.
  if (!(await canHostReplica(sidecar.url))) {
    skip("pocketic_sidecar_unreachable");
    return;
  }

  // Declining here reports `converted_project`, the same reason a converted
  // project reported before a baseline could be supplied at all, so a baseline
  // the platform resolved wrongly lands back on the old behaviour instead of
  // failing the gate.
  if (baseline.wasm !== undefined) {
    const currentWasm = path.join(projectRoot, BACKEND_WASM_RELATIVE_PATH);
    if (!(await canReplayLegacyBaseline(sidecar.url, baseline.wasm, currentWasm))) {
      skip("converted_project (the supplied legacy baseline does not replay into this build)");
      return;
    }
  }

  // Upgrade tests need the revision the app is being upgraded FROM, which only
  // exists on a modification build. Building it is the most expensive thing the
  // runner does, so it happens only when a test will actually consume the
  // result; the same pattern decides that and, on failure, what gets excluded.
  // Building must never fail the gate either: an old tree that no longer
  // compiles says nothing about the new one.
  const vitestArguments = [...argv];
  let previous = { reason: "no_upgrade_tests" };
  const laneFiles = await scanLaneTestFiles(laneDirectory);
  if (laneFiles.misnamedUpgradeTests.length > 0) {
    // The runner honours the intent; naming it in the log is what gets the
    // convention back, and what tells a reader why an upgrade ran at all.
    console.log(
      `backend upgrade tests read from their name: ${laneFiles.misnamedUpgradeTests.join(", ")} (rename to *.upgrade.test.*)`,
    );
  }
  if (laneFiles.upgradeTests) {
    previous = await buildPreviousBackend(projectRoot);
    if (previous.wasm === undefined) {
      console.log(`backend upgrade tests excluded: ${previous.reason}`);
      // Vitest's own defaults are replaced when `--exclude` is passed, so they
      // have to be restated or its build output would be collected as tests.
      vitestArguments.push(
        "--exclude",
        "**/node_modules/**",
        "--exclude",
        "**/dist/**",
        "--exclude",
        UPGRADE_TEST_GLOB,
      );
    }
  }

  let exitCode;
  try {
    exitCode = await runVitest(modules.vitestBin, laneDirectory, vitestArguments, {
      ...env,
      POCKET_IC_URL: sidecar.url,
      BACKEND_WASM: path.join(projectRoot, BACKEND_WASM_RELATIVE_PATH),
      ...(baseline.wasm === undefined ? {} : { BACKEND_WASM_BASELINE: baseline.wasm }),
      ...(previous.wasm === undefined
        ? {}
        : {
            BACKEND_WASM_PREVIOUS: previous.wasm,
            BACKEND_DECLARATIONS_PREVIOUS: path.join(projectRoot, PREVIOUS_DECLARATIONS_RELATIVE_PATH),
          }),
    });
  } finally {
    if (previous.scratch !== undefined) {
      await fs.rm(previous.scratch, { recursive: true, force: true }).catch(() => {
        /* the OS reclaims the temp directory */
      });
    }
  }

  // A replica that is still not hosting when the run ends leaves results that
  // are evidence of nothing, so the lane withdraws rather than reporting a
  // verdict it cannot stand behind. This is the same live instance creation as
  // the pre-run gate, which is what keeps the line exactly where it was: an
  // assertion failure, a trap and a reject all leave the sidecar creating
  // instances perfectly well, so a real backend failure still exits non-zero
  // and still blocks the deployment.
  //
  // Known blind spot, stated rather than papered over: this runs AFTER Vitest
  // exits, so it can only catch a sidecar that is STILL broken then — one that
  // was recycled or died outright. It cannot catch a failure that clears as the
  // load drains, and the live incident was exactly that shape: a saturated pid
  // cgroup whose count fell 512 → 439 → 388 as instances and workers released,
  // so this probe would find it healthy and blame the app. Detecting that would
  // mean either reading Vitest's output — a string any test could print, which
  // must never decide this — or probing during the run, which creates the very
  // instances the sidecar is running out of. The pre-run probe plus the
  // serialized run above is the defence against that class; this one covers the
  // sidecar that does not come back.
  if (exitCode !== 0 && !(await canHostReplica(sidecar.url))) {
    skip("pocketic_sidecar_unreachable (the sidecar stopped hosting the replica during the run)");
    return;
  }
  process.exitCode = exitCode;
}

/**
 * Compares real paths. `import.meta.url` is already symlink-resolved while
 * `process.argv[1]` is not, so a project reached through a symlinked parent —
 * anything under macOS's `/var`, or a workspace mounted through a link — makes
 * a naive comparison false. This runner would then exit 0 having run nothing,
 * which under the gate reads as a passing lane that silently tested nothing.
 */
function isEntrypoint() {
  const entry = process.argv[1];
  if (entry === undefined) {
    return false;
  }
  try {
    return realpathSync(entry) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isEntrypoint()) {
  // The runner is infrastructure by definition, so any fault inside it is an
  // infrastructure fault. Without this the gate could be blocked by a defect in
  // the lane's own plumbing rather than by anything wrong with the app. This
  // outlived the local-binary path it was first added for: the artifact scan,
  // the module resolution and the sidecar probe are all still unguarded
  // rejection surfaces, and an EACCES on a readdir must not fail a deployment.
  const failSafe = (error) => {
    if (process.exitCode === undefined || process.exitCode === 0) {
      skip(`lane_runner_error (${describeError(error)})`);
    }
    process.exit(process.exitCode ?? 0);
  };
  process.on("uncaughtException", failSafe);
  process.on("unhandledRejection", failSafe);
  await main();
}
