/**
 * AboutUs — the student-project story and the LASA journey steps.
 *
 * Covers the accepted behavior that the section describes the LASA student
 * project and renders the numbered journey steps.
 */
import { AboutUs } from "@/components/sections/AboutUs";
import { renderWithProviders } from "@/test/helpers";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("AboutUs", () => {
  it("describes the LASA student project", () => {
    renderWithProviders(<AboutUs />);

    expect(
      screen.getByRole("heading", {
        name: "A student project with a big appetite",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/LASA began in a classroom with a simple question/),
    ).toBeInTheDocument();
  });

  it("renders the seven journey steps", () => {
    renderWithProviders(<AboutUs />);

    expect(
      screen.getByRole("heading", { name: "Your LASA journey" }),
    ).toBeInTheDocument();

    const steps = [
      "Discover",
      "Watch",
      "Read",
      "Rate",
      "Comment",
      "Suggest",
      "Follow",
    ];
    steps.forEach((title, index) => {
      expect(screen.getByTestId(`about.step.${index + 1}`)).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: title, level: 4 }),
      ).toBeInTheDocument();
    });
  });
});
