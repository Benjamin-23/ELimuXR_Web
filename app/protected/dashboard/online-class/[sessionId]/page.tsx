"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Users,
  Share2,
  ScreenShare,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VideoMeeting() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participantCount] = useState(24); // Would be dynamic in real app

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = isCameraOff;
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);

  useEffect(() => {
    const startStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    startStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-[80vh] w-full px-4 py-2 bg-gray-900 text-white">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 relative bg-black">
          {/* Video Feed */}
          <div className="absolute inset-0 flex items-center justify-center">
            {!isCameraOff ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isMuted}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="bg-gray-800 rounded-full h-32 w-32 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm mb-1">Camera Off</div>
                  <VideoOff className="h-8 w-8 mx-auto" />
                </div>
              </div>
            )}
          </div>

          {/* Participant Count */}
          <div className="absolute top-4 left-4 bg-gray-800/80 px-3 py-1 rounded-full flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{participantCount} participants</span>
          </div>

          {/* Session Info */}
          <div className="absolute top-4 right-4 bg-gray-800/80 px-3 py-1 rounded-md">
            Grade 7 Mathematics: Algebra Fundamentals
          </div>

          {/* User Info */}
          <div className="absolute bottom-20 left-4 bg-gray-800/80 px-3 py-2 rounded-md max-w-xs">
            <div className="font-medium">You</div>
            <div className="text-sm text-gray-300">
              {isMuted ? "Mic off" : "Mic on"} •{" "}
              {isCameraOff ? "Camera off" : "Camera on"}
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {isChatOpen && (
          <div className="w-full md:w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-medium">Class Chat</h3>
              <button
                onClick={toggleChat}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="text-center text-sm text-gray-500 py-4">
                Chat messages will appear here
              </div>
            </div>
            <div className="p-4 border-t border-gray-700">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-700 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button className="bg-primary text-primary-foreground px-3 py-2 rounded-r-md text-sm">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex space-x-2">
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="lg"
            onClick={toggleMute}
            className="rounded-full"
          >
            {isMuted ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
            <span className="ml-2 hidden md:inline">
              {isMuted ? "Unmute" : "Mute"}
            </span>
          </Button>

          <Button
            variant={isCameraOff ? "destructive" : "secondary"}
            size="lg"
            onClick={toggleCamera}
            className="rounded-full"
          >
            {isCameraOff ? (
              <VideoOff className="h-5 w-5" />
            ) : (
              <Video className="h-5 w-5" />
            )}
            <span className="ml-2 hidden md:inline">
              {isCameraOff ? "Turn On" : "Turn Off"}
            </span>
          </Button>

          <Button
            variant={isScreenSharing ? "default" : "secondary"}
            size="lg"
            onClick={toggleScreenShare}
            className="rounded-full"
          >
            <ScreenShare className="h-5 w-5" />
            <span className="ml-2 hidden md:inline">
              {isScreenSharing ? "Stop Sharing" : "Share Screen"}
            </span>
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={isChatOpen ? "default" : "secondary"}
            size="lg"
            onClick={toggleChat}
            className="rounded-full"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="ml-2 hidden md:inline">Chat</span>
          </Button>

          <Button variant="secondary" size="lg" className="rounded-full">
            <Share2 className="h-5 w-5" />
            <span className="ml-2 hidden md:inline">Invite</span>
          </Button>

          <Button variant="destructive" size="lg" className="rounded-full">
            Leave
          </Button>
        </div>
      </div>

      {/* Mobile Chat Toggle */}
      {!isChatOpen && (
        <div className="md:hidden fixed bottom-20 right-4">
          <Button
            onClick={toggleChat}
            size="icon"
            className="rounded-full h-12 w-12 shadow-lg"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
