import MeetingDashboard from "@/components/admin/meeting-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Meeting Management",
  description: "Create and manage meeting links for students",
};

export default function AdminMeetingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Meeting Management</h1>
      <MeetingDashboard />
    </div>
  );
}
