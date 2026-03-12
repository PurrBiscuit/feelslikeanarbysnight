"use client";

import { useRef, useCallback, useState, useEffect } from "react";
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
  const [isShaking, setIsShaking] = useState(false);
  const { src, width, height } = sizeMap[size];

  useEffect(() => {
    if (!playAudio) return;
    const audio = new Audio("/were-the-devils.mp3");
    audio.preload = "auto";
    audio.addEventListener("ended", () => setIsShaking(false));
    audioRef.current = audio;
  }, [playAudio]);

  const handleClick = useCallback(() => {
    if (!playAudio || !audioRef.current) return;

    audioRef.current.currentTime = 0;
    setIsShaking(true);
    audioRef.current.play().catch(() => {
      setIsShaking(false);
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
        disabled={isShaking}
        className={cn(
          "transition-transform duration-200 focus:outline-none",
          isShaking
            ? "scale-110 cursor-default"
            : "cursor-pointer hover:scale-[0.98]",
          size === "lg" && !isShaking && "animate-puddy-glow",
          className
        )}
        style={isShaking ? { animation: "agitated-shake 0.15s ease-in-out infinite, puddy-glow-intense 1s ease-in-out infinite" } : undefined}
        aria-label="Play audio clip: We're the Devils"
      >
        {imageContent}
      </button>
    );
  }

  return <div className={className}>{imageContent}</div>;
}
