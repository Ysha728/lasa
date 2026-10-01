/**
 * PocketIC backend lane for LASA.
 *
 * Installs the app's own compiled canister into the platform's PocketIC replica
 * and calls the real public API. The frontend suite mocks the actor, so it
 * passes unchanged against a backend whose methods are unimplemented stubs;
 * this lane is what proves the canister actually answers.
 *
 * The runner (`run-backend-lane.mjs`) skips the whole lane when the wasm or the
 * PocketIC client is absent, so this file only runs against a live replica.
 */
import { PocketIc } from "@dfinity/pic";
import type { Actor, CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
  }));
});

afterAll(async () => {
  // `?.` because `beforeAll` may not have got that far; a failed
  // `PocketIc.create` otherwise stacks a second error on the real one.
  await pic?.tearDown();
});

it("answers empty-state reads instead of trapping", async () => {
  await expect(actor.listReviews()).resolves.toEqual([]);
  await expect(actor.listComments()).resolves.toEqual([]);
  await expect(actor.listSuggestions()).resolves.toEqual([]);
  await expect(actor.listFavorites()).resolves.toEqual([]);
  await expect(actor.listExplored()).resolves.toEqual([]);
  await expect(actor.getReviewStats(1n)).resolves.toMatchObject({
    foodId: 1n,
    count: 0n,
    average: 0,
  });
});

it("round-trips a review through the real canister", async () => {
  const created = await actor.submitReview({
    foodId: 1n,
    reviewerName: "Maria S.",
    rating: 5n,
    text: "The smoky grill flavor is unforgettable.",
  });
  expect(created).toMatchObject({
    foodId: 1n,
    reviewerName: "Maria S.",
    rating: 5n,
    text: "The smoky grill flavor is unforgettable.",
  });

  const reviews = await actor.listReviews();
  expect(reviews).toHaveLength(1);
  expect(reviews[0]).toMatchObject({ id: created.id, rating: 5n });

  const stats = await actor.getReviewStats(1n);
  expect(stats).toMatchObject({ foodId: 1n, count: 1n, average: 5 });
});

it("round-trips a comment through the real canister", async () => {
  const created = await actor.submitComment({
    foodId: 1n,
    authorName: "Juan D.",
    text: "That charred skin is everything.",
  });
  expect(created).toMatchObject({
    foodId: 1n,
    authorName: "Juan D.",
    text: "That charred skin is everything.",
  });

  const comments = await actor.listComments();
  expect(comments).toHaveLength(1);
  expect(comments[0]).toMatchObject({ id: created.id, authorName: "Juan D." });
});

it("round-trips a suggestion with its optional name and category", async () => {
  const created = await actor.submitSuggestion({
    name: ["Ana R."],
    text: "Please add sinigang!",
    category: { filipinoFood: null },
  });
  expect(created).toMatchObject({
    name: ["Ana R."],
    text: "Please add sinigang!",
    category: { filipinoFood: null },
  });

  const suggestions = await actor.listSuggestions();
  expect(suggestions).toHaveLength(1);
  expect(suggestions[0]).toMatchObject({ id: created.id });
});

it("toggles a favorite for the caller", async () => {
  await expect(actor.toggleFavorite(1n)).resolves.toBe(true);
  await expect(actor.listFavorites()).resolves.toEqual([1n]);

  await expect(actor.toggleFavorite(1n)).resolves.toBe(false);
  await expect(actor.listFavorites()).resolves.toEqual([]);
});

it("marks a food explored for the caller", async () => {
  await expect(actor.markExplored(2n)).resolves.toBe(true);
  await expect(actor.listExplored()).resolves.toEqual([2n]);
});
