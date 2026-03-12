"use client";

import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

type PuddySize = "xs" | "sm" | "lg";

interface PuddyIconProps {
  size?: PuddySize;
  className?: string;
  playAudio?: boolean;
}

const sizeMap: Record<PuddySize, { width: number; height: number }> = {
  xs: { width: 32, height: 32 },
  sm: { width: 40, height: 40 },
  lg: { width: 120, height: 120 },
};

export function PuddyIcon({
  size = "lg",
  className,
  playAudio = false,
}: PuddyIconProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { width, height } = sizeMap[size];

  const handleClick = useCallback(() => {
    if (!playAudio) return;

    if (!audioRef.current) {
      audioRef.current = new Audio("/puddy-audio.mp3");
    }

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // Autoplay blocked or audio failed — silently ignore
    });
  }, [playAudio]);

  const svgContent = (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="David Puddy with Devils face paint"
    >
      {/* Face base */}
      <circle cx="60" cy="60" r="52" fill="#e8c39e" />

      {/* Devils face paint - red base */}
      <path
        d="M60 8 C60 8, 20 30, 20 60 C20 75, 30 90, 40 95 L60 70 L80 95 C90 90, 100 75, 100 60 C100 30, 60 8, 60 8Z"
        fill="#c41e3a"
        opacity="0.9"
      />

      {/* Devils face paint - black accents */}
      <path
        d="M60 15 C60 15, 35 35, 35 55 L60 45 L85 55 C85 35, 60 15, 60 15Z"
        fill="#1a1a1a"
      />

      {/* Eyes - white sclera */}
      <ellipse cx="42" cy="55" rx="10" ry="8" fill="white" />
      <ellipse cx="78" cy="55" rx="10" ry="8" fill="white" />

      {/* Eyes - dark irises (Puddy's intense stare) */}
      <circle cx="42" cy="55" r="5" fill="#2c1810" />
      <circle cx="78" cy="55" r="5" fill="#2c1810" />

      {/* Eye highlights */}
      <circle cx="44" cy="53" r="2" fill="white" opacity="0.8" />
      <circle cx="80" cy="53" r="2" fill="white" opacity="0.8" />

      {/* Thick eyebrows */}
      <path
        d="M28 45 Q35 38, 52 43"
        stroke="#1a1a1a"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M92 45 Q85 38, 68 43"
        stroke="#1a1a1a"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Nose */}
      <path
        d="M55 58 Q60 72, 65 58"
        stroke="#c4956e"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Mouth - deadpan expression */}
      <path
        d="M42 80 Q60 84, 78 80"
        stroke="#8b4513"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Chin dimple */}
      <path
        d="M57 92 Q60 95, 63 92"
        stroke="#c4956e"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Hair - slicked back dark hair */}
      <path
        d="M15 45 Q10 25, 30 12 Q45 4, 60 6 Q75 4, 90 12 Q110 25, 105 45"
        fill="#1a1a1a"
      />
      <path
        d="M15 45 Q12 35, 22 20 Q35 8, 60 8 Q85 8, 98 20 Q108 35, 105 45"
        fill="#2c2c2c"
      />
    </svg>
  );

  if (playAudio) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "rounded-full cursor-pointer transition-transform duration-200",
          "hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2 focus:ring-offset-background",
          size === "lg" && "animate-puddy-glow",
          className
        )}
        role="button"
        aria-label="Play audio clip: Feels like an Arby's night"
      >
        {svgContent}
      </button>
    );
  }

  return <div className={className}>{svgContent}</div>;
}
