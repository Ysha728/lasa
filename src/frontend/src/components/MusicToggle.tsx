/**
 * MusicToggle — a visible Music On/Off pill button.
 *
 * Music never auto-plays with sound: this button is the only way to start it,
 * and the preference is remembered while browsing (see useMusic).
 */
import { useMusic } from "@/hooks/useMusic";
import { cn } from "@/lib/utils";
import { Music, VolumeX } from "lucide-react";

export function MusicToggle({ className }: { className?: string }) {
  const { enabled, isPlaying, toggle } = useMusic();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={
        enabled ? "Turn background music off" : "Turn background music on"
      }
      data-ocid="music.toggle"
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/70 px-3 py-2 text-xs font-mono font-semibold uppercase tracking-[0.15em] text-primary transition-smooth hover:-translate-y-0.5 hover:border-primary hover:shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {enabled ? (
        <Music
          className={cn("size-4", isPlaying && "animate-pulse-soft")}
          aria-hidden="true"
        />
      ) : (
        <VolumeX className="size-4" aria-hidden="true" />
      )}
      <span className="hidden sm:inline">
        {enabled ? "Music On" : "Music Off"}
      </span>
    </button>
  );
}
