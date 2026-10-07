"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export type SomaliLessonAudioProps = {
  audioUrl?: string | null;
  audioPath?: string | null;
  title?: string;
};

function buildCandidateUrls(audioUrl?: string | null, audioPath?: string | null) {
  if (audioUrl) return [audioUrl];
  if (!audioPath) return [];

  const trimmed = audioPath.trim();
  if (!trimmed) return [];

  const candidates = new Set<string>();
  const absolute = /^https?:\/\//i.test(trimmed);
  const isRootRelative = trimmed.startsWith("/");

  if (absolute || isRootRelative) {
    candidates.add(trimmed);
    return Array.from(candidates);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    const base = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/lesson-audio`;
    const normalized = trimmed.replace(/^\/+/, "");
    candidates.add(`${base}/${normalized}`);

    const fileName = normalized.split("/").pop();
    if (fileName && fileName !== normalized) {
      candidates.add(`${base}/${fileName}`);
    }
  }

  const fallbackStatic = `/${trimmed.replace(/^\/+/, "")}`;
  candidates.add(fallbackStatic);

  return Array.from(candidates);
}

export default function SomaliLessonAudio({ audioUrl, audioPath, title }: SomaliLessonAudioProps) {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const candidates = useMemo(() => buildCandidateUrls(audioUrl, audioPath), [audioUrl, audioPath]);

  useEffect(() => {
    if (!audioRef.current || !candidates.length) return;
    audioRef.current.src = candidates[currentIndex];
    audioRef.current.load();
  }, [candidates, currentIndex]);

  if (!candidates.length) {
    return null;
  }

  const togglePlayback = async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      try {
        audioRef.current.src = candidates[currentIndex];
        audioRef.current.load();
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        if (currentIndex < candidates.length - 1) {
          setCurrentIndex((value) => value + 1);
          return;
        }
        setIsPlaying(false);
      }
      return;
    }

    audioRef.current.pause();
    setIsPlaying(false);
  };

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
        src={candidates[currentIndex]}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          if (currentIndex < candidates.length - 1) {
            setCurrentIndex((value) => value + 1);
            return;
          }
          setIsPlaying(false);
        }}
      />
    </div>
  );
}
