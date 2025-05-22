"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface LocalVideoProps {
  stream: MediaStream | null;
  videoEnabled: boolean;
  userName: string;
  className?: string;
}

export function LocalVideo({
  stream,
  videoEnabled,
  userName,
  className,
}: LocalVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoAttached, setVideoAttached] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Function to attach stream to video element
  const attachStream = () => {
    if (!stream || !videoRef.current) return false;

    try {
      // Check if stream has video tracks
      if (stream.getVideoTracks().length === 0) {
        console.warn("Stream has no video tracks");
        return false;
      }

      // Check if video tracks are enabled
      const videoTrack = stream.getVideoTracks()[0];
      if (!videoTrack.enabled) {
        console.warn("Video track is disabled");
      }

      // Attach stream to video element
      videoRef.current.srcObject = stream;
      setVideoAttached(true);

      return true;
    } catch (err) {
      console.error("Error attaching stream:", err);
      setVideoError(`Error attaching stream: ${err}`);
      return false;
    }
  };

  // Try to play the video
  const playVideo = async () => {
    if (!videoRef.current || !videoAttached) return;

    try {
      await videoRef.current.play();
      setIsVideoPlaying(true);
      setVideoError(null);
    } catch (err) {
      console.error("Error playing video:", err);
      setIsVideoPlaying(false);
      setVideoError(`Error playing video: ${err}`);
    }
  };

  // Attach stream when it changes
  useEffect(() => {
    console.log("Stream changed, attaching to video element");
    const success = attachStream();
    if (success) {
      playVideo();
    }
  }, [stream]);

  // Try to play video when visibility changes
  useEffect(() => {
    if (videoEnabled && videoAttached) {
      playVideo();
    }
  }, [videoEnabled, videoAttached]);

  // Handle video element events
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleCanPlay = () => {
      console.log("Video can play");
      playVideo();
    };

    const handlePlaying = () => {
      console.log("Video is playing");
      setIsVideoPlaying(true);
    };

    const handleError = (e: Event) => {
      console.error("Video error:", e);
      setVideoError(`Video error: ${e.type}`);
    };

    // Add event listeners
    videoElement.addEventListener("canplay", handleCanPlay);
    videoElement.addEventListener("playing", handlePlaying);
    videoElement.addEventListener("error", handleError);

    // Clean up
    return () => {
      videoElement.removeEventListener("canplay", handleCanPlay);
      videoElement.removeEventListener("playing", handlePlaying);
      videoElement.removeEventListener("error", handleError);
    };
  }, []);

  // Manual play button handler
  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsVideoPlaying(true))
        .catch((err) => console.error("Manual play failed:", err));
    }
  };

  return (
    <div className={cn("relative w-full h-full bg-gray-900", className)}>
      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={cn(
          "w-full h-full object-cover",
          (!videoEnabled || !isVideoPlaying) && "hidden",
        )}
      />

      {/* Avatar fallback when video is off */}
      {(!videoEnabled || !isVideoPlaying) && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
          <Avatar className="w-24 h-24 mb-2">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
            />
            <AvatarFallback>
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {videoEnabled && !isVideoPlaying && (
            <div className="text-center">
              <p className="text-white mb-2">Camera not displaying</p>
              <button
                onClick={handleManualPlay}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
              >
                Start Video
              </button>
            </div>
          )}
        </div>
      )}

      {/* Debug info */}
      {videoError && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500/80 text-white text-xs p-1 text-center">
          {videoError}
        </div>
      )}

      {/* Status indicator */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
        <div className="bg-black/60 text-white px-2 py-1 rounded-md text-sm">
          {userName} (You)
        </div>
        {isVideoPlaying && videoEnabled && (
          <div className="bg-green-500/60 text-white px-2 py-1 rounded-md text-xs">
            Live
          </div>
        )}
      </div>
    </div>
  );
}
