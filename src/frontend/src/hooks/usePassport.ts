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
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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

  const exploredIds = useMemo(
    () => new Set(query.data ?? []),
    [query.data],
  );

  const mutation = useMutation({
    mutationFn: async (foodId: number) => {
      if (!actor) {
        throw new Error("Backend is not ready. Please try again.");
      }
      return markExplored(actor, foodId);
    },

    onMutate: async (foodId: number) => {
      await queryClient.cancelQueries({ queryKey: EXPLORED_KEY });

      const previousIds =
        queryClient.getQueryData<number[]>(EXPLORED_KEY) ?? [];

      if (!previousIds.includes(foodId)) {
        queryClient.setQueryData<number[]>(
          EXPLORED_KEY,
          [...previousIds, foodId],
        );
      }

      return { previousIds };
    },

    onError: (_error, _foodId, context) => {
      if (context) {
        queryClient.setQueryData(EXPLORED_KEY, context.previousIds);
      }
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: EXPLORED_KEY });
    },
  });

  const markVisited = useCallback(
    (foodId: number) => {
      if (exploredIds.has(foodId) || mutation.isPending) return;

      if (!actor || isFetching) {
        console.error("Passport is waiting for the backend to connect.");
        return;
      }

      mutation.mutate(foodId);
    },
    [exploredIds, mutation, actor, isFetching],
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
    isLoading: query.isLoading || isFetching,
  };
}

