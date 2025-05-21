"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  Users,
  LinkIcon,
  Copy,
  Check,
  SmilePlus,
  MessageSquare,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { io, type Socket } from "socket.io-client";
import Peer from "simple-peer";

type Participant = {
  id: string;
  stream?: MediaStream;
  peer?: Peer.Instance;
  name: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
};

type Reaction = {
  id: string;
  emoji: string;
  participantId: string;
  timestamp: number;
};

type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  type: "text" | "system";
};

// Common emoji reactions
const EMOJI_REACTIONS = [
  { emoji: "👍", label: "Thumbs Up" },
  { emoji: "👏", label: "Clap" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "😂", label: "Laugh" },
  { emoji: "😮", label: "Wow" },
  { emoji: "🎉", label: "Celebrate" },
  { emoji: "🙌", label: "Raise Hands" },
  { emoji: "✋", label: "Raise Hand" },
];

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
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [inviteLink, setInviteLink] = useState<string>("");
  const [inviteCopied, setInviteCopied] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<{ [key: string]: Peer.Instance }>({});
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const userVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // Browser support check
  const [browserSupport, setBrowserSupport] = useState({
    webRTC: typeof RTCPeerConnection !== "undefined",
    getUserMedia:
      "mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices,
    getDisplayMedia:
      "mediaDevices" in navigator &&
      "getDisplayMedia" in navigator.mediaDevices,
  });

  // Check if on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

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

      // Add system message to chat
      addSystemMessage(`${userName} started sharing their screen`);

      // Notify other participants about screen sharing
      if (socketRef.current) {
        socketRef.current.emit("screen-share-started", { roomId });
      }
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

      // Add system message to chat
      addSystemMessage(`${userName} stopped sharing their screen`);

      // Notify other participants about screen sharing stopped
      if (socketRef.current) {
        socketRef.current.emit("screen-share-stopped", { roomId });
      }
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

      // Add system message to chat
      addSystemMessage(
        `${userName} ${!audioEnabled ? "unmuted" : "muted"} their microphone`,
      );

      // Notify other participants about audio state change
      if (socketRef.current) {
        socketRef.current.emit("audio-toggle", {
          roomId,
          enabled: !audioEnabled,
        });
      }
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

      // Add system message to chat
      addSystemMessage(
        `${userName} ${!videoEnabled ? "turned on" : "turned off"} their camera`,
      );

      // Notify other participants about video state change
      if (socketRef.current) {
        socketRef.current.emit("video-toggle", {
          roomId,
          enabled: !videoEnabled,
        });
      }
    }
  };

  // Generate a random room ID if not provided
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
  };

  // Create a peer connection
  const createPeer = (
    targetUserId: string,
    stream: MediaStream,
    initiator: boolean,
  ) => {
    const peer = new Peer({
      initiator,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      if (socketRef.current) {
        socketRef.current.emit("signal", {
          userId: targetUserId,
          signal,
        });
      }
    });

    peer.on("stream", (remoteStream) => {
      // Update participant with stream
      setParticipants((prevParticipants) => {
        return prevParticipants.map((p) => {
          if (p.id === targetUserId) {
            return { ...p, stream: remoteStream };
          }
          return p;
        });
      });

      // Set stream to video element
      if (userVideoRefs.current[targetUserId]) {
        userVideoRefs.current[targetUserId]!.srcObject = remoteStream;
      }
    });

    return peer;
  };

  // Add peer to connections
  const addPeer = (
    userId: string,
    name: string,
    stream: MediaStream,
    initiator = false,
  ) => {
    const peer = createPeer(userId, stream, initiator);
    peersRef.current[userId] = peer;

    setParticipants((prevParticipants) => [
      ...prevParticipants,
      {
        id: userId,
        name,
        peer,
        audioEnabled: true,
        videoEnabled: true,
      },
    ]);

    return peer;
  };

  // Join a room
  const joinRoom = async () => {
    const finalRoomId = roomId || generateRoomId();

    if (!finalRoomId || !userName) {
      setError("Your name is required");
      return;
    }

    setRoomId(finalRoomId);
    setIsConnecting(true);

    try {
      const stream = await initializeLocalStream();

      if (!stream) {
        setIsConnecting(false);
        return;
      }

      // Generate invite link
      const baseUrl = window.location.origin;
      const inviteUrl = `${baseUrl}/meeting?room=${finalRoomId}`;
      setInviteLink(inviteUrl);

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

      // Connect to Socket.io server
      const socket = io(
        process.env.NEXT_PUBLIC_SOCKET_SERVER || "http://localhost:3001",
        {
          transports: ["websocket"],
        },
      );

      socketRef.current = socket;

      // Socket event handlers
      socket.on("connect", () => {
        console.log("Connected to Socket.io server");

        // Join the room
        socket.emit("join-room", {
          roomId: finalRoomId,
          userId: socket.id,
          userName,
        });

        // Add welcome message to chat
        setChatMessages([
          {
            id: "welcome",
            senderId: "system",
            senderName: "System",
            text: `Welcome to the meeting, ${userName}!`,
            timestamp: Date.now(),
            type: "system",
          },
        ]);
      });

      socket.on("connect_error", (err: Error) => {
        console.error("Socket connection error:", err);
        setError(`Failed to connect to server: ${err.message}`);
        setIsConnecting(false);
      });

      // Handle room joined event
      socket.on("room-joined", ({ roomData }: { roomData: any }) => {
        console.log("Room joined:", roomData);

        // For each existing user in the room, create a peer connection
        roomData.participants.forEach((participant: any) => {
          if (participant.userId !== socket.id) {
            const peer = addPeer(
              participant.userId,
              participant.userName,
              stream,
              true,
            );
          }
        });

        setInRoom(true);
        setIsConnecting(false);
      });

      // Handle new user joined
      socket.on(
        "user-joined",
        ({ userId, userName }: { userId: string; userName: string }) => {
          console.log("User joined:", userId, userName);

          // Create a peer connection to the new user
          const peer = addPeer(userId, userName, stream);

          // Add system message
          addSystemMessage(`${userName} joined the meeting`);
        },
      );

      // Handle user left
      socket.on("user-left", ({ userId }: { userId: string }) => {
        console.log("User left:", userId);

        // Find the participant
        const participant = participants.find((p) => p.id === userId);

        // Close the peer connection
        if (peersRef.current[userId]) {
          peersRef.current[userId].destroy();
          delete peersRef.current[userId];
        }

        // Remove from participants
        setParticipants((prev) => prev.filter((p) => p.id !== userId));

        // Add system message
        if (participant) {
          addSystemMessage(`${participant.name} left the meeting`);
        }
      });

      // Handle signaling
      socket.on(
        "signal",
        ({ userId, signal }: { userId: string; signal: any }) => {
          console.log("Received signal from:", userId);

          if (peersRef.current[userId]) {
            peersRef.current[userId].signal(signal);
          }
        },
      );

      // Handle chat messages
      socket.on(
        "chat-message",
        ({
          senderId,
          senderName,
          text,
          timestamp,
        }: {
          senderId: string;
          senderName: string;
          text: string;
          timestamp: number;
        }) => {
          receiveMessage(senderId, senderName, text);
        },
      );

      // Handle reactions
      socket.on(
        "reaction",
        ({
          participantId,
          emoji,
        }: {
          participantId: string;
          emoji: string;
        }) => {
          const newReaction: Reaction = {
            id: Math.random().toString(36).substring(2, 9),
            emoji,
            participantId,
            timestamp: Date.now(),
          };

          setReactions((prev) => [...prev, newReaction]);

          // Remove the reaction after 5 seconds
          setTimeout(() => {
            setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
          }, 5000);
        },
      );

      // Handle audio/video state changes
      socket.on(
        "audio-state-changed",
        ({ userId, enabled }: { userId: string; enabled: boolean }) => {
          setParticipants((prev) =>
            prev.map((p) =>
              p.id === userId ? { ...p, audioEnabled: enabled } : p,
            ),
          );
        },
      );

      socket.on(
        "video-state-changed",
        ({ userId, enabled }: { userId: string; enabled: boolean }) => {
          setParticipants((prev) =>
            prev.map((p) =>
              p.id === userId ? { ...p, videoEnabled: enabled } : p,
            ),
          );
        },
      );

      // Handle screen sharing
      socket.on("screen-share-started", ({ userId }: { userId: string }) => {
        const participant = participants.find((p) => p.id === userId);
        if (participant) {
          addSystemMessage(`${participant.name} started sharing their screen`);
        }
      });

      socket.on("screen-share-stopped", ({ userId }: { userId: string }) => {
        const participant = participants.find((p) => p.id === userId);
        if (participant) {
          addSystemMessage(`${participant.name} stopped sharing their screen`);
        }
      });
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
    // Notify server
    if (socketRef.current) {
      socketRef.current.emit("leave-room", { roomId });
      socketRef.current.disconnect();
    }

    // Close all peer connections
    Object.values(peersRef.current).forEach((peer) => {
      peer.destroy();
    });

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
    setReactions([]);
    setChatMessages([]);
    setUnreadMessages(0);
    setIsChatOpen(false);
    peersRef.current = {};
  };

  // Send a reaction
  const sendReaction = (emoji: string) => {
    const newReaction: Reaction = {
      id: Math.random().toString(36).substring(2, 9),
      emoji,
      participantId: "local",
      timestamp: Date.now(),
    };

    setReactions((prev) => [...prev, newReaction]);

    // Send to other participants
    if (socketRef.current) {
      socketRef.current.emit("reaction", {
        roomId,
        emoji,
      });
    }

    // Remove the reaction after 5 seconds
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 5000);
  };

  // Copy invite link to clipboard
  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setInviteCopied(true);

    toast({
      title: "Invite link copied!",
      description: "The meeting link has been copied to your clipboard.",
    });

    setTimeout(() => {
      setInviteCopied(false);
    }, 3000);
  };

  // Toggle chat panel
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setUnreadMessages(0);
      // Focus the input field when opening chat
      setTimeout(() => {
        messageInputRef.current?.focus();
      }, 100);
    }
  };

  // Add a system message to the chat
  const addSystemMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: "system",
      senderName: "System",
      text,
      timestamp: Date.now(),
      type: "system",
    };

    setChatMessages((prev) => [...prev, newMessage]);

    // Increment unread count if chat is closed
    if (!isChatOpen) {
      setUnreadMessages((prev) => prev + 1);
    }
  };

  // Send a chat message
  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: "local",
      senderName: userName,
      text: messageInput.trim(),
      timestamp: Date.now(),
      type: "text",
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setMessageInput("");

    // Send to other participants
    if (socketRef.current) {
      socketRef.current.emit("chat-message", {
        roomId,
        text: newMessage.text,
      });
    }
  };

  // Receive a chat message
  const receiveMessage = (
    senderId: string,
    senderName: string,
    text: string,
  ) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      senderId,
      senderName,
      text,
      timestamp: Date.now(),
      type: "text",
    };

    setChatMessages((prev) => [...prev, newMessage]);

    // Increment unread count if chat is closed
    if (!isChatOpen) {
      setUnreadMessages((prev) => prev + 1);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Check for room ID in URL params when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get("room");
      if (roomParam) {
        setRoomId(roomParam);
      }
    }
  }, []);

  // Handle Enter key in message input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Room join form
  if (!inRoom) {
    return (
      <div className="flex flex-col items-center max-w-md mx-auto p-4 bg-muted rounded-lg shadow-md">
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
              placeholder="Enter room ID or leave empty to create new"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={isConnecting}
            />
            {roomId && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Joining existing room: {roomId}
              </p>
            )}
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
            disabled={!userName || isConnecting || !browserSupport.webRTC}
          >
            {isConnecting
              ? "Connecting..."
              : roomId
                ? "Join Meeting"
                : "Create & Join Meeting"}
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
    <div className="flex flex-col w-full h-[calc(90vh-2rem)]  mx-auto bg-muted dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center justify-between w-full p-4 border-b">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Meeting: {roomId}</h2>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users size={14} />
            {participants.length} Participants
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <LinkIcon size={14} />
                Invite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite to Meeting</DialogTitle>
                <DialogDescription>
                  Share this link with others to invite them to your meeting.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 mt-4">
                <Input value={inviteLink} readOnly className="flex-1" />
                <Button size="sm" onClick={copyInviteLink}>
                  {inviteCopied ? (
                    <Check size={16} className="mr-1" />
                  ) : (
                    <Copy size={16} className="mr-1" />
                  )}
                  {inviteCopied ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Or share via:</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Message
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {/* <ThemeToggle /> */}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Main content area with videos */}
        <div
          className={cn(
            "flex-1 p-4 overflow-auto",
            isChatOpen && !isMobile ? "pr-0" : "",
          )}
        >
          <div
            className={cn(
              "grid gap-4 h-full",
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
                  ) : (
                    // Remote video
                    <video
                      ref={(el) => {
                        userVideoRefs.current[participant.id] = el;
                        // If we already have a stream for this participant, set it
                        if (el && participant.stream) {
                          el.srcObject = participant.stream;
                        }
                      }}
                      autoPlay
                      playsInline
                      className={cn(
                        "w-full h-full object-cover",
                        !participant.videoEnabled && "hidden",
                      )}
                    />
                  )}

                  {/* Show avatar when video is off */}
                  {((participant.id === "local" && !videoEnabled) ||
                    (participant.id !== "local" &&
                      !participant.videoEnabled)) && (
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
                  )}

                  {/* Reactions */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {reactions
                      .filter((r) => r.participantId === participant.id)
                      .map((reaction) => (
                        <div
                          key={reaction.id}
                          className="animate-float text-4xl"
                          style={{
                            position: "absolute",
                            bottom: "40%",
                            opacity: 1,
                          }}
                        >
                          {reaction.emoji}
                        </div>
                      ))}
                  </div>

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
        </div>

        {/* Chat panel - only shown when isChatOpen is true */}
        {(isChatOpen || !isMobile) && (
          <div
            className={cn(
              "border-l flex flex-col bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out",
              isChatOpen ? "w-80" : "w-0 overflow-hidden",
              isMobile && "absolute inset-0 z-10",
            )}
          >
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="font-semibold">Chat</h3>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleChat}
                  className="h-8 w-8"
                >
                  <X size={18} />
                </Button>
              )}
            </div>

            {/* Chat messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex flex-col max-w-[85%] rounded-lg p-3 text-sm",
                      message.type === "system"
                        ? "bg-gray-100 dark:bg-gray-700 mx-auto text-center italic"
                        : message.senderId === "local"
                          ? "bg-blue-100 dark:bg-blue-900 ml-auto"
                          : "bg-gray-100 dark:bg-gray-700 mr-auto",
                    )}
                  >
                    {message.type !== "system" && (
                      <div className="font-semibold text-xs mb-1">
                        {message.senderId === "local"
                          ? "You"
                          : message.senderName}
                      </div>
                    )}
                    <div>{message.text}</div>
                    <div className="text-xs opacity-70 mt-1 self-end">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>

            {/* Message input */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  ref={messageInputRef}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center p-3 bg-gray-100 dark:bg-gray-900 border-t">
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

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <SmilePlus size={18} />
              React
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-2">
            <div className="grid grid-cols-4 gap-2">
              {EMOJI_REACTIONS.map((reaction) => (
                <Button
                  key={reaction.emoji}
                  variant="ghost"
                  className="text-2xl h-10 px-0"
                  onClick={() => {
                    sendReaction(reaction.emoji);
                  }}
                  title={reaction.label}
                >
                  {reaction.emoji}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          onClick={toggleChat}
          variant={isChatOpen ? "default" : "outline"}
          className="flex items-center gap-2 relative"
        >
          <MessageSquare size={18} />
          {isMobile ? (isChatOpen ? "Close Chat" : "Chat") : ""}
          {!isChatOpen && unreadMessages > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5 flex items-center justify-center">
              {unreadMessages}
            </Badge>
          )}
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
