/**
 * Shared test setup for the LASA frontend suite.
 *
 * - Registers the jest-dom matchers (`toBeInTheDocument`, `toHaveAttribute`, …).
 * - Points Testing Library's `getByTestId` at the app's `data-ocid` attribute,
 *   which is the stable hook the generated components expose.
 * - Provides a minimal `IntersectionObserver` and `scrollIntoView` because jsdom
 *   implements neither and the navbar's scroll-spy / hero CTA rely on them.
 */
import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach } from "vitest";

configure({ testIdAttribute: "data-ocid" });

// Testing Library's automatic cleanup only registers when Vitest globals are
// enabled. They are not, so unmount every render between tests explicitly.
afterEach(() => {
  cleanup();
});

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element): void {
    // Report the observed element as visible so scroll-spy has a deterministic
    // active section instead of depending on layout, which jsdom does not do.
    this.callback(
      [
        {
          target,
          isIntersecting: true,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRatio: 1,
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: 0,
        } as IntersectionObserverEntry,
      ],
      this,
    );
  }

  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (!("IntersectionObserver" in globalThis)) {
  Object.defineProperty(globalThis, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// jsdom does not implement media playback. The Music toggle creates an
// HTMLAudioElement and calls pause() on unmount, which jsdom reports as a
// "Not implemented" error. Stub the two methods so the noise stays out of the
// suite; the toggle's own state is what the tests assert on.
if (typeof HTMLMediaElement !== "undefined") {
  HTMLMediaElement.prototype.play = () => Promise.resolve();
  HTMLMediaElement.prototype.pause = () => {};
}
