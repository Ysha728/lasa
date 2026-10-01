/**
 * FollowUs — the "Follow Our Food Journey" social call to action.
 *
 * Covers the accepted behavior that every configured social link renders as a
 * button whose href comes from the shared `SOCIAL_LINKS` data, so the group can
 * swap in their real pages later without touching the component.
 */
import { FollowUs } from "@/components/sections/FollowUs";
import { SOCIAL_LINKS } from "@/data/sections";
import { renderWithProviders } from "@/test/helpers";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("FollowUs", () => {
  it("renders the section heading", () => {
    renderWithProviders(<FollowUs />);

    expect(
      screen.getByRole("heading", { name: "Follow Our Food Journey" }),
    ).toBeInTheDocument();
  });

  it("renders a social button for every configured link", () => {
    renderWithProviders(<FollowUs />);

    SOCIAL_LINKS.forEach((link, index) => {
      const anchor = screen.getByTestId(`follow.link.${index + 1}`);
      expect(anchor).toHaveAttribute("href", link.href);
      expect(anchor).toHaveAccessibleName(`Follow LASA on ${link.label}`);
      expect(anchor).toHaveAttribute("target", "_blank");
      expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
