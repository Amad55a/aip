"use client";

import { useId, useMemo, useRef, useState } from "react";
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

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function SomaliLessonAudio({ audioUrl, audioPath, title }: SomaliLessonAudioProps) {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const labelId = useId();

  const resolvedUrl = useMemo(() => resolveAudioUrl(audioUrl, audioPath), [audioUrl, audioPath]);

  if (!resolvedUrl) {
    return null;
  }

  const canSeek = Number.isFinite(duration) && duration > 0;

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

  const handleSeek = (value: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <section
      aria-labelledby={labelId}
      className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-muted)]">Audio</p>
          <h3 id={labelId} className="mt-1 text-base font-bold text-[var(--fg)]">
            {title ?? t("content.listenInSomali")}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setIsMuted((value) => !value)}
          aria-label={isMuted ? t("content.unmute") : t("content.mute")}
          className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs font-semibold text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)]"
        >
          {isMuted ? t("content.unmute") : t("content.mute")}
        </button>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? t("content.pause") : t("content.play")}
            className="rounded-md bg-[#7D288F] px-3.5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#68217b]"
          >
            {isPlaying ? t("content.pause") : t("content.play")}
          </button>
          <span className="text-sm text-[var(--fg-muted)]">{t("content.listenInSomali")}</span>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={canSeek ? duration : 0}
            step={0.1}
            value={Math.min(currentTime, canSeek ? duration : 0)}
            onChange={(event) => handleSeek(Number(event.target.value))}
            aria-label={t("content.seek")}
            className="h-2 w-full accent-[#7D288F]"
          />
          <div className="flex items-center justify-between text-xs text-[var(--fg-muted)]">
            <span>{formatTime(currentTime)}</span>
            <span>{canSeek ? formatTime(duration) : t("content.loading")}</span>
          </div>
        </div>

        {hasError ? (
          <p className="text-sm text-red-500">{t("content.audioUnavailable")}</p>
        ) : null}
      </div>

      <audio
        ref={audioRef}
        preload="metadata"
        src={resolvedUrl}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
        muted={isMuted}
      />
    </section>
  );
}
