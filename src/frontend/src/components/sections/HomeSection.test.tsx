/**
 * HomeSection — hero, featured strip, and the shared favorites state.
 *
 * Covers the accepted behavior that the featured strip shows all six dishes and
 * that a heart toggles a favorite through the backend and reflects the new state
 * while browsing.
 */
import { HomeSection } from "@/components/sections/HomeSection";
import { FOODS } from "@/data/foods";
import { createActorMock, renderWithProviders } from "@/test/helpers";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const actor = createActorMock();

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor, isFetching: false }),
}));

vi.mock("@/backend", () => ({
  createActor: vi.fn(),
}));

describe("HomeSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    actor.listFavorites.mockResolvedValue([]);
    actor.toggleFavorite.mockResolvedValue(true);
  });

  it("shows all six dishes in the featured strip", async () => {
    renderWithProviders(<HomeSection />);

    for (const food of FOODS) {
      expect(
        await screen.findByTestId(`food.card.${food.id}`),
      ).toBeInTheDocument();
      expect(screen.getByText(food.name)).toBeInTheDocument();
    }
  });

  it("toggles a favorite heart and reflects the new state", async () => {
    const user = userEvent.setup();
    const food = FOODS[0];
    actor.listFavorites
      .mockResolvedValueOnce([])
      .mockResolvedValue([BigInt(food.id)]);
    renderWithProviders(<HomeSection />);

    const heart = await screen.findByTestId(`food.favorite_button.${food.id}`);
    expect(heart).toHaveAttribute("aria-pressed", "false");

    await user.click(heart);

    await waitFor(() => {
      expect(actor.toggleFavorite).toHaveBeenCalledWith(BigInt(food.id));
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(`food.favorite_button.${food.id}`),
      ).toHaveAttribute("aria-pressed", "true");
    });
  });

  it("opens the details modal from a featured card's Explore Story button", async () => {
    const user = userEvent.setup();
    const food = FOODS[0];
    renderWithProviders(<HomeSection />);

    await user.click(
      await screen.findByTestId(`food.explore_button.${food.id}`),
    );

    expect(await screen.findByTestId("food.details.modal")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: food.name }),
    ).toBeInTheDocument();
  });

  it("shows a relevant food image for every featured dish", async () => {
    renderWithProviders(<HomeSection />);

    for (const food of FOODS) {
      const image = await screen.findByRole("img", {
        name: `${food.name} — ${food.origin}`,
      });
      expect(image).toHaveAttribute("src", food.image);
    }
  });

  it("shows the dish image inside the details modal", async () => {
    const user = userEvent.setup();
    const food = FOODS[0];
    renderWithProviders(<HomeSection />);

    await user.click(
      await screen.findByTestId(`food.explore_button.${food.id}`),
    );

    const modal = await screen.findByTestId("food.details.modal");
    expect(
      within(modal).getByRole("img", {
        name: `${food.name} — ${food.origin}`,
      }),
    ).toHaveAttribute("src", food.image);
  });
});
