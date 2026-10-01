/**
 * Reviews — star rating, review submission, and the average summary.
 *
 * Covers the accepted behavior that picking stars and submitting a review adds
 * a review card and updates the average rating, plus the validation path when
 * the form is incomplete.
 */
import { Reviews } from "@/components/sections/Reviews";
import { createActorMock, renderWithProviders } from "@/test/helpers";
import type { Review } from "@/types/lasa";
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

const submittedReview: Review = {
  id: 1n,
  foodId: 1n,
  reviewerName: "Maria S.",
  rating: 5n,
  text: "The smoky grill flavor is unforgettable.",
  createdAt: 1_700_000_000_000_000_000n,
};

describe("Reviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    actor.listReviews.mockResolvedValue([]);
    actor.getReviewStats.mockResolvedValue({
      foodId: 1n,
      count: 0n,
      average: 0,
    });
    actor.submitReview.mockResolvedValue(submittedReview);
  });

  it("shows the empty state and the 'Share your LASA experience!' message", async () => {
    renderWithProviders(<Reviews />);

    expect(await screen.findByTestId("review.empty_state")).toBeInTheDocument();
    expect(screen.getByText("Share your LASA experience!")).toBeInTheDocument();
  });

  it("validates that a star rating is required before submitting", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Reviews />);

    await user.type(screen.getByTestId("review.name_input"), "Maria S.");
    await user.type(
      screen.getByTestId("review.textarea"),
      "Loved every bite of this dish.",
    );
    await user.click(screen.getByTestId("review.submit_button"));

    expect(await screen.findByTestId("review.error_state")).toHaveTextContent(
      "Please pick a star rating first.",
    );
    expect(actor.submitReview).not.toHaveBeenCalled();
  });

  it("submits a review and renders it as a card", async () => {
    const user = userEvent.setup();
    // First load is empty; the post-submit invalidation refetch returns the
    // newly created review, which is what the user should see.
    actor.listReviews
      .mockResolvedValueOnce([])
      .mockResolvedValue([submittedReview]);
    renderWithProviders(<Reviews />);

    await user.click(screen.getByTestId("review.rating.5"));
    await user.type(screen.getByTestId("review.name_input"), "Maria S.");
    await user.type(
      screen.getByTestId("review.textarea"),
      "The smoky grill flavor is unforgettable.",
    );
    await user.click(screen.getByTestId("review.submit_button"));

    await waitFor(() => {
      expect(actor.submitReview).toHaveBeenCalledWith({
        foodId: 1n,
        reviewerName: "Maria S.",
        rating: 5n,
        text: "The smoky grill flavor is unforgettable.",
      });
    });

    // The list query is invalidated on success; the refreshed list shows the card.
    expect(await screen.findByTestId("review.card.1")).toBeInTheDocument();
    expect(
      screen.getByText("The smoky grill flavor is unforgettable."),
    ).toBeInTheDocument();
    expect(screen.getByText("Maria S.")).toBeInTheDocument();
  });

  it("shows the average rating from the backend stats", async () => {
    actor.getReviewStats.mockResolvedValue({
      foodId: 1n,
      count: 2n,
      average: 4.5,
    });
    renderWithProviders(<Reviews />);

    expect(await screen.findByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("Based on 2 reviews.")).toBeInTheDocument();
  });

  it("shows a submit error when the backend rejects the review", async () => {
    const user = userEvent.setup();
    actor.submitReview.mockRejectedValue(new Error("trap"));
    renderWithProviders(<Reviews />);

    await user.click(screen.getByTestId("review.rating.3"));
    await user.type(screen.getByTestId("review.name_input"), "Juan D.");
    await user.type(screen.getByTestId("review.textarea"), "A solid dish.");
    await user.click(screen.getByTestId("review.submit_button"));

    expect(
      await screen.findByTestId("review.submit_error_state"),
    ).toBeInTheDocument();
  });

  it("renders the star selector as a labelled radio group", async () => {
    renderWithProviders(<Reviews />);

    const group = await screen.findByRole("group", { name: "Your rating" });
    expect(within(group).getAllByRole("radio")).toHaveLength(5);
  });
});
