/**
 * FoodCatalog — filter controls and the shared details modal.
 *
 * Covers the accepted behavior that filtering by All / Local / International
 * updates the visible cards, and that "Explore Story" opens a details modal
 * showing the full story fields for the chosen dish.
 */
import { FoodCatalog } from "@/components/sections/FoodCatalog";
import { FOODS } from "@/data/foods";
import { createActorMock, renderWithProviders } from "@/test/helpers";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const actor = createActorMock();

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor, isFetching: false }),
}));

vi.mock("@/backend", () => ({
  createActor: vi.fn(),
}));

describe("FoodCatalog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows all six dishes with their origin labels by default", () => {
    renderWithProviders(<FoodCatalog />);

    for (const food of FOODS) {
      expect(screen.getByText(food.name)).toBeInTheDocument();
      expect(screen.getByText(food.origin)).toBeInTheDocument();
    }
  });

  it("filters to local dishes only", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FoodCatalog />);

    await user.click(screen.getByTestId("food.filter.local_tab"));

    expect(screen.getByText("Chicken Inasal")).toBeInTheDocument();
    expect(screen.getByText("Laing")).toBeInTheDocument();
    expect(screen.getByText("Bulalo")).toBeInTheDocument();
    expect(screen.queryByText("Pizza")).not.toBeInTheDocument();
    expect(screen.queryByText("Paella")).not.toBeInTheDocument();
    expect(screen.queryByText("Hamburger")).not.toBeInTheDocument();
  });

  it("filters to international dishes only", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FoodCatalog />);

    await user.click(screen.getByTestId("food.filter.international_tab"));

    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(screen.getByText("Paella")).toBeInTheDocument();
    expect(screen.getByText("Hamburger")).toBeInTheDocument();
    expect(screen.queryByText("Chicken Inasal")).not.toBeInTheDocument();
    expect(screen.queryByText("Laing")).not.toBeInTheDocument();
    expect(screen.queryByText("Bulalo")).not.toBeInTheDocument();
  });

  it("returns to all dishes when the All filter is reselected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FoodCatalog />);

    await user.click(screen.getByTestId("food.filter.local_tab"));
    expect(screen.queryByText("Pizza")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("food.filter.all_tab"));
    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(screen.getByText("Chicken Inasal")).toBeInTheDocument();
  });

  it("opens a details modal with the full story for the chosen dish", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FoodCatalog />);

    await user.click(screen.getByTestId("food.explore_button.1"));

    const modal = screen.getByTestId("food.details.modal");
    expect(
      within(modal).getByRole("heading", { name: /Chicken Inasal/ }),
    ).toBeInTheDocument();
    expect(
      within(modal).getByText(/Philippines · Bacolod City, Negros Occidental/),
    ).toBeInTheDocument();
    expect(within(modal).getByText("History")).toBeInTheDocument();
    expect(within(modal).getByText("Ingredients")).toBeInTheDocument();
    expect(within(modal).getByText("Preparation")).toBeInTheDocument();
    expect(
      within(modal).getByText("Cultural Significance"),
    ).toBeInTheDocument();
    expect(within(modal).getByText("Interesting Facts")).toBeInTheDocument();
  });

  it("closes the details modal with the close button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FoodCatalog />);

    await user.click(screen.getByTestId("food.explore_button.4"));
    expect(screen.getByTestId("food.details.modal")).toBeInTheDocument();

    await user.click(screen.getByTestId("food.details.close_button"));
    expect(screen.queryByTestId("food.details.modal")).not.toBeInTheDocument();
  });
});
