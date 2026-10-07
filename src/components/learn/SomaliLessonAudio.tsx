"use client";

import { useMemo, useRef, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export type SomaliLessonAudioProps = {
  audioUrl?: string | null;
  audioPath?: string | null;
  title?: string;
};

function resolveAudioUrl(audioUrl?: string | null, audioPath?: string | null) {
  if (audioUrl) return audioUrl;
  if (!audioPath) return null;

  const trimmed = audioPath.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/lesson-audio/${trimmed.replace(/^\/+/, "")}`;
  }

  return `/${trimmed.replace(/^\/+/, "")}`;
}

export default function SomaliLessonAudio({ audioUrl, audioPath, title }: SomaliLessonAudioProps) {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const resolvedUrl = useMemo(() => resolveAudioUrl(audioUrl, audioPath), [audioUrl, audioPath]);

  if (!resolvedUrl) {
    return null;
  }

  const togglePlayback = async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setHasError(false);
      } catch {
        setHasError(true);
      }
      return;
    }

    audioRef.current.pause();
    setIsPlaying(false);
  };

  if (hasError) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={isPlaying ? t("content.pause") : t("content.play")}
        className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg-subtle)]"
      >
        <span aria-hidden="true">🔊</span>
        {title ?? t("content.listenInSomali")}
      </button>

      <audio
        ref={audioRef}
        preload="metadata"
        src={resolvedUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
