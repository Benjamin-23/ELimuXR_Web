// app/instructors/page.tsx
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, BookOpen, Users, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

const instructors = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    subject: "Mathematics",
    rating: 4.9,
    students: 3200,
    courses: 12,
    bio: "PhD in Mathematics with 10+ years teaching experience. Specializes in making complex concepts easy to understand.",
    avatar: "/instructor1.jpg",
    featuredCourses: [
      "Algebra Mastery",
      "Geometry Fundamentals",
      "Advanced Calculus",
    ],
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    subject: "Integrated Science",
    rating: 4.8,
    students: 2800,
    courses: 9,
    bio: "Science educator passionate about hands-on learning and real-world applications of scientific concepts.",
    avatar: "/instructor2.jpg",
    featuredCourses: ["Cell Biology", "Physics in Action", "Chemistry Lab"],
  },
  {
    id: "3",
    name: "Eng. David Wilson",
    subject: "Pre-Technical Studies",
    rating: 4.7,
    students: 1900,
    courses: 7,
    bio: "Professional engineer with industry experience who brings practical knowledge to technical education.",
    avatar: "/instructor3.jpg",
    featuredCourses: [
      "Technical Drawing",
      "Electronics Basics",
      "Engineering Principles",
    ],
  },
];

export default function InstructorsPage() {
  return (
    <ScrollArea className="h-[90vh]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">Meet Our Instructors</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn from experienced educators passionate about student success
          </p>
        </div>

        {/* Instructor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {instructors.map((instructor) => (
            <Card
              key={instructor.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={instructor.avatar} alt={instructor.name} />
                  <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{instructor.name}</CardTitle>
                <p className="text-primary font-medium">{instructor.subject}</p>
                <div className="flex justify-center items-center mt-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-medium">{instructor.rating}</span>
                  <span className="mx-2">•</span>
                  <Users className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-muted-foreground">
                    {instructor.students.toLocaleString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm mb-4">{instructor.bio}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Featured Courses:</h4>
                  <ul className="space-y-1">
                    {instructor.featuredCourses.map((course, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {course}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex space-x-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/instructors/${instructor.id}`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href={`/instructors/${instructor.id}/courses`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Courses
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-secondary/50 p-8 rounded-lg mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15+</div>
              <p className="text-muted-foreground">Qualified Instructors</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">98%</div>
              <p className="text-muted-foreground">Positive Ratings</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <p className="text-muted-foreground">Students Taught</p>
            </div>
          </div>
        </div>

        {/* Become an Instructor CTA */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-center">
              Want to join our team?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 max-w-2xl mx-auto">
              We're always looking for passionate educators to join our growing
              team of instructors.
            </p>
            <Button variant="outline" className="border-primary text-primary">
              Apply to Become an Instructor
            </Button>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
