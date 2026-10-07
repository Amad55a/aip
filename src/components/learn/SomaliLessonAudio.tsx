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

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function SomaliLessonAudio({ audioUrl, audioPath, title }: SomaliLessonAudioProps) {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

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
        setHasError(false);
        setIsPlaying(true);
      } catch {
        if (currentIndex < candidates.length - 1) {
          setCurrentIndex((value) => value + 1);
          return;
        }
        setHasError(true);
        setIsPlaying(false);
      }
      return;
    }

    audioRef.current.pause();
    setIsPlaying(false);
  };

  return (
    <div className="w-full max-w-xl rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-muted)]">Teacher audio</p>
          <p className="truncate text-sm font-semibold text-[var(--fg)]">{title ?? t("content.listenInSomali")}</p>
        </div>
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? t("content.pause") : t("content.play")}
          className="inline-flex items-center gap-2 rounded-md bg-[#7D288F] px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-[#68217b]"
        >
          <span aria-hidden="true">{isPlaying ? "⏸" : "▶"}</span>
          {isPlaying ? t("content.pause") : t("content.play")}
        </button>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => {
            const nextTime = Number(event.target.value);
            if (audioRef.current) {
              audioRef.current.currentTime = nextTime;
            }
            setCurrentTime(nextTime);
          }}
          aria-label="Audio progress"
          className="h-2 w-full accent-[#7D288F]"
        />
        <div className="flex items-center justify-between text-[11px] text-[var(--fg-muted)]">
          <span>{formatTime(currentTime)}</span>
          <span>{duration ? formatTime(duration) : "0:00"}</span>
        </div>
      </div>

      {hasError && (
        <p className="mt-2 text-xs text-red-500">Unable to load the Somali recording.</p>
      )}

      <audio
        ref={audioRef}
        preload="metadata"
        src={candidates[currentIndex]}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          if (currentIndex < candidates.length - 1) {
            setCurrentIndex((value) => value + 1);
            return;
          }
          setHasError(true);
          setIsPlaying(false);
        }}
      />
    </div>
  );
}
