"use client";

import type React from "react";

import { useEffect, useState } from "react";

// Define the animation keyframes
const emojiAnimationKeyframes = `
@keyframes float-emoji {
  0% {
    transform: translate(0, 0) scale(0.5);
    opacity: 0;
  }
  10% {
    transform: translate(0, -20px) scale(1.2);
    opacity: 1;
  }
  20% {
    transform: translate(0, -40px) scale(1);
    opacity: 1;
  }
  80% {
    transform: translate(0, -120px) rotate(10deg);
    opacity: 0.7;
  }
  100% {
    transform: translate(0, -150px) rotate(20deg);
    opacity: 0;
  }
}

@keyframes float-emoji-right {
  0% {
    transform: translate(0, 0) scale(0.5);
    opacity: 0;
  }
  10% {
    transform: translate(20px, -20px) scale(1.2);
    opacity: 1;
  }
  20% {
    transform: translate(40px, -40px) scale(1);
    opacity: 1;
  }
  80% {
    transform: translate(80px, -120px) rotate(10deg);
    opacity: 0.7;
  }
  100% {
    transform: translate(100px, -150px) rotate(20deg);
    opacity: 0;
  }
}

@keyframes float-emoji-left {
  0% {
    transform: translate(0, 0) scale(0.5);
    opacity: 0;
  }
  10% {
    transform: translate(-20px, -20px) scale(1.2);
    opacity: 1;
  }
  20% {
    transform: translate(-40px, -40px) scale(1);
    opacity: 1;
  }
  80% {
    transform: translate(-80px, -120px) rotate(-10deg);
    opacity: 0.7;
  }
  100% {
    transform: translate(-100px, -150px) rotate(-20deg);
    opacity: 0;
  }
}

.emoji-reaction {
  will-change: transform, opacity;
  pointer-events: none;
}
`;

export function EmojiAnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [styleInjected, setStyleInjected] = useState(false);

  useEffect(() => {
    // Only inject the styles once
    if (!styleInjected) {
      const styleElement = document.createElement("style");
      styleElement.innerHTML = emojiAnimationKeyframes;
      document.head.appendChild(styleElement);
      setStyleInjected(true);

      return () => {
        // Clean up on unmount
        document.head.removeChild(styleElement);
      };
    }
  }, [styleInjected]);

  return <>{children}</>;
}

export interface EmojiReactionProps {
  emoji: string;
  position?: {
    x: number;
    y: number;
  };
  scale?: number;
  rotation?: number;
  speed?: number;
  direction?: "center" | "left" | "right";
}

export function EmojiReaction({
  emoji,
  position = { x: 50, y: 50 },
  scale = 1,
  rotation = 0,
  speed = 1,
  direction = "center",
}: EmojiReactionProps) {
  const animationName =
    direction === "left"
      ? "float-emoji-left"
      : direction === "right"
        ? "float-emoji-right"
        : "float-emoji";

  return (
    <div
      className="emoji-reaction absolute"
      style={{
        fontSize: "2.5rem",
        bottom: `${position.y}%`,
        left: `${position.x}%`,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        animation: `${animationName} ${speed * 4}s ease-out forwards`,
        zIndex: 10,
      }}
    >
      {emoji}
    </div>
  );
}
