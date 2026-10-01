/**
 * MusicToggle — the visible Music On/Off button.
 *
 * Covers the accepted behavior that music never auto-plays with sound, that the
 * button reflects the off state on first load, and that clicking it toggles the
 * preference (persisted to localStorage).
 */
import { MusicToggle } from "@/components/MusicToggle";
import { renderWithProviders } from "@/test/helpers";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("MusicToggle", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts in the off state and never auto-plays", () => {
    renderWithProviders(<MusicToggle />);

    const button = screen.getByTestId("music.toggle");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveAccessibleName("Turn background music on");
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it("turns music on when clicked and remembers the preference", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MusicToggle />);

    await user.click(screen.getByTestId("music.toggle"));

    const button = screen.getByTestId("music.toggle");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAccessibleName("Turn background music off");
    expect(window.localStorage.getItem("lasa:music-enabled")).toBe("true");
  });

  it("turns music back off when clicked again", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MusicToggle />);

    const button = screen.getByTestId("music.toggle");
    await user.click(button);
    await user.click(button);

    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(window.localStorage.getItem("lasa:music-enabled")).toBe("false");
  });
});
