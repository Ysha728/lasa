/**
 * Flavor Passport hook.
 *
 * The passport tracks which dishes the visitor has explored. Explored ids are
 * stored on the backend (per caller) and mirrored locally so the passport
 * stamps update immediately.
 */
import { createActor } from "@/backend";
import { TOTAL_FOODS } from "@/data/foods";
import { listExplored, markExplored } from "@/lib/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

const EXPLORED_KEY = ["explored"] as const;

export function usePassport() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: EXPLORED_KEY,
    queryFn: async () => {
      if (!actor) return [] as number[];
      return listExplored(actor);
    },
    enabled: !!actor && !isFetching,
  });

  const exploredIds = useMemo(() => new Set(query.data ?? []), [query.data]);

  const mutation = useMutation({
    mutationFn: async (foodId: number) => {
      if (!actor) throw new Error("Backend is not ready");
      return markExplored(actor, foodId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: EXPLORED_KEY });
    },
  });

  const markVisited = useCallback(
    (foodId: number) => {
      if (exploredIds.has(foodId)) return;
      mutation.mutate(foodId);
    },
    [exploredIds, mutation],
  );

  const collected = exploredIds.size;

  return {
    exploredIds,
    isExplored: (foodId: number) => exploredIds.has(foodId),
    markVisited,
    collected,
    total: TOTAL_FOODS,
    progress:
      TOTAL_FOODS === 0 ? 0 : Math.round((collected / TOTAL_FOODS) * 100),
    isLoading: query.isLoading,
  };
}
