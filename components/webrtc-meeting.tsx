"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Import Simple Peer for WebRTC
import type Peer from "simple-peer";

type Participant = {
  id: string;
  stream?: MediaStream;
  peer?: Peer.Instance;
  name: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
};

export default function WebRTCMeeting() {
  // Local state
  const [roomId, setRoomId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [inRoom, setInRoom] = useState<boolean>(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const peersRef = useRef<{ [key: string]: Peer.Instance }>({});

  // Browser support check
  const [browserSupport, setBrowserSupport] = useState({
    webRTC: typeof RTCPeerConnection !== "undefined",
    getUserMedia:
      "mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices,
    getDisplayMedia:
      "mediaDevices" in navigator &&
      "getDisplayMedia" in navigator.mediaDevices,
  });

  // Initialize local media stream
  const initializeLocalStream = async () => {
    try {
      setError(null);

      if (!browserSupport.getUserMedia) {
        throw new Error("Your browser doesn't support camera access");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (err) {
      console.error("Error accessing media devices:", err);

      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError(
          "Camera/microphone access was denied. Please check your browser permissions and try again.",
        );
      } else if (err instanceof DOMException && err.name === "NotFoundError") {
        setError(
          "No camera or microphone found. Please connect a device and try again.",
        );
      } else {
        setError(
          `Failed to access camera: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }

      return null;
    }
  };

  // Start screen sharing
  const startScreenShare = async () => {
    try {
      if (!browserSupport.getDisplayMedia) {
        throw new Error("Your browser doesn't support screen sharing");
      }

      // @ts-ignore - TypeScript doesn't recognize getDisplayMedia on mediaDevices
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          // cursor: "always",
        },
        audio: false,
      });

      setScreenStream(displayStream);
      setIsScreenSharing(true);

      // Replace video track in all peer connections
      if (localStream) {
        const videoTrack = displayStream.getVideoTracks()[0];

        Object.values(peersRef.current).forEach((peer) => {
          const sender = (peer as any)._senders.find(
            (s: any) => s.track.kind === "video",
          );

          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        // Replace local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = displayStream;
        }
      }

      // Add event listener for when the user stops sharing via the browser UI
      displayStream.getVideoTracks()[0].addEventListener("ended", () => {
        stopScreenShare();
      });
    } catch (err) {
      console.error("Error sharing screen:", err);

      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError("Screen sharing was denied. You can try again when ready.");
      } else {
        setError(
          `Failed to share screen: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }
    }
  };

  // Stop screen sharing
  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => {
        track.stop();
      });

      // Replace screen track with video track in all peer connections
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];

        Object.values(peersRef.current).forEach((peer) => {
          const sender = (peer as any)._senders.find(
            (s: any) => s.track.kind === "video",
          );

          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        // Replace local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
      }

      setScreenStream(null);
      setIsScreenSharing(false);
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  // Join a room
  const joinRoom = async () => {
    if (!roomId || !userName) {
      setError("Room ID and your name are required");
      return;
    }

    setIsConnecting(true);

    try {
      const stream = await initializeLocalStream();

      if (!stream) {
        setIsConnecting(false);
        return;
      }

      // Create a WebSocket connection to our signaling server
      // In a real app, replace with your actual signaling server URL
      const wsUrl = `wss://your-signaling-server.com/room/${roomId}`;

      // For demo purposes, we'll simulate the connection
      console.log(`Connecting to room: ${roomId} as ${userName}`);

      // Add yourself to participants
      setParticipants([
        {
          id: "local",
          stream,
          name: userName,
          audioEnabled,
          videoEnabled,
        },
      ]);

      // Simulate adding other participants (in a real app, these would come from the signaling server)
      setTimeout(() => {
        setParticipants((prev) => [
          ...prev,
          {
            id: "simulated-1",
            name: "Jane Doe",
            audioEnabled: true,
            videoEnabled: true,
          },
          {
            id: "simulated-2",
            name: "John Smith",
            audioEnabled: true,
            videoEnabled: false,
          },
        ]);

        setInRoom(true);
        setIsConnecting(false);
      }, 1500);

      // In a real implementation, you would:
      // 1. Connect to a signaling server via WebSocket
      // 2. Send your user info to the server
      // 3. Receive existing participants from the server
      // 4. Create peer connections to each participant
      // 5. Handle new participants joining
    } catch (err) {
      console.error("Error joining room:", err);
      setError(
        `Failed to join room: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      setIsConnecting(false);
    }
  };

  // Leave the room
  const leaveRoom = () => {
    // Close all peer connections
    Object.values(peersRef.current).forEach((peer) => {
      peer.destroy();
    });

    // Close WebSocket connection
    if (socketRef.current) {
      socketRef.current.close();
    }

    // Stop all tracks in the local stream
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    // Stop screen sharing if active
    if (screenStream) {
      screenStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    // Reset state
    setLocalStream(null);
    setScreenStream(null);
    setIsScreenSharing(false);
    setParticipants([]);
    setInRoom(false);
    peersRef.current = {};
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      if (screenStream) {
        screenStream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      // Close all peer connections
      Object.values(peersRef.current).forEach((peer) => {
        peer.destroy();
      });

      // Close WebSocket connection
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // Room join form
  if (!inRoom) {
    return (
      <div className="flex flex-col items-center max-w-full mx-auto p-4 bg-white dark:bg-muted rounded-lg shadow-md">
        <div className="flex items-center justify-between w-full mb-4">
          <h2 className="text-2xl font-bold">Join Meeting</h2>
          {/* <ThemeToggle /> */}
        </div>

        {!browserSupport.webRTC && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Your browser doesn't support WebRTC. Please try a modern browser
              like Chrome, Firefox, or Edge.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="w-full space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-id">Room ID</Label>
            <Input
              id="room-id"
              placeholder="Enter room ID or create new"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={isConnecting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-name">Your Name</Label>
            <Input
              id="user-name"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={isConnecting}
            />
          </div>

          <Button
            onClick={joinRoom}
            className="w-full"
            disabled={
              !roomId || !userName || isConnecting || !browserSupport.webRTC
            }
          >
            {isConnecting ? "Connecting..." : "Join Meeting"}
          </Button>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            By joining, you agree to allow access to your camera and microphone.
          </p>
        </div>
      </div>
    );
  }

  // Meeting room UI
  return (
    <div className="flex flex-col w-full mx-auto p-4 bg-white dark:bg-muted rounded-lg shadow-md">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Meeting: {roomId}</h2>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users size={14} />
            {participants.length} Participants
          </Badge>
        </div>
        {/* <ThemeToggle /> */}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Video grid */}
      <div
        className={cn(
          "grid gap-4 mb-4",
          participants.length <= 1
            ? "grid-cols-1"
            : participants.length <= 4
              ? "grid-cols-2"
              : "grid-cols-3",
        )}
      >
        {participants.map((participant) => (
          <Card key={participant.id} className="overflow-hidden">
            <div className="relative aspect-video bg-gray-900 dark:bg-gray-950">
              {participant.id === "local" ? (
                // Local video
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={cn(
                    "w-full h-full object-cover",
                    !videoEnabled && "hidden",
                  )}
                />
              ) : // Remote video (in a real app, you would have refs for each remote video)
              participant.videoEnabled ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 dark:bg-gray-900">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.name}`}
                    />
                    <AvatarFallback>
                      {participant.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 dark:bg-gray-900">
                  <div className="text-gray-400 text-center">
                    <VideoOff size={48} className="mx-auto mb-2" />
                    <p>Video is turned off</p>
                  </div>
                </div>
              )}

              {/* Participant info overlay */}
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                <div className="bg-black/60 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  {participant.name}
                  {participant.id === "local" && " (You)"}
                  {!participant.audioEnabled && (
                    <MicOff size={14} className="text-red-500" />
                  )}
                </div>

                {participant.id === "local" && isScreenSharing && (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <Monitor size={14} />
                    Sharing
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
        <Button
          onClick={toggleAudio}
          variant={audioEnabled ? "default" : "destructive"}
          className="flex items-center gap-2"
          title={audioEnabled ? "Mute microphone" : "Unmute microphone"}
        >
          {audioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
          {audioEnabled ? "Mute" : "Unmute"}
        </Button>

        <Button
          onClick={toggleVideo}
          variant={videoEnabled ? "default" : "destructive"}
          className="flex items-center gap-2"
          title={videoEnabled ? "Turn off camera" : "Turn on camera"}
          disabled={isScreenSharing}
        >
          {videoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
          {videoEnabled ? "Stop Video" : "Start Video"}
        </Button>

        <Button
          onClick={isScreenSharing ? stopScreenShare : startScreenShare}
          variant={isScreenSharing ? "destructive" : "default"}
          className="flex items-center gap-2"
          title={isScreenSharing ? "Stop sharing screen" : "Share screen"}
          disabled={!browserSupport.getDisplayMedia}
        >
          <Monitor size={18} />
          {isScreenSharing ? "Stop Sharing" : "Share Screen"}
        </Button>

        <Separator orientation="vertical" className="h-8" />

        <Button
          onClick={leaveRoom}
          variant="destructive"
          className="flex items-center gap-2"
          title="Leave meeting"
        >
          <PhoneOff size={18} />
          Leave Meeting
        </Button>
      </div>
    </div>
  );
}
