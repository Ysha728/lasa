/**
 * Comments — the food-related comments / reactions area.
 *
 * Covers the accepted behavior that a submitted comment appears in the list,
 * plus the required-field validation and the empty state.
 */
import { Comments } from "@/components/sections/Comments";
import { createActorMock, renderWithProviders } from "@/test/helpers";
import type { Comment } from "@/types/lasa";
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

const submittedComment: Comment = {
  id: 7n,
  foodId: 1n,
  authorName: "Juan D.",
  text: "That charred skin is everything.",
  createdAt: 1_700_000_000_000_000_000n,
};

describe("Comments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    actor.listComments.mockResolvedValue([]);
    actor.submitComment.mockResolvedValue(submittedComment);
  });

  it("shows the empty state when there are no comments", async () => {
    renderWithProviders(<Comments />);

    expect(
      await screen.findByTestId("comment.empty_state"),
    ).toBeInTheDocument();
  });

  it("requires a name and a comment before posting", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Comments />);

    await user.click(screen.getByTestId("comment.submit_button"));
    expect(await screen.findByTestId("comment.error_state")).toHaveTextContent(
      "Please add your name before posting.",
    );

    await user.type(screen.getByTestId("comment.name_input"), "Juan D.");
    await user.click(screen.getByTestId("comment.submit_button"));
    expect(await screen.findByTestId("comment.error_state")).toHaveTextContent(
      "Please write a comment or reaction.",
    );
    expect(actor.submitComment).not.toHaveBeenCalled();
  });

  it("submits a comment and renders it in the list", async () => {
    const user = userEvent.setup();
    actor.listComments
      .mockResolvedValueOnce([])
      .mockResolvedValue([submittedComment]);
    renderWithProviders(<Comments />);

    await user.type(screen.getByTestId("comment.name_input"), "Juan D.");
    await user.type(
      screen.getByTestId("comment.textarea"),
      "That charred skin is everything.",
    );
    await user.click(screen.getByTestId("comment.submit_button"));

    await waitFor(() => {
      expect(actor.submitComment).toHaveBeenCalledWith({
        foodId: 1n,
        authorName: "Juan D.",
        text: "That charred skin is everything.",
      });
    });

    expect(await screen.findByTestId("comment.item.7")).toBeInTheDocument();
    expect(
      screen.getByText("That charred skin is everything."),
    ).toBeInTheDocument();
    expect(screen.getByText("Juan D.")).toBeInTheDocument();
  });

  it("shows a submit error when the backend rejects the comment", async () => {
    const user = userEvent.setup();
    actor.submitComment.mockRejectedValue(new Error("trap"));
    renderWithProviders(<Comments />);

    await user.type(screen.getByTestId("comment.name_input"), "Ana R.");
    await user.type(screen.getByTestId("comment.textarea"), "Sarap!");
    await user.click(screen.getByTestId("comment.submit_button"));

    expect(
      await screen.findByTestId("comment.submit_error_state"),
    ).toBeInTheDocument();
  });
});
