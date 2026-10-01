/**
 * App — the LASA single-page application root.
 *
 * A smoke journey: the default route renders without a blank screen, the hero
 * tagline and call-to-action are present, and every section anchor the navbar
 * links to is mounted. This is component/integration coverage, not a deployed
 * browser end-to-end run.
 */
import App from "@/App";
import { SECTIONS, TAGLINE } from "@/data/sections";
import { createActorMock, renderWithProviders } from "@/test/helpers";
import { screen } from "@testing-library/react";
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

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the hero without a blank screen", async () => {
    renderWithProviders(<App />);

    expect(
      await screen.findByRole("heading", { name: "LASA", level: 1 }),
    ).toBeInTheDocument();
    // The tagline appears in both the navbar subtitle and the hero.
    expect(screen.getAllByText(TAGLINE).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: /start exploring/i }),
    ).toBeInTheDocument();
  });

  it("mounts an anchor for every registered section", async () => {
    renderWithProviders(<App />);

    // Wait for the first section to settle before asserting on the rest.
    await screen.findByRole("heading", { name: "LASA", level: 1 });

    const missing = SECTIONS.filter(
      (section) => document.getElementById(section.id) === null,
    ).map((section) => section.id);

    expect(missing).toEqual([]);
  });

  it("shows the LASA wordmark and the Music toggle in the shell", async () => {
    renderWithProviders(<App />);

    expect((await screen.findAllByText("LASA")).length).toBeGreaterThan(0);
    expect(screen.getByTestId("music.toggle")).toBeInTheDocument();
  });
});
