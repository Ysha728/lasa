/**
 * SuggestionsBox — the "Suggest a Food" form.
 *
 * Covers the accepted behavior that a suggestion submits with Name (optional),
 * Suggestion text, and Category, and that the required suggestion text is
 * validated before the backend is called.
 */
import { SuggestionsBox } from "@/components/sections/SuggestionsBox";
import { createActorMock, renderWithProviders } from "@/test/helpers";
import type { Suggestion } from "@/types/lasa";
import { SuggestionCategory } from "@/types/lasa";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const actor = createActorMock();

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor, isFetching: false }),
}));

// Preserve the generated module's runtime exports (e.g. SuggestionCategory)
// while replacing only the actor factory.
vi.mock("@/backend", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/backend")>()),
  createActor: vi.fn(),
}));

const submittedSuggestion: Suggestion = {
  id: 3n,
  name: "Ana R.",
  text: "Please add sinigang!",
  category: SuggestionCategory.filipinoFood,
  createdAt: 1_700_000_000_000_000_000n,
};

describe("SuggestionsBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    actor.listSuggestions.mockResolvedValue([]);
    actor.submitSuggestion.mockResolvedValue(submittedSuggestion);
  });

  it("shows the empty state when there are no suggestions", async () => {
    renderWithProviders(<SuggestionsBox />);

    expect(
      await screen.findByTestId("suggestion.empty_state"),
    ).toBeInTheDocument();
  });

  it("requires suggestion text before submitting", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SuggestionsBox />);

    await user.click(screen.getByTestId("suggestion.submit_button"));

    expect(
      await screen.findByTestId("suggestion.error_state"),
    ).toHaveTextContent("Please tell us what you'd like to suggest.");
    expect(actor.submitSuggestion).not.toHaveBeenCalled();
  });

  it("submits a suggestion with name, text, and category", async () => {
    const user = userEvent.setup();
    actor.listSuggestions
      .mockResolvedValueOnce([])
      .mockResolvedValue([submittedSuggestion]);
    renderWithProviders(<SuggestionsBox />);

    await user.type(screen.getByTestId("suggestion.name_input"), "Ana R.");
    await user.type(
      screen.getByTestId("suggestion.textarea"),
      "Please add sinigang!",
    );
    await user.click(screen.getByTestId("suggestion.submit_button"));

    await waitFor(() => {
      expect(actor.submitSuggestion).toHaveBeenCalledWith({
        name: "Ana R.",
        text: "Please add sinigang!",
        category: SuggestionCategory.filipinoFood,
      });
    });

    expect(await screen.findByTestId("suggestion.item.3")).toBeInTheDocument();
    expect(screen.getByText("Please add sinigang!")).toBeInTheDocument();
  });

  it("omits the optional name when it is left blank", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SuggestionsBox />);

    await user.type(
      screen.getByTestId("suggestion.textarea"),
      "Add a dark mode toggle.",
    );
    await user.click(screen.getByTestId("suggestion.submit_button"));

    await waitFor(() => {
      expect(actor.submitSuggestion).toHaveBeenCalledWith({
        name: undefined,
        text: "Add a dark mode toggle.",
        category: SuggestionCategory.filipinoFood,
      });
    });
  });
});
