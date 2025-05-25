"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Participant {
  id: string;
  name: string;
  stream?: MediaStream;
  audioEnabled: boolean;
  videoEnabled: boolean;
  isHost?: boolean;
  isScreenSharing?: boolean;
}

interface ScreenShareLayoutProps {
  participants: Participant[];
  localParticipantId: string;
  screenSharingParticipantId: string | null;
  userVideoRefs: React.MutableRefObject<{
    [key: string]: HTMLVideoElement | null;
  }>;
  localVideoRef: React.RefObject<HTMLVideoElement>;
}

export function ScreenShareLayout({
  participants,
  localParticipantId,
  screenSharingParticipantId,
  userVideoRefs,
  localVideoRef,
}: ScreenShareLayoutProps) {
  const [expandedView, setExpandedView] = useState(false);
  const [visibleParticipants, setVisibleParticipants] = useState<Participant[]>(
    [],
  );
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [lastTap, setLastTap] = useState(0);

  // Find the screen sharing participant
  const screenSharingParticipant = participants.find(
    (p) => p.id === screenSharingParticipantId,
  );

  // Find the host participant
  const hostParticipant = participants.find((p) => p.isHost);

  // Sort participants: host first, then screen sharer (if not the host), then others by join time
  useEffect(() => {
    let sorted = [...participants];

    // Move host to the beginning if they exist and aren't sharing the screen
    if (hostParticipant && hostParticipant.id !== screenSharingParticipantId) {
      sorted = [
        hostParticipant,
        ...sorted.filter((p) => p.id !== hostParticipant.id),
      ];
    }

    // If in expanded view, limit to 3 participants (or all if showAllParticipants is true)
    if (expandedView && !showAllParticipants) {
      // Always include the screen sharing participant
      const screenSharer = sorted.find(
        (p) => p.id === screenSharingParticipantId,
      );

      // Filter out the screen sharer from the list
      const othersWithoutScreenSharer = sorted.filter(
        (p) => p.id !== screenSharingParticipantId,
      );

      // Take the first 2 participants (or fewer if there aren't enough)
      const visibleOthers = othersWithoutScreenSharer.slice(0, 2);

      // Combine the screen sharer with the visible others
      setVisibleParticipants(
        screenSharer ? [screenSharer, ...visibleOthers] : visibleOthers,
      );
    } else {
      setVisibleParticipants(sorted);
    }
  }, [
    participants,
    expandedView,
    showAllParticipants,
    screenSharingParticipantId,
    hostParticipant,
  ]);

  // Handle double tap/click to toggle expanded view
  const handleTapOrClick = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // ms

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      setExpandedView(!expandedView);
      setShowAllParticipants(false); // Reset to showing limited participants
      e.preventDefault();
    }

    setLastTap(now);
  };

  // Handle touch start for double tap detection
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setStartX(e.touches[0].clientX);
      setStartY(e.touches[0].clientY);
    }
  };

  // Handle touch end for double tap detection
  const handleTouchEnd = (e: React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // ms

    // Check if it's a tap (not a swipe)
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = Math.abs(endX - startX);
    const deltaY = Math.abs(endY - startY);

    if (deltaX < 10 && deltaY < 10) {
      // It's a tap, not a swipe
      if (now - lastTap < DOUBLE_TAP_DELAY) {
        // Double tap detected
        setExpandedView(!expandedView);
        setShowAllParticipants(false); // Reset to showing limited participants
        e.preventDefault();
      }
      setLastTap(now);
    }
  };

  // Toggle showing all participants
  const toggleShowAllParticipants = () => {
    setShowAllParticipants(!showAllParticipants);
  };

  // If no one is sharing screen, return null
  if (!screenSharingParticipant) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full relative transition-all duration-300",
        expandedView ? "screen-share-expanded" : "screen-share-normal",
      )}
      onClick={handleTapOrClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main content area - screen share */}
      <div
        className={cn(
          "relative transition-all duration-300",
          expandedView ? "w-full md:w-3/4 h-full float-left" : "w-full h-full",
        )}
      >
        {/* Screen sharing video */}
        <div className="w-full h-full bg-black relative">
          <video
            ref={
              screenSharingParticipant.id === localParticipantId
                ? localVideoRef
                : (el) => {
                    if (el)
                      userVideoRefs.current[screenSharingParticipant.id] = el;
                  }
            }
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />

          {/* Screen sharing info overlay */}
          <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-sm">
            {screenSharingParticipant.name} is sharing their screen
          </div>

          {/* Double-tap hint */}
          <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
            Double-tap to {expandedView ? "minimize" : "expand"}
          </div>
        </div>
      </div>

      {/* Participant videos sidebar - only visible in expanded view */}
      {expandedView && (
        <div className="w-full md:w-1/4 h-full float-right overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="p-2 bg-gray-800 text-white text-sm flex justify-between items-center">
              <span>Participants ({participants.length})</span>
              {participants.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleShowAllParticipants();
                  }}
                  className="h-7 text-xs"
                >
                  {showAllParticipants ? "Show Less" : "Show All"}
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-auto">
              {visibleParticipants
                .filter((p) => p.id !== screenSharingParticipantId) // Don't show screen sharer in the sidebar
                .map((participant) => (
                  <div
                    key={participant.id}
                    className="relative aspect-video w-full border-b border-gray-700"
                  >
                    {/* Participant video */}
                    {participant.videoEnabled ? (
                      <video
                        ref={
                          participant.id === localParticipantId
                            ? localVideoRef
                            : (el) => {
                                if (el)
                                  userVideoRefs.current[participant.id] = el;
                              }
                        }
                        autoPlay
                        playsInline
                        muted={participant.id === localParticipantId}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.name}`}
                          />
                          <AvatarFallback>
                            {participant.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}

                    {/* Participant info overlay */}
                    <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center">
                      <div className="bg-black/60 text-white px-1 py-0.5 rounded-md text-xs flex items-center gap-1">
                        {participant.name}
                        {participant.id === localParticipantId && " (You)"}
                        {participant.isHost && (
                          <span
                            className="text-yellow-400 ml-1"
                            title="Meeting Host"
                          >
                            👑
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

              {/* Show indicator for more participants if needed */}
              {!showAllParticipants && participants.length > 3 && (
                <div
                  className="w-full py-2 bg-gray-700 text-white text-center text-sm cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleShowAllParticipants();
                  }}
                >
                  <Users size={16} className="inline mr-1" />
                  {participants.length - 3} more participants
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
