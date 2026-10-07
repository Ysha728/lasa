/**
 * Background music hook.
 *
 * Rules baked in here:
 *  - Music NEVER auto-plays with sound. The audio element starts paused and
 *    muted, and only plays after an explicit user click.
 *  - The user's on/off preference is remembered in localStorage while browsing.
 *
 * The track lives at /assets/audio/lasa-theme.mp3 (royalty-free).
 */
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "lasa:music-enabled";
const TRACK_SRC = "/lasa/assets/audio/lasa-theme.mp3";

function readStoredPreference(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function useMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Start from the stored preference, but never actually play until a click.
  const [enabled, setEnabled] = useState<boolean>(readStoredPreference);
  const [isPlaying, setIsPlaying] = useState(false);

  // Create the audio element once, on the client.
  useEffect(() => {
    const audio = new Audio(TRACK_SRC);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = "none";
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  /** Explicit user action: flip the preference and start/stop the track. */
  const toggle = useCallback(() => {
    setEnabled((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Ignore storage failures (private mode, etc.).
      }
      if (next) {
        play();
      } else {
        pause();
      }
      return next;
    });
  }, [play, pause]);

  return { enabled, isPlaying, toggle };
}
