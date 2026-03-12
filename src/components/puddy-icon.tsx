"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type PuddySize = "xs" | "sm" | "lg";

interface PuddyIconProps {
  size?: PuddySize;
  className?: string;
  playAudio?: boolean;
}

const sizeMap: Record<PuddySize, { src: string; width: number; height: number }> = {
  xs: { src: "/devil-puddy-xs.png", width: 56, height: 32 },
  sm: { src: "/devil-puddy-sm.png", width: 70, height: 40 },
  lg: { src: "/devil-puddy-lg.png", width: 420, height: 240 },
};

export function PuddyIcon({
  size = "lg",
  className,
  playAudio = false,
}: PuddyIconProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { src, width, height } = sizeMap[size];

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

  const imageContent = (
    <Image
      src={src}
      alt="David Puddy with Devils face paint"
      width={width}
      height={height}
      priority={size === "lg"}
    />
  );

  if (playAudio) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "cursor-pointer transition-transform duration-200",
          "hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2 focus:ring-offset-background",
          size === "lg" && "animate-puddy-glow",
          className
        )}
        role="button"
        aria-label="Play audio clip: Feels like an Arby's night"
      >
        {imageContent}
      </button>
    );
  }

  return <div className={className}>{imageContent}</div>;
}
