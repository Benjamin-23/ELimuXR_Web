"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Copy,
  Edit,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types
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

export default function MeetingDashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
  });
  const { toast } = useToast();

  // Load meetings from localStorage on component mount
  useEffect(() => {
    const savedMeetings = localStorage.getItem("meetings");
    if (savedMeetings) {
      setMeetings(JSON.parse(savedMeetings));
    }
  }, []);

  // Save meetings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("meetings", JSON.stringify(meetings));
  }, [meetings]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Generate a unique meeting ID
  const generateMeetingId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  // Create a new meeting
  const handleCreateMeeting = () => {
    const meetingId = generateMeetingId();
    const newMeeting: Meeting = {
      id: meetingId,
      title: formData.title,
      description: formData.description,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime,
      link: `${window.location.origin}/protected/dashboard/online-class/${meetingId}`,
      status: "upcoming",
      createdAt: new Date().toISOString(),
    };

    setMeetings([...meetings, newMeeting]);
    setFormData({
      title: "",
      description: "",
      scheduledDate: "",
      scheduledTime: "",
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "Meeting created",
      description: "The meeting link has been created successfully.",
    });
  };

  // Edit an existing meeting
  const handleEditMeeting = () => {
    if (!currentMeeting) return;

    const updatedMeetings = meetings.map((meeting) => {
      if (meeting.id === currentMeeting.id) {
        return {
          ...meeting,
          title: formData.title,
          description: formData.description,
          scheduledDate: formData.scheduledDate,
          scheduledTime: formData.scheduledTime,
        };
      }
      return meeting;
    });

    setMeetings(updatedMeetings);
    setIsEditDialogOpen(false);
    setCurrentMeeting(null);

    toast({
      title: "Meeting updated",
      description: "The meeting details have been updated successfully.",
    });
  };

  // Delete a meeting
  const handleDeleteMeeting = (id: string) => {
    if (confirm("Are you sure you want to delete this meeting?")) {
      const updatedMeetings = meetings.filter((meeting) => meeting.id !== id);
      setMeetings(updatedMeetings);

      toast({
        title: "Meeting deleted",
        description: "The meeting has been deleted successfully.",
      });
    }
  };

  // Copy meeting link to clipboard
  const copyLinkToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);

    toast({
      title: "Link copied",
      description: "Meeting link copied to clipboard.",
    });
  };

  // Open edit dialog with meeting data
  const openEditDialog = (meeting: Meeting) => {
    setCurrentMeeting(meeting);
    setFormData({
      title: meeting.title,
      description: meeting.description,
      scheduledDate: meeting.scheduledDate,
      scheduledTime: meeting.scheduledTime,
    });
    setIsEditDialogOpen(true);
  };

  // Get status badge based on meeting status
  const getStatusBadge = (status: Meeting["status"]) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          >
            Upcoming
          </Badge>
        );
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
          >
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            Completed
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Meeting Button */}
      <div className="flex justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Create Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Meeting</DialogTitle>
              <DialogDescription>
                Create a new meeting link for students to join.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter meeting title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter meeting description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="scheduledDate">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="scheduledDate"
                      name="scheduledDate"
                      type="date"
                      className="pl-10"
                      value={formData.scheduledDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="scheduledTime">Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="scheduledTime"
                      name="scheduledTime"
                      type="time"
                      className="pl-10"
                      value={formData.scheduledTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateMeeting}
                disabled={!formData.title || !formData.scheduledDate}
              >
                Create Meeting
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Meetings List */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Meetings</CardTitle>
          <CardDescription>
            Manage your scheduled meetings and share links with students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {meetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No meetings scheduled</h3>
              <p className="text-sm text-gray-500 mt-2">
                Create your first meeting by clicking the "Create Meeting"
                button.
              </p>
            </div>
          ) : (
            <Table>
              <TableCaption>A list of your scheduled meetings.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Meeting</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{meeting.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                          {meeting.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {meeting.scheduledDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{meeting.scheduledDate}</span>
                        </div>
                      )}
                      {meeting.scheduledTime && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-4 w-4" />
                          <span>{meeting.scheduledTime}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(meeting.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="max-w-[180px] truncate text-sm">
                          {meeting.link}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyLinkToClipboard(meeting.link)}
                          title="Copy link"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(meeting)}
                          title="Edit meeting"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMeeting(meeting.id)}
                          title="Delete meeting"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Meeting Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Meeting</DialogTitle>
            <DialogDescription>
              Update the details for this meeting.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Meeting Title</Label>
              <Input
                id="edit-title"
                name="title"
                placeholder="Enter meeting title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="Enter meeting description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-scheduledDate">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="edit-scheduledDate"
                    name="scheduledDate"
                    type="date"
                    className="pl-10"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-scheduledTime">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="edit-scheduledTime"
                    name="scheduledTime"
                    type="time"
                    className="pl-10"
                    value={formData.scheduledTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditMeeting}
              disabled={!formData.title || !formData.scheduledDate}
            >
              Update Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
