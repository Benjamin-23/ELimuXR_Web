"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Camera,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VideoMeeting() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [activeStream, setActiveStream] = useState<"camera" | "screen" | null>(
    null,
  );
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check for browser support
  const [browserSupport, setBrowserSupport] = useState({
    getUserMedia:
      "mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices,
    getDisplayMedia:
      "mediaDevices" in navigator &&
      "getDisplayMedia" in navigator.mediaDevices,
  });

  const startCameraStream = async () => {
    try {
      setError(null);

      if (!browserSupport.getUserMedia) {
        throw new Error("Your browser doesn't support camera access");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: audioEnabled,
      });

      setCameraStream(mediaStream);
      setActiveStream("camera");
      setIsInitialized(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
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
    }
  };

  const startScreenShare = async () => {
    try {
      setError(null);

      if (!browserSupport.getDisplayMedia) {
        throw new Error("Your browser doesn't support screen sharing");
      }

      // @ts-ignore - TypeScript doesn't recognize getDisplayMedia on mediaDevices
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          // Remove cursor constraint as it's not a standard property
          // in MediaTrackConstraints for getDisplayMedia
        },
        audio: false,
      });

      setScreenStream(displayStream);
      setIsScreenSharing(true);
      setActiveStream("screen");

      if (videoRef.current) {
        videoRef.current.srcObject = displayStream;
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

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => {
        track.stop();
      });
      setScreenStream(null);
      setIsScreenSharing(false);

      // Switch back to camera view if it's available
      if (cameraStream) {
        setActiveStream("camera");
        if (videoRef.current) {
          videoRef.current.srcObject = cameraStream;
        }
      } else {
        setActiveStream(null);
      }
    }
  };

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => {
        track.stop();
      });
      setCameraStream(null);

      if (activeStream === "camera" && videoRef.current) {
        videoRef.current.srcObject = null;
      }

      if (!isScreenSharing) {
        setActiveStream(null);
        setIsInitialized(false);
      }
    }
  };

  const toggleAudio = () => {
    if (cameraStream) {
      const audioTracks = cameraStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (cameraStream) {
      const videoTracks = cameraStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleScreenShare = () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  const switchToCamera = () => {
    if (cameraStream) {
      setActiveStream("camera");
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
      }
    } else {
      // If camera was stopped, restart it
      startCameraStream();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Video Meeting</h2>

      {!browserSupport.getUserMedia && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            Your browser doesn't support camera access. Please try a modern
            browser like Chrome, Firefox, or Edge.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
        {!isInitialized ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-gray-400 text-center">
              <Play size={48} className="mx-auto mb-2" />
              <p>Click "Start Camera" to begin</p>
            </div>
          </div>
        ) : activeStream === "camera" && !videoEnabled ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-gray-400 text-center">
              <VideoOff size={48} className="mx-auto mb-2" />
              <p>Video is turned off</p>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain"
          />
        )}

        <div className="absolute top-3 right-3 flex gap-2">
          {isScreenSharing && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Monitor size={14} />
              Screen Sharing
            </Badge>
          )}
          {isInitialized && !audioEnabled && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MicOff size={14} />
              Muted
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 w-full justify-center">
        {!isInitialized ? (
          <Button
            onClick={startCameraStream}
            className="flex items-center gap-2"
            disabled={!browserSupport.getUserMedia}
          >
            <Camera size={18} />
            Start Camera
          </Button>
        ) : (
          <>
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
              disabled={activeStream === "screen"}
            >
              {videoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
              {videoEnabled ? "Stop Video" : "Start Video"}
            </Button>

            <Button
              onClick={toggleScreenShare}
              variant={isScreenSharing ? "destructive" : "default"}
              className="flex items-center gap-2"
              title={isScreenSharing ? "Stop sharing screen" : "Share screen"}
              disabled={!browserSupport.getDisplayMedia}
            >
              <Monitor size={18} />
              {isScreenSharing ? "Stop Sharing" : "Share Screen"}
            </Button>

            {isScreenSharing && cameraStream && (
              <Button
                onClick={switchToCamera}
                variant="outline"
                className="flex items-center gap-2"
                title="Switch to camera view"
              >
                <Camera size={18} />
                Show Camera
              </Button>
            )}

            <Button
              onClick={stopCameraStream}
              variant="outline"
              className="flex items-center gap-2"
              title="End meeting"
            >
              <VideoOff size={18} />
              End Meeting
            </Button>
          </>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>Status: {isInitialized ? "Active" : "Not started"}</p>
        {isInitialized && (
          <>
            <p>
              Camera:{" "}
              {cameraStream?.getVideoTracks().length ? "Active" : "Inactive"}
            </p>
            <p>
              Microphone:{" "}
              {cameraStream?.getAudioTracks().length
                ? audioEnabled
                  ? "Active"
                  : "Muted"
                : "Inactive"}
            </p>
            <p>Screen sharing: {isScreenSharing ? "Active" : "Inactive"}</p>
          </>
        )}
      </div>
    </div>
  );
}
