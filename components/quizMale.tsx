"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export default function MaleReproductiveSystemQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions: Question[] = [
    {
      question: "Which part of the male reproductive system produces sperm?",
      options: ["Urethra", "Penis", "Testes", "Prostate gland"],
      correctAnswer: "Testes",
      explanation:
        "The testes are responsible for producing sperm and the hormone testosterone.",
    },
    {
      question: "What is the function of the epididymis?",
      options: [
        "Produces testosterone",
        "Stores and matures sperm",
        "Produces semen",
        "Filters urine",
      ],
      correctAnswer: "Stores and matures sperm",
      explanation:
        "The epididymis stores sperm and allows them to mature before ejaculation.",
    },
    // Add all 25 questions here following the same format
    {
      question:
        "During ejaculation, which structure ensures that semen is expelled from the body?",
      options: ["Ureter", "Bladder", "Penis", "Scrotum"],
      correctAnswer: "Penis",
      explanation: "The penis expels semen during ejaculation.",
    },
  ];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowResult(false);
  };

  const checkAnswer = () => {
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    return (
      <ScrollArea className="h-fit w-full rounded-md border bg-muted">
        <div className=" mx-auto mt-8 h-fit overflow-y-auto">
          <div>
            <CardTitle className="text-center">Quiz Completed!</CardTitle>
          </div>
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold">
              Your Score: {score}/{questions.length}
            </div>
            <div className="text-lg">
              {score === questions.length
                ? "Perfect! You're a male reproductive system expert!"
                : score >= questions.length * 0.7
                  ? "Great job! You have a good understanding."
                  : "Keep practicing! Review the material and try again."}
            </div>
            <Button onClick={resetQuiz} className="mt-4">
              Retake Quiz
            </Button>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="w-full bg-muted h-[85vh]">
      <div className="w-full mx-auto p-4">
        <div className="mb-6">
          <div>
            <CardTitle className="text-center">
              The Male Reproductive System – Quiz
            </CardTitle>
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className="text-sm font-medium">Score: {score}</div>
            </div>

            <div className="space-y-6">
              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Choose the best answer for each question</li>
                  <li>Each question has only one correct answer</li>
                  <li>
                    This assessment is designed to test your understanding of
                    the male reproductive system
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold">
                  {questions[currentQuestionIndex].question}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {questions[currentQuestionIndex].options.map(
                    (option, index) => (
                      <Button
                        key={index}
                        variant={
                          selectedOption === option ? "default" : "outline"
                        }
                        className={`justify-start h-auto py-3 text-left ${
                          showResult
                            ? option ===
                              questions[currentQuestionIndex].correctAnswer
                              ? "bg-green-100 border-green-500 text-green-900"
                              : selectedOption === option
                                ? "bg-red-100 border-red-500 text-red-900"
                                : ""
                            : ""
                        }`}
                        onClick={() => handleOptionSelect(option)}
                        disabled={showResult}
                      >
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                        {showResult &&
                          option ===
                            questions[currentQuestionIndex].correctAnswer && (
                            <CheckCircle2 className="ml-2 h-4 w-4" />
                          )}
                        {showResult &&
                          selectedOption === option &&
                          option !==
                            questions[currentQuestionIndex].correctAnswer && (
                            <XCircle className="ml-2 h-4 w-4" />
                          )}
                      </Button>
                    ),
                  )}
                </div>

                {showResult && (
                  <div className="p-4 bg-green-500 rounded-lg">
                    <h4 className="font-semibold mb-2">
                      {selectedOption ===
                      questions[currentQuestionIndex].correctAnswer
                        ? "Correct!"
                        : "Incorrect!"}
                    </h4>
                    <p>{questions[currentQuestionIndex].explanation}</p>
                  </div>
                )}

                <div className="flex justify-end">
                  {!showResult ? (
                    <Button onClick={checkAnswer} disabled={!selectedOption}>
                      Check Answer
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion}>
                      {currentQuestionIndex < questions.length - 1
                        ? "Next Question"
                        : "Finish Quiz"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
