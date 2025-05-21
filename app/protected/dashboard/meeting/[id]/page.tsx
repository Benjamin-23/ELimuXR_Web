"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VideoMeeting from "@/components/video-meeting";
import { Calendar, Clock, AlertCircle } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  link: string;
  status: "upcoming" | "active" | "completed";
  createdAt: string;
}

export default function MeetingPage() {
  const params = useParams();
  const meetingId = params.id as string;
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    // Load meetings from localStorage
    const savedMeetings = localStorage.getItem("meetings");
    if (savedMeetings) {
      const meetings = JSON.parse(savedMeetings) as Meeting[];
      const foundMeeting = meetings.find((m) => m.id === meetingId);
      setMeeting(foundMeeting || null);
    }
    setIsLoading(false);
  }, [meetingId]);

  const joinMeeting = () => {
    setHasJoined(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="container mx-auto py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Meeting Not Found</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-center">
              The meeting you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasJoined) {
    return (
      <div className="container mx-auto py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>{meeting.title}</CardTitle>
            <CardDescription>
              You've been invited to join this meeting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>{meeting.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{meeting.scheduledDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{meeting.scheduledTime}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={joinMeeting} className="w-full">
              Join Meeting
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">{meeting.title}</h1>
      <VideoMeeting />
    </div>
  );
}
