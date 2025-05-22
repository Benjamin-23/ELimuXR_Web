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
  [key: string]: {
    [subStrand: string]: string[];
  };
};

type CurriculumSubject = string[] | CurriculumUnit | "coming-soon";

type CurriculumGrade = {
  [subject: string]: CurriculumSubject;
};

type Curriculum = {
  [grade: string]: CurriculumGrade;
};

const curriculum: Curriculum = {
  "7": {
    "Integrated Science": {
      "Living things and the Environment": {
        "Human Reproductive System": [
          "The Male Reproductive System",
          "The Female Reproductive System",
        ],
        "Human Excretory System": [
          "Parts of the Human Skin and their Functions",
          "The Urinary System",
          "Parts of the Kidney and their Functions",
        ],
      },
      "Human Body Systems": {
        "Digestive System": ["Digestive System"],
        "Circulatory System": ["Circulatory System"],
      },
      "Force and Energy": {
        "Electrical Energy": ["Simple Electrical Circuits"],
        Magnetism: ["Properties of a Magnet"],
      },
    },
    Mathematics: "coming-soon",
    "Pre-Technical Studies": "coming-soon",
  },
  "8": {
    "Integrated Science": {
      "Living Things and their Environment": {
        "The Cells": [
          "The Cell",
          "Components of a Plant Cell and their Functions",
          "Components of an Animal Cell and their Functions",
        ],
      },
      "Human Body Systems": {
        "Respiratory System": ["Respiratory system"],
      },
    },
    Mathematics: "coming-soon",
    "Pre-Technical Studies": "coming-soon",
  },
  "9": {
    "Integrated Science": {
      "Human Body Systems": {
        "Digestive System": ["The Digestive System"],
      },
      "Mixtures, Elements and Compounds": {
        "Atomic Structure": ["Structure of the atom", "Metals and Alloys"],
      },
    },
    Mathematics: "coming-soon",
    "Pre-Technical Studies": "coming-soon",
  },
};

export default function StudyPage() {
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [strand, setStrand] = useState("");
  const [subStrand, setSubStrand] = useState("");
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

  const strands =
    grade && subject && isCurriculumUnit(curriculum[grade][subject])
      ? Object.keys(curriculum[grade][subject] as CurriculumUnit)
      : [];

  const subStrands =
    grade && subject && strand && isCurriculumUnit(curriculum[grade][subject])
      ? Object.keys((curriculum[grade][subject] as CurriculumUnit)[strand])
      : [];

  const topics =
    grade &&
    subject &&
    strand &&
    subStrand &&
    isCurriculumUnit(curriculum[grade][subject])
      ? (curriculum[grade][subject] as CurriculumUnit)[strand][subStrand]
      : [];

  // Helper type guard function
  function isCurriculumUnit(
    subject: CurriculumSubject,
  ): subject is CurriculumUnit {
    return (
      typeof subject === "object" &&
      !Array.isArray(subject) &&
      subject !== ("coming-soon" as any)
    );
  }

  return (
    <div className="flex h-[90vh] bg-muted w-full px-4">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto">
          {/* Grade/Subject/Strand/SubStrand/Topic Selection */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
              onValueChange={(value) => {
                setSubject(value);
                setStrand("");
                setSubStrand("");
                setTopic("");
              }}
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

            <Select
              onValueChange={(value) => {
                setStrand(value);
                setSubStrand("");
                setTopic("");
              }}
              value={strand}
              disabled={
                !subject || curriculum[grade][subject] === "coming-soon"
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Strand" />
              </SelectTrigger>
              <SelectContent>
                {subject &&
                  curriculum[grade][subject] !== "coming-soon" &&
                  strands.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => {
                setSubStrand(value);
                setTopic("");
              }}
              value={subStrand}
              disabled={!strand}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Sub-Strand" />
              </SelectTrigger>
              <SelectContent>
                {strand &&
                  subStrands.map((ss) => (
                    <SelectItem key={ss} value={ss}>
                      {ss}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={setTopic}
              value={topic}
              disabled={!subStrand}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Lesson" />
              </SelectTrigger>
              <SelectContent>
                {subStrand &&
                  topics.map((t) => (
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
                    <DialogContent className="sm:max-w-fit bg-muted">
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

              {curriculum[grade][subject] === "coming-soon" ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center text-muted-foreground">
                    <p className="text-lg">Coming Soon</p>
                    <p>We're working on content for {subject}</p>
                  </div>
                </div>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {strands.map((strandItem) => (
                    <AccordionItem key={strandItem} value={strandItem}>
                      <AccordionTrigger className="text-lg font-medium hover:no-underline">
                        <div className="flex items-center">
                          <BookOpen className="w-5 h-5 mr-3 text-primary" />
                          {strandItem}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 ml-8">
                          {isCurriculumUnit(curriculum[grade][subject]) &&
                            Object.keys(
                              (curriculum[grade][subject] as CurriculumUnit)[
                                strandItem
                              ],
                            ).map((subStrandItem) => (
                              <div key={subStrandItem} className="mt-4">
                                <h3 className="font-semibold text-foreground mb-2">
                                  {subStrandItem}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {(
                                    curriculum[grade][subject] as CurriculumUnit
                                  )[strandItem][subStrandItem].map(
                                    (topicItem) => (
                                      <Button
                                        key={topicItem}
                                        variant="outline"
                                        className="justify-start text-left h-auto py-3"
                                        onClick={() => {
                                          setStrand(strandItem);
                                          setSubStrand(subStrandItem);
                                          setTopic(topicItem);
                                        }}
                                      >
                                        {topicItem}
                                      </Button>
                                    ),
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
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

      {/* Chat Panel and Floating Button */}
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
