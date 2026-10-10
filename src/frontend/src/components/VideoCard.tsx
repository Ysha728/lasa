
import { Badge } from "@/components/ui/badge";
import type { FoodVideo } from "@/data/videos";
import { cn } from "@/lib/utils";
import { Play, Video } from "lucide-react";

interface VideoCardProps {
  video: FoodVideo;
  isPlaying: boolean;
  onPlay: (videoId: string) => void;
  onClose: () => void;
  className?: string;
}

export function VideoCard({
  video,
  isPlaying,
  onPlay,
  onClose,
  className,
}: VideoCardProps) {
  const isYouTube = video.videoUrl.includes("youtube.com/embed/") ||
    video.videoUrl.includes("youtube-nocookie.com/embed/");

  return (
    <article
      data-ocid={`video.card.${video.id}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated",
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {isPlaying ? (
          <div className="h-full w-full bg-foreground/90">
            {video.videoUrl ? (
              isYouTube ? (
                <iframe
                  data-ocid={`video.player.${video.id}`}
                  src={video.videoUrl}
                  title={video.title}
                  className="h-full w-full"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  data-ocid={`video.player.${video.id}`}
                  src={video.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-cover"
                >
                  <track kind="captions" />
                </video>
              )
            ) : (
              <div
                data-ocid={`video.placeholder_state.${video.id}`}
                className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center"
              >
                <Video
                  className="h-8 w-8 text-primary-foreground/80"
                  aria-hidden="true"
                />
                <p className="font-display text-base font-semibold text-primary-foreground">
                  Video coming soon
                </p>
                <p className="text-xs leading-relaxed text-primary-foreground/70">
                  Add a real video link in{" "}
                  <span className="font-mono">data/videos.ts</span> to play it
                  here.
                </p>
              </div>
            )}

            <button
              type="button"
              data-ocid={`video.close_button.${video.id}`}
              aria-label={`Close ${video.title} player`}
              onClick={onClose}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-card/90 text-foreground backdrop-blur transition-smooth hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ×
              </span>
            </button>
          </div>
        ) : (
          <>
            <img
              src={video.thumbnail}
              alt={`${video.title} video thumbnail`}
              loading="lazy"
              className="h-full w-full object-cover transition-smooth group-hover:scale-105"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent"
            />
            <button
              type="button"
              data-ocid={`video.play_button.${video.id}`}
              aria-label={`Play video: ${video.title}`}
              onClick={() => onPlay(video.id)}
              className="absolute inset-0 grid place-items-center focus-visible:outline-none"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow transition-spring group-hover:scale-110">
                <Play
                  className="h-6 w-6 translate-x-0.5 fill-current"
                  aria-hidden="true"
                />
              </span>
            </button>
            {video.isPlaceholder && (
              <Badge
                variant="secondary"
                className="absolute left-3 top-3 rounded-full border border-border/60 bg-card/90 font-mono text-[0.6rem] uppercase tracking-wider text-secondary-foreground backdrop-blur"
              >
                Placeholder video — replace later
              </Badge>
            )}
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg font-semibold leading-tight text-card-foreground">
          {video.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {video.description}
        </p>
      </div>
    </article>
  );
}
