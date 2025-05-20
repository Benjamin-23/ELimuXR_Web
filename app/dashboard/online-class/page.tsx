// app/classes/page.tsx
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Video,
  Users,
  Calendar,
  Clock,
  Mic,
  MessageSquare,
  Share2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

const liveClasses = [
  {
    id: "math-101",
    title: "Algebra Fundamentals Live",
    instructor: "Dr. Sarah Johnson",
    time: "Today, 2:00 PM",
    duration: "45 min",
    participants: 24,
    subject: "Mathematics",
    grade: "Grade 7",
    joinLink: "#",
  },
  {
    id: "sci-202",
    title: "Cell Biology Workshop",
    instructor: "Prof. Michael Chen",
    time: "Tomorrow, 10:00 AM",
    duration: "1 hour",
    participants: 18,
    subject: "Integrated Science",
    grade: "Grade 8",
    joinLink: "#",
  },
];

const recordedClasses = [
  {
    id: "math-102",
    title: "Geometry Concepts",
    instructor: "Dr. Sarah Johnson",
    date: "2 days ago",
    duration: "38 min",
    views: 124,
    subject: "Mathematics",
    grade: "Grade 7",
  },
  {
    id: "tech-301",
    title: "Technical Drawing Basics",
    instructor: "Eng. David Wilson",
    date: "1 week ago",
    duration: "52 min",
    views: 87,
    subject: "Pre-Technical Studies",
    grade: "Grade 9",
  },
];

export default function OnlineClassesPage() {
  return (
    <ScrollArea className=" h-[90vh]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Online Classes</h1>
          <p className="text-muted-foreground">
            Join live sessions or watch recorded classes at your convenience
          </p>
        </div>

        {/* Live Classes Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Video className="h-6 w-6 mr-2 text-red-500" />
              Live Classes
            </h2>
            <Button variant="ghost" className="text-primary">
              View All <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveClasses.map((classItem) => (
              <Card
                key={classItem.id}
                className="border-primary/20 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{classItem.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {classItem.subject} • {classItem.grade}
                      </p>
                    </div>
                    <div className="flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                      LIVE
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{classItem.participants} students joined</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{classItem.time}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{classItem.duration}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex space-x-3">
                  <Button asChild className="flex-1">
                    <Link href={classItem.joinLink}>Join Now</Link>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Recorded Classes Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Video className="h-6 w-6 mr-2 text-primary" />
              Recorded Classes
            </h2>
            <Button variant="ghost" className="text-primary">
              View All <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordedClasses.map((classItem) => (
              <Card
                key={classItem.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-0">
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="lg"
                        className="rounded-full h-16 w-16 bg-white/90"
                      >
                        <Video className="h-6 w-6 text-primary" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle>{classItem.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-3">
                    {classItem.subject} • {classItem.grade}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{classItem.views} views</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{classItem.duration}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    Watch Now
                  </Button>
                  <Button variant="outline" size="icon">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Upcoming Schedule */}
        <section className="mt-12 bg-secondary/50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Upcoming Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                date: "Mon, Jun 10",
                class: "Physics: Motion & Forces",
                time: "11:00 AM - 12:00 PM",
                instructor: "Prof. Michael Chen",
              },
              {
                date: "Wed, Jun 12",
                class: "Algebra: Quadratic Equations",
                time: "2:00 PM - 3:00 PM",
                instructor: "Dr. Sarah Johnson",
              },
              {
                date: "Fri, Jun 14",
                class: "Technical Drawing Workshop",
                time: "10:00 AM - 11:30 AM",
                instructor: "Eng. David Wilson",
              },
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="text-sm font-medium text-primary">
                    {item.date}
                  </div>
                  <CardTitle className="text-lg">{item.class}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center">
                      <Mic className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{item.instructor}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Add to Calendar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </ScrollArea>
  );
}
