/**
 * Shared test helpers for the LASA frontend suite.
 *
 * The app reads all backend state through `useActor(createActor)` from
 * `@caffeineai/core-infrastructure`. Tests replace that hook with a typed local
 * actor mock, so no network or real canister is involved. The mock is a plain
 * object implementing the generated `backendInterface`; each test overrides only
 * the methods it cares about.
 */
import type { backendInterface } from "@/backend";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { vi } from "vitest";

/** A typed actor mock: every public method, each a Vitest mock function. */
export type ActorMock = {
  [K in keyof backendInterface]: backendInterface[K] extends (
    ...args: infer A
  ) => infer R
    ? ReturnType<typeof vi.fn<(...args: A) => R>>
    : never;
};

/**
 * Build a fully-typed actor mock with sensible empty-state defaults. Pass
 * overrides for the methods a test exercises.
 */
export function createActorMock(overrides: Partial<ActorMock> = {}): ActorMock {
  const base: ActorMock = {
    _initialize_access_control: vi.fn(async () => undefined),
    _internet_identity_sign_in_finish: vi.fn(async () => ({
      __kind__: "ok" as const,
      ok: null,
    })),
    _internet_identity_sign_in_start: vi.fn(async () => new Uint8Array()),
    assignCallerUserRole: vi.fn(async () => undefined),
    execute: vi.fn(async () => ({ hasMore: false, rows: [] })),
    getApiDoc: vi.fn(async () => ""),
    getCallerUserRole: vi.fn(async () => "guest" as never),
    getReviewStats: vi.fn(async (foodId: bigint) => ({
      foodId,
      count: 0n,
      average: 0,
    })),
    isCallerAdmin: vi.fn(async () => false),
    listComments: vi.fn(async () => []),
    listExplored: vi.fn(async () => []),
    listFavorites: vi.fn(async () => []),
    listReviews: vi.fn(async () => []),
    listSuggestions: vi.fn(async () => []),
    markExplored: vi.fn(async () => true),
    schema: vi.fn(async () => ""),
    submitComment: vi.fn(async (input) => ({
      id: 1n,
      foodId: input.foodId,
      authorName: input.authorName,
      text: input.text,
      createdAt: 0n,
    })),
    submitReview: vi.fn(async (input) => ({
      id: 1n,
      foodId: input.foodId,
      reviewerName: input.reviewerName,
      rating: input.rating,
      text: input.text,
      createdAt: 0n,
    })),
    submitSuggestion: vi.fn(async (input) => ({
      id: 1n,
      name: input.name,
      text: input.text,
      category: input.category,
      createdAt: 0n,
    })),
    toggleFavorite: vi.fn(async () => true),
  };
  return { ...base, ...overrides };
}

/** A fresh QueryClient with retries disabled so failures surface immediately. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

/** Render a component inside the app's React Query provider. */
export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    ...options
  }: RenderWithProvidersOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
  return { queryClient, ...render(ui, { wrapper: Wrapper, ...options }) };
}
