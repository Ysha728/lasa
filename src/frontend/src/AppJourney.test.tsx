/**
 * AppJourney — critical end-to-end journeys across the real App composition.
 *
 * These render the whole application (Layout + every section) with a typed
 * local actor mock, so they exercise the seams between the navbar, the food
 * catalog, the details modal, and the favorites state. This is
 * component/integration coverage, not a deployed browser end-to-end run.
 *
 * The Home featured strip and the catalog both render the same dishes, so
 * catalog assertions are scoped to the `local-flavors` / `international-flavors`
 * sections rather than the whole document.
 */
import App from "@/App";
import { FOODS } from "@/data/foods";
import { createActorMock, renderWithProviders } from "@/test/helpers";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const actor = createActorMock();

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor, isFetching: false }),
}));

vi.mock("@/backend", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/backend")>()),
  createActor: vi.fn(),
}));

/** The catalog section element for a given anchor id. */
function catalogSection(id: "local-flavors" | "international-flavors") {
  const element = document.getElementById(id);
  if (element === null) throw new Error(`section #${id} is not mounted`);
  return within(element);
}

describe("App critical journeys", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    actor.listFavorites.mockResolvedValue([]);
    actor.listExplored.mockResolvedValue([]);
    actor.listReviews.mockResolvedValue([]);
    actor.listComments.mockResolvedValue([]);
    actor.listSuggestions.mockResolvedValue([]);
    actor.toggleFavorite.mockResolvedValue(true);
  });

  it("filters the catalog and opens a dish's full story from the app shell", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    // The catalog starts with all six dishes split across the two sections.
    await screen.findByRole("heading", { name: "LASA", level: 1 });
    const local = catalogSection("local-flavors");
    const international = catalogSection("international-flavors");
    for (const food of FOODS) {
      const scope = food.category === "local" ? local : international;
      expect(await scope.findByText(food.name)).toBeInTheDocument();
    }

    // Filtering to Local hides the international section entirely.
    await user.click(screen.getByTestId("food.filter.local_tab"));
    expect(
      document.getElementById("international-flavors"),
    ).not.toBeInTheDocument();
    expect(local.getByText("Chicken Inasal")).toBeInTheDocument();

    // Explore Story opens the details modal with the full story fields.
    await user.click(local.getByTestId("food.explore_button.1"));
    const modal = await screen.findByTestId("food.details.modal");
    expect(
      within(modal).getByRole("heading", { name: /Chicken Inasal/ }),
    ).toBeInTheDocument();
    expect(within(modal).getByText("History")).toBeInTheDocument();
    expect(within(modal).getByText("Ingredients")).toBeInTheDocument();
    expect(within(modal).getByText("Preparation")).toBeInTheDocument();
    expect(
      within(modal).getByText("Cultural Significance"),
    ).toBeInTheDocument();
    expect(within(modal).getByText("Interesting Facts")).toBeInTheDocument();
  });

  it("toggles a favorite from the catalog and reflects it in the app", async () => {
    const user = userEvent.setup();
    const food = FOODS[0];
    actor.listFavorites
      .mockResolvedValueOnce([])
      .mockResolvedValue([BigInt(food.id)]);
    renderWithProviders(<App />);

    // The featured strip and the catalog each render a heart for this dish.
    const hearts = await screen.findAllByTestId(
      `food.favorite_button.${food.id}`,
    );
    expect(hearts.length).toBeGreaterThan(0);
    for (const heart of hearts) {
      expect(heart).toHaveAttribute("aria-pressed", "false");
    }

    await user.click(hearts[0]);

    await waitFor(() => {
      expect(actor.toggleFavorite).toHaveBeenCalledWith(BigInt(food.id));
    });
    await waitFor(() => {
      for (const heart of screen.getAllByTestId(
        `food.favorite_button.${food.id}`,
      )) {
        expect(heart).toHaveAttribute("aria-pressed", "true");
      }
    });
  });

  it("opens the mobile menu and navigates to a section", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await screen.findByRole("heading", { name: "LASA", level: 1 });

    const menuButton = screen.getByTestId("nav.menu_button");
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
    const faqLink = within(mobileNav).getByRole("link", { name: "FAQ" });
    expect(faqLink).toHaveAttribute("href", "#faq");

    await user.click(faqLink);
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });
});
