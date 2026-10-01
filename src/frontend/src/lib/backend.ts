/**
 * Typed wrappers around the generated backend actor.
 *
 * The generated `@/backend` bindings are the source of truth; these thin
 * helpers give the rest of the app friendly, well-named functions and keep the
 * bigint conversions in one place. Never edit the generated bindings directly.
 */
import type { backendInterface } from "@/backend";

/** The actor type returned by `useActor(createActor)`. */
export type LasaActor = backendInterface;

/** Convert a backend nanosecond timestamp into a JavaScript Date. */
export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Format a backend timestamp as a short, readable date. */
export function formatTimestamp(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "Just now";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Toggle a food as a favorite for the current caller; returns the new state. */
export async function toggleFavorite(actor: LasaActor, foodId: number): Promise<boolean> {
  return actor.toggleFavorite(BigInt(foodId));
}

/** List the caller's favorite food ids as plain numbers. */
export async function listFavorites(actor: LasaActor): Promise<number[]> {
  const ids = await actor.listFavorites();
  return ids.map((id) => Number(id));
}

/** Mark a food as explored for the caller; returns the new state. */
export async function markExplored(actor: LasaActor, foodId: number): Promise<boolean> {
  return actor.markExplored(BigInt(foodId));
}

/** List the caller's explored food ids as plain numbers. */
export async function listExplored(actor: LasaActor): Promise<number[]> {
  const ids = await actor.listExplored();
  return ids.map((id) => Number(id));
}
