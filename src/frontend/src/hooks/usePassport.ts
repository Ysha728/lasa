/**
 * Flavor Passport hook.
 * Tracks explored dishes and updates stamps immediately.
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
        throw new Error("Backend is not ready.");
      }
      const result = await markExplored(actor, foodId);

      if (result === false) {
        throw new Error("The backend did not save this stamp.");
      }

      return foodId;
    },

    onMutate: async (foodId: number) => {
      await queryClient.cancelQueries({ queryKey: EXPLORED_KEY });

      const previousIds =
        queryClient.getQueryData<number[]>(EXPLORED_KEY) ?? [];

      queryClient.setQueryData<number[]>(
        EXPLORED_KEY,
        previousIds.includes(foodId)
          ? previousIds
          : [...previousIds, foodId],
      );

      return { previousIds };
    },

    onError: (error, _foodId, context) => {
      if (context) {
        queryClient.setQueryData(
          EXPLORED_KEY,
          context.previousIds,
        );
      }

      console.error("Flavor Passport error:", error);

      window.alert(
        `Stamp failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: EXPLORED_KEY,
      });
    },
  });

  const markVisited = useCallback(
    (foodId: number) => {
      window.alert(
        `Stamp tapped! Food ID: ${foodId}\n` +
          `Backend ready: ${!!actor && !isFetching}`,
      );

      if (exploredIds.has(foodId) || mutation.isPending) return;

      if (!actor || isFetching) {
        window.alert(
          "The backend is still connecting. Please try again.",
        );
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
      TOTAL_FOODS === 0
        ? 0
        : Math.round((collected / TOTAL_FOODS) * 100),
    isLoading: query.isLoading || isFetching,
  };
}
