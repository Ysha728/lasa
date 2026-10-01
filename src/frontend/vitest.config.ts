import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Vitest configuration for the LASA frontend suite.
 *
 * The `test` script passes `--environment jsdom`, so the DOM environment is
 * configured there; this file only wires the `@` path alias (matching
 * vite.config.js) and the jest-dom matchers.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  test: {
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // The sandbox reports a constrained CPU set, which makes Vitest's default
    // thread pool compute conflicting min/max thread counts. A single forked
    // process is deterministic and avoids the Tinypool RangeError.
    pool: "forks",
    poolOptions: {
      forks: { minForks: 1, maxForks: 1 },
    },
  },
});
