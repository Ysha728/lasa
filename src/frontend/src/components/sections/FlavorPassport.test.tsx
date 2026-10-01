/**
 * FlavorPassport — collect a stamp for each explored dish.
 *
 * Covers the accepted behavior that the passport starts empty, that tapping an
 * uncollected stamp marks the dish explored and updates the progress count, and
 * that already-collected stamps are disabled.
 */
import { FlavorPassport } from "@/components/sections/FlavorPassport";
import { FOODS, TOTAL_FOODS } from "@/data/foods";
import { createActorMock, renderWithProviders } from "@/test/helpers";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const actor = createActorMock();

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor, isFetching: false }),
}));

vi.mock("@/backend", () => ({
  createActor: vi.fn(),
}));

describe("FlavorPassport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    actor.listExplored.mockResolvedValue([]);
    actor.markExplored.mockResolvedValue(true);
  });

  it("starts with an empty passport and a stamp for every dish", async () => {
    renderWithProviders(<FlavorPassport />);

    expect(
      await screen.findByTestId("passport.progress_count"),
    ).toHaveTextContent(`0 of ${TOTAL_FOODS} collected`);

    for (const food of FOODS) {
      expect(
        screen.getByTestId(`passport.stamp.${food.id}`),
      ).toBeInTheDocument();
    }
  });

  it("collects a stamp and updates the progress count", async () => {
    const user = userEvent.setup();
    const food = FOODS[0];
    actor.listExplored
      .mockResolvedValueOnce([])
      .mockResolvedValue([BigInt(food.id)]);
    renderWithProviders(<FlavorPassport />);

    const stamp = await screen.findByTestId(`passport.stamp.${food.id}`);
    expect(stamp).toHaveAttribute("aria-pressed", "false");

    await user.click(stamp);

    await waitFor(() => {
      expect(actor.markExplored).toHaveBeenCalledWith(BigInt(food.id));
    });

    expect(
      await screen.findByTestId("passport.progress_count"),
    ).toHaveTextContent(`1 of ${TOTAL_FOODS} collected`);
    expect(screen.getByTestId(`passport.stamp.${food.id}`)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("renders already-collected stamps as disabled", async () => {
    actor.listExplored.mockResolvedValue([BigInt(FOODS[0].id)]);
    renderWithProviders(<FlavorPassport />);

    const stamp = await screen.findByTestId(`passport.stamp.${FOODS[0].id}`);
    await waitFor(() => {
      expect(stamp).toHaveAttribute("aria-pressed", "true");
    });
    expect(stamp).toBeDisabled();
  });
});
