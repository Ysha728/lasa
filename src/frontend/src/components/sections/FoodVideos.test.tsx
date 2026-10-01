/**
 * FoodVideos — the responsive video card grid.
 *
 * Covers the accepted behavior that every configured video renders a card with
 * a thumbnail, title, description, and play button, and that pressing play
 * swaps in the inline player (a placeholder notice while the clip is a stand-in)
 * and can be closed again.
 */
import { FoodVideos } from "@/components/sections/FoodVideos";
import { FOOD_VIDEOS } from "@/data/videos";
import { renderWithProviders } from "@/test/helpers";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("FoodVideos", () => {
  it("renders a card with thumbnail, title, description, and play button for every video", () => {
    renderWithProviders(<FoodVideos />);

    for (const video of FOOD_VIDEOS) {
      expect(screen.getByTestId(`video.card.${video.id}`)).toBeInTheDocument();
      expect(
        screen.getByRole("img", { name: `${video.title} video thumbnail` }),
      ).toBeInTheDocument();
      expect(screen.getByText(video.title)).toBeInTheDocument();
      expect(screen.getByText(video.description)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: `Play video: ${video.title}` }),
      ).toBeInTheDocument();
    }
  });

  it("opens the inline player on play and closes it again", async () => {
    const user = userEvent.setup();
    const video = FOOD_VIDEOS[0];
    renderWithProviders(<FoodVideos />);

    await user.click(
      screen.getByRole("button", { name: `Play video: ${video.title}` }),
    );

    // Placeholder clips show a friendly notice instead of a real <video>.
    expect(
      screen.getByTestId(`video.placeholder_state.${video.id}`),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: `Close ${video.title} player` }),
    );

    expect(
      screen.queryByTestId(`video.placeholder_state.${video.id}`),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: `Play video: ${video.title}` }),
    ).toBeInTheDocument();
  });

  it("plays only one card at a time", async () => {
    const user = userEvent.setup();
    const [first, second] = FOOD_VIDEOS;
    renderWithProviders(<FoodVideos />);

    await user.click(
      screen.getByRole("button", { name: `Play video: ${first.title}` }),
    );
    await user.click(
      screen.getByRole("button", { name: `Play video: ${second.title}` }),
    );

    expect(
      screen.queryByTestId(`video.placeholder_state.${first.id}`),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId(`video.placeholder_state.${second.id}`),
    ).toBeInTheDocument();
  });
});
