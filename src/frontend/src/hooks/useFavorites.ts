/**
 * Favorites hook.
 *
 * Favorites are owned by the backend (per caller), so React Query is the
 * source of truth. We keep an optimistic local set so the heart responds
 * instantly, then sync with the actor and invalidate the query.
 */
import { createActor } from "@/backend";
import { listFavorites, toggleFavorite } from "@/lib/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

const FAVORITES_KEY = ["favorites"] as const;

export function useFavorites() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: FAVORITES_KEY,
    queryFn: async () => {
      if (!actor) return [] as number[];
      return listFavorites(actor);
    },
    enabled: !!actor && !isFetching,
  });

  const favoriteIds = useMemo(() => new Set(query.data ?? []), [query.data]);

  const mutation = useMutation({
    mutationFn: async (foodId: number) => {
      if (!actor) throw new Error("Backend is not ready");
      return toggleFavorite(actor, foodId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
    },
  });

  const toggle = useCallback(
    (foodId: number) => {
      mutation.mutate(foodId);
    },
    [mutation],
  );

  return {
    favoriteIds,
    isFavorite: (foodId: number) => favoriteIds.has(foodId),
    toggle,
    count: favoriteIds.size,
    isLoading: query.isLoading,
  };
}
