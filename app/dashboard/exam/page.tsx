// app/exams/page.tsx
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const examTopics = [
  {
    id: "bio-101",
    title: "Human Reproductive System",
    subject: "Integrated Science",
    grade: "Grade 7",
    questionCount: 25,
    timeLimit: 30,
    completed: false,
    bestScore: null,
  },
  {
    id: "bio-102",
    title: "Circulatory System",
    subject: "Integrated Science",
    grade: "Grade 7",
    questionCount: 20,
    timeLimit: 25,
    completed: true,
    bestScore: 85,
  },
  {
    id: "math-201",
    title: "Algebra Basics",
    subject: "Mathematics",
    grade: "Grade 7",
    questionCount: 30,
    timeLimit: 45,
    completed: false,
    bestScore: null,
  },
  {
    id: "tech-301",
    title: "Technical Drawing",
    subject: "Pre-Technical Studies",
    grade: "Grade 7",
    questionCount: 15,
    timeLimit: 20,
    completed: true,
    bestScore: 92,
  },
  {
    id: "bio-801",
    title: "Cell Biology",
    subject: "Integrated Science",
    grade: "Grade 8",
    questionCount: 25,
    timeLimit: 30,
    completed: false,
    bestScore: null,
  },
  {
    id: "math-802",
    title: "Linear Equations",
    subject: "Mathematics",
    grade: "Grade 8",
    questionCount: 20,
    timeLimit: 35,
    completed: true,
    bestScore: 78,
  },
];

export default function ExamsPage() {
  const [selectedGrade, setSelectedGrade] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  const filteredExams = examTopics.filter((exam) => {
    const gradeMatch = selectedGrade === "All" || exam.grade === selectedGrade;
    const subjectMatch =
      selectedSubject === "All" || exam.subject === selectedSubject;
    return gradeMatch && subjectMatch;
  });

  const grades = [
    "All",
    ...Array.from(new Set(examTopics.map((exam) => exam.grade))),
  ];
  const subjects = [
    "All",
    ...Array.from(new Set(examTopics.map((exam) => exam.subject))),
  ];

  return (
    <ScrollArea className=" h-[90vh]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Examinations</h1>
          <p className="text-muted-foreground">
            Test your knowledge on various topics across different subjects
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium mb-1">
              Grade Level
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exam Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{exam.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{exam.subject}</span>
                  <span className="mx-2">•</span>
                  <span>{exam.grade}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{exam.questionCount} questions</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{exam.timeLimit} minute time limit</span>
                  </div>
                  {exam.completed && exam.bestScore && (
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span>Best score: {exam.bestScore}%</span>
                    </div>
                  )}
                  {!exam.completed && (
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>Not attempted yet</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={exam.completed ? "outline" : "default"}
                >
                  {exam.completed ? "Retake Exam" : "Start Exam"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredExams.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No exams found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your filters to find available exams
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
