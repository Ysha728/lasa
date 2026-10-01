/**
 * Faq — the expandable question-and-answer accordion.
 *
 * Covers the accepted behavior that a question expands to reveal its answer and
 * collapses again, and that every configured question is rendered.
 */
import { Faq } from "@/components/sections/Faq";
import { FAQ_ITEMS } from "@/data/faq";
import { renderWithProviders } from "@/test/helpers";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("Faq", () => {
  it("renders every configured question", () => {
    renderWithProviders(<Faq />);

    for (const item of FAQ_ITEMS) {
      expect(
        screen.getByRole("button", { name: item.question }),
      ).toBeInTheDocument();
    }
  });

  it("expands a question to show its answer and collapses it again", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Faq />);

    const first = FAQ_ITEMS[0];
    const trigger = screen.getByRole("button", { name: first.question });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByText(first.answer)).toBeVisible();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps only one answer open at a time", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Faq />);

    const [first, second] = FAQ_ITEMS;
    await user.click(screen.getByRole("button", { name: first.question }));
    await user.click(screen.getByRole("button", { name: second.question }));

    expect(
      screen.getByRole("button", { name: first.question }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("button", { name: second.question }),
    ).toHaveAttribute("aria-expanded", "true");
  });
});
