/**
 * Navbar — sticky header, desktop links, and the mobile hamburger panel.
 *
 * Covers the accepted behavior that the hamburger opens a slide-in panel and
 * that tapping a link closes it, plus the presence of the LASA wordmark and the
 * Music toggle.
 */
import { Navbar } from "@/components/Navbar";
import { SECTIONS } from "@/data/sections";
import { renderWithProviders } from "@/test/helpers";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: null, isFetching: false }),
}));

vi.mock("@/backend", () => ({
  createActor: vi.fn(),
}));

describe("Navbar", () => {
  it("renders the LASA wordmark and the Music toggle", () => {
    renderWithProviders(<Navbar />);

    expect(screen.getByText("LASA")).toBeInTheDocument();
    expect(screen.getByTestId("music.toggle")).toBeInTheDocument();
  });

  it("renders a desktop link for every registered section", () => {
    renderWithProviders(<Navbar />);

    const primary = screen.getByRole("navigation", { name: "Primary" });
    for (const section of SECTIONS) {
      expect(
        within(primary).getByRole("link", { name: section.shortLabel }),
      ).toHaveAttribute("href", `#${section.id}`);
    }
  });

  it("opens the mobile panel from the hamburger and closes it on a link tap", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);

    const menuButton = screen.getByTestId("nav.menu_button");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
    const homeLink = within(mobileNav).getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("href", "#home");

    await user.click(homeLink);
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile panel with the close button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);

    await user.click(screen.getByTestId("nav.menu_button"));
    expect(screen.getByTestId("nav.menu_button")).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    await user.click(screen.getByTestId("nav.close_button"));
    expect(screen.getByTestId("nav.menu_button")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
