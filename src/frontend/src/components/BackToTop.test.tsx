/**
 * BackToTop — the floating button that appears after scrolling down.
 *
 * Covers the accepted behavior that the button is hidden at the top, appears
 * once the visitor scrolls past the threshold, and returns the page to the top
 * when clicked.
 */
import { BackToTop } from "@/components/BackToTop";
import { renderWithProviders } from "@/test/helpers";
import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/** Set window.scrollY and fire the scroll event the component listens for. */
function scrollTo(y: number) {
  Object.defineProperty(window, "scrollY", {
    writable: true,
    configurable: true,
    value: y,
  });
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("BackToTop", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("is hidden while the page is at the top", () => {
    renderWithProviders(<BackToTop />);

    const button = screen.getByTestId("back_to_top.button");
    expect(button).toHaveClass("opacity-0");
  });

  it("appears after the visitor scrolls down", () => {
    renderWithProviders(<BackToTop />);

    scrollTo(600);

    expect(screen.getByTestId("back_to_top.button")).toHaveClass("opacity-100");
  });

  it("scrolls back to the top when clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BackToTop />);

    scrollTo(600);

    await user.click(screen.getByTestId("back_to_top.button"));

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
