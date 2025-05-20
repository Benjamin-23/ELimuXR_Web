// app/courses/page.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

const curriculum = {
  "7": {
    "Integrated Science": [
      "Living Things & Environment",
      "Human Body Systems",
      "Force & Energy",
    ],
    Mathematics: ["Algebra Basics", "Number Theory", "Geometry"],
    "Pre-Technical Studies": [
      "Technical Drawing",
      "Materials Technology",
      "Tools & Equipment",
    ],
  },
  "8": {
    "Integrated Science": ["Cell Biology", "Respiratory System"],
    Mathematics: ["Algebraic Expressions", "Linear Equations"],
    "Pre-Technical Studies": ["Engineering Principles", "Energy & Power"],
  },
  "9": {
    "Integrated Science": ["Digestive System", "Atoms & Elements"],
    Mathematics: ["Quadratic Equations", "Trigonometry"],
    "Pre-Technical Studies": ["Electronics", "Control Systems"],
  },
};

export default function CoursesPage() {
  return (
    <ScrollArea className="h-[90vh]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">Explore Your Courses</h1>
          <p className="text-muted-foreground">
            Select your grade to view available subjects and topics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(curriculum).map(([grade, subjects]) => (
            <Card key={grade} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                  Grade {grade}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(subjects).map(([subject, topics]) => (
                    <div key={subject} className="mb-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                        {subject}
                      </h3>
                      <ul className="space-y-1 pl-6">
                        {topics.map((topic) => (
                          <li
                            key={topic}
                            className="text-sm text-muted-foreground"
                          >
                            • {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/study?grade=${grade}`}>
                    View Details <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-secondary/50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">How to Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Select Your Grade",
                description: "Choose your current academic level",
              },
              {
                title: "Pick a Subject",
                description: "Explore math, science or technical studies",
              },
              {
                title: "Start Learning",
                description: "Access lessons, videos and quizzes",
              },
            ].map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center mr-3 mt-0.5">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
