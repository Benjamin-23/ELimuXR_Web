// app/study/page.tsx
// app/study/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Video,
  BoxSelect,
  ScanEye,
  FileText,
  BookOpen,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MaleReproductiveSystemQuiz from "@/components/quizMale";
import { Label } from "@/components/ui/label";
type CurriculumUnit = {
  [key: string]: string[];
};

type CurriculumSubject = string[] | CurriculumUnit;

type CurriculumGrade = {
  [subject: string]: CurriculumSubject;
};

type Curriculum = {
  [grade: string]: CurriculumGrade;
};

const curriculum: Curriculum = {
  "7": {
    "Integrated Science": {
      "1.0. Living things and the Environment": [
        "Human Reproductive System",
        "The Male Reproductive System",
        "The Female Reproductive System",
        "Human Excretory System",
        "Parts of the Human Skin and their Functions",
        "Parts of the Urinary System and their Functions",
      ],
      "2.0. Human Body Systems": ["The Circulatory System"],
      "3.0. Force and Energy": ["Electrical Energy", "Magnetism"],
    },
    Mathematics: ["Algebra Basics", "Number Theory", "Geometry Fundamentals"],
    "Pre-Technical Studies": [
      "Basic Technical Drawing",
      "Materials Technology",
      "Tools and Equipment",
    ],
  },
  "8": {
    "Integrated Science": {
      "1.0. Living Things and their Environment": [
        "The Cell",
        "Movement of Materials In and Out of the Cell",
      ],
      "2.0. Human Body Systems": ["Respiratory system"],
    },
    Mathematics: [
      "Algebraic Expressions",
      "Linear Equations",
      "Geometric Constructions",
    ],
    "Pre-Technical Studies": [
      "Engineering Principles",
      "Energy and Power",
      "Manufacturing Processes",
    ],
  },
  "9": {
    "Integrated Science": {
      "1.0. Human Body Systems": ["The Digestive System"],
      "2.0. Mixtures, Elements and Compounds": [
        "Structure of the atom",
        "Metals and Alloys",
      ],
    },
    Mathematics: ["Quadratic Equations", "Trigonometry", "Coordinate Geometry"],
    "Pre-Technical Studies": [
      "Advanced Technical Drawing",
      "Electronics Fundamentals",
      "Control Systems",
    ],
  },
};

export default function StudyPage() {
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");
  const [topic, setTopic] = useState("");
  const [activeMode, setActiveMode] = useState("video");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);

  const grades = Object.keys(curriculum).map((g) => ({
    value: g,
    label: `Grade ${g}`,
  }));

  const subjects = grade
    ? Object.keys(curriculum[grade as keyof typeof curriculum])
    : [];

  const units =
    grade && subject
      ? isCurriculumUnit(curriculum[grade][subject])
        ? Object.keys(curriculum[grade][subject])
        : ["All Topics"]
      : [];

  // Helper type guard function
  function isCurriculumUnit(
    subject: CurriculumSubject,
  ): subject is CurriculumUnit {
    return typeof subject === "object" && !Array.isArray(subject);
  }

  // When accessing nested properties, use type assertions
  const topics =
    grade && subject && unit
      ? isCurriculumUnit(curriculum[grade][subject])
        ? curriculum[grade][subject][unit]
        : curriculum[grade][subject]
      : [];

  return (
    <div className="flex h-[90vh] bg-muted w-full">
      {/* Main Content */}
      <div className="flex-1  overflow-y-auto w-full ">
        <div className="max-w-8xl mx-auto">
          {/* Grade/Subject/Unit/Topic Selection */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Select onValueChange={setGrade} value={grade}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={setSubject}
              value={subject}
              disabled={!grade}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {grade &&
                  subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setUnit} value={unit} disabled={!subject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Unit" />
              </SelectTrigger>
              <SelectContent>
                {subject &&
                  units.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u.replace(/^\d+\.\d+\.\s*/, "")}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setTopic} value={topic} disabled={!unit}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Topic" />
              </SelectTrigger>
              <SelectContent>
                {unit &&
                  topics.map((t: string) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content Display Area */}
          {topic ? (
            <div className="space-y-6">
              {/* Mode Selector */}
              <Tabs
                value={activeMode}
                onValueChange={setActiveMode}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-5 bg-secondary">
                  <TabsTrigger
                    value="video"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </TabsTrigger>
                  <TabsTrigger
                    value="3d"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <BoxSelect className="w-4 h-4 mr-2" />
                    3D Model
                  </TabsTrigger>
                  <TabsTrigger
                    value="ar"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <ScanEye className="w-4 h-4 mr-2" />
                    AR Mode
                  </TabsTrigger>
                  <TabsTrigger
                    value="notes"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Notes
                  </TabsTrigger>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Take Quiz</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-primary">
                      <MaleReproductiveSystemQuiz />
                      <DialogFooter>
                        <Button type="submit">Submit</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TabsList>

                {/* Content for each mode */}
                <TabsContent value="video" className="mt-4">
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">
                        {topic} - Video Lesson
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                        <div className="text-white text-lg">
                          Video Player for {topic} ({subject})
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Other mode contents would go here... */}
              </Tabs>
            </div>
          ) : grade && subject ? (
            <div className="bg-card rounded-lg shadow border border-border p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {subject} Curriculum - Grade {grade}
              </h2>

              <Accordion type="multiple" className="w-full">
                {units.map((unitTitle) => (
                  <AccordionItem key={unitTitle} value={unitTitle}>
                    <AccordionTrigger className="text-lg font-medium hover:no-underline">
                      <div className="flex items-center">
                        <BookOpen className="w-5 h-5 mr-3 text-primary" />
                        {unitTitle}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2 ml-8">
                        {grade &&
                          subject &&
                          unitTitle &&
                          isCurriculumUnit(
                            curriculum[grade as keyof typeof curriculum][
                              subject as keyof (typeof curriculum)[typeof grade]
                            ],
                          ) &&
                          (
                            curriculum[grade as keyof typeof curriculum][
                              subject as keyof (typeof curriculum)[typeof grade]
                            ] as CurriculumUnit
                          )[unitTitle]?.map((topicItem: string) => (
                            <Button
                              key={topicItem}
                              variant="outline"
                              className="justify-start text-left h-auto py-3"
                              onClick={() => setTopic(topicItem)}
                            >
                              {topicItem}
                            </Button>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-card rounded-lg shadow border border-border">
              <div className="text-center text-muted-foreground">
                <p className="text-lg">Please select a grade and subject</p>
                <p>to view the curriculum</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Panel and Floating Button (same as before) */}
      <div
        className={`h-full bg-sidebar shadow-lg transition-all duration-300 ${
          isChatOpen ? "w-80" : "w-0"
        }`}
      >
        {isChatOpen && (
          <div className="h-full flex flex-col border-l border-sidebar-border">
            <div className="p-4 border-b border-sidebar-border flex justify-between items-center">
              <h3 className="font-semibold text-sidebar-foreground">
                Study Chat
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                ×
              </Button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Chat messages would go here */}
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground text-center">
                  Today, 2:30 PM
                </div>
                <div className="flex justify-start">
                  <div className="bg-sidebar-accent text-sidebar-accent-foreground rounded-lg p-3 max-w-xs">
                    <p>Hello! How can I help with {topic || "this topic"}?</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-sidebar-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-sidebar text-sidebar-foreground border-sidebar-border"
                />
                <Button className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
      >
        <MessageCircle className="w-5 h-5" />
      </Button>
    </div>
  );
}

{
  /* Chat Panel */
}
