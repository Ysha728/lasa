import { TOTAL_FOODS } from "@/data/foods";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "lasa-explored-foods";

function loadExplored(): number[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return [
      ...new Set(
        parsed.filter(
          (id): id is number =>
            typeof id === "number" &&
            Number.isInteger(id) &&
            id >= 1 &&
            id <= TOTAL_FOODS,
        ),
      ),
    ];
  } catch {
    return [];
  }
}

export function usePassport() {
  const [exploredIds, setExploredIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setExploredIds(loadExplored());
    setIsLoading(false);
  }, []);

  const markVisited = useCallback((foodId: number) => {
    if (
      !Number.isInteger(foodId) ||
      foodId < 1 ||
      foodId > TOTAL_FOODS
    ) {
      return;
    }

    setExploredIds((previous) => {
      const updated = previous.includes(foodId)
        ? previous.filter((id) => id !== foodId)
        : [...previous, foodId];

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      } catch (error) {
        console.error("Could not save Flavor Passport:", error);
        window.alert(
          "Could not update your passport. Please check browser storage.",
        );
        return previous;
      }
    });
  }, []);

  const exploredSet = new Set(exploredIds);
  const collected = exploredIds.length;

  return {
    exploredIds: exploredSet,
    isExplored: (foodId: number) => exploredSet.has(foodId),
    markVisited,
    collected,
    total: TOTAL_FOODS,
    progress:
      TOTAL_FOODS === 0
        ? 0
        : Math.round((collected / TOTAL_FOODS) * 100),
    isLoading,
  };
}

