/**
 * FoodVideos — the "Food Videos" section.
 *
 * Renders a responsive grid of video cards from `@/data/videos`. Only one card
 * plays at a time: pressing play on a card opens its inline player and closes
 * any other. The video list is intentionally kept in `data/videos.ts` so real
 * videos can be swapped in without touching this component.
 */
import { Section } from "@/components/Section";
import { VideoCard } from "@/components/VideoCard";
import { FOOD_VIDEOS } from "@/data/videos";
import { useState } from "react";

export function FoodVideos() {
  // The id of the card currently showing its inline player, or null.
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <Section id="food-videos" label="Food Videos" className="bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section heading */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Watch &amp; Learn
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Food Videos
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Short clips that bring each dish to life — from the charcoal grill
            to the last spoonful. Press play to watch right here.
          </p>
        </header>

        {/* Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop. */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FOOD_VIDEOS.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              isPlaying={playingId === video.id}
              onPlay={setPlayingId}
              onClose={() => setPlayingId(null)}
            />
          ))}
        </div>

        {/* Friendly note explaining how to swap in real videos. */}
        <p className="mt-8 text-center font-mono text-xs text-muted-foreground">
          Videos are placeholders for now — replace them in{" "}
          <span className="text-primary">src/data/videos.ts</span>.
        </p>
      </div>
    </Section>
  );
}
