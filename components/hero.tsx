"use client";
import Head from "next/head";
import { redirect } from "next/navigation";
import { useState } from "react";
import {
  FiPlay,
  FiAward,
  FiBookOpen,
  FiBarChart2,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

export default function Header() {
  const [activeTab, setActiveTab] = useState("math");

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>MathSciLearn | Grades 7-9 Integrated Math & Science</title>
        <meta
          name="description"
          content="Interactive learning platform for middle school math and science"
        />
      </Head>

      {/* Navigation */}
      <nav className="bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-primary">
                MathSciLearn
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <a
                  href="#features"
                  className="px-3 py-2 text-sm font-medium text-secondary-foreground hover:text-primary"
                >
                  Features
                </a>
                <a
                  href="#courses"
                  className="px-3 py-2 text-sm font-medium text-secondary-foreground hover:text-primary"
                >
                  Courses
                </a>
                <a
                  href="#testimonials"
                  className="px-3 py-2 text-sm font-medium text-secondary-foreground hover:text-primary"
                >
                  Testimonials
                </a>
              </div>
            </div>
            <button
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
              onClick={() => redirect("/sign-in")}
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              <span className="block text-primary">Master Math & Science</span>
              <span className="block">Grades 7-9 Made Easy</span>
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              Interactive lessons that connect mathematical concepts with
              real-world science applications.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10">
                Start Learning Now
              </button>
              <button className="flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 md:py-4 md:text-lg md:px-10">
                <FiPlay className="mr-2" /> Watch Demo
              </button>
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <img
              src="/images/hero-image.png"
              alt="Students learning math and science"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-12 bg-secondary px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-foreground text-center">
            Why Students Love MathSciLearn
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <FiPlay className="h-8 w-8 text-primary" />,
                title: "Engaging Videos",
                description:
                  "Animated explanations that make complex topics simple",
              },
              {
                icon: <FiBookOpen className="h-8 w-8 text-primary" />,
                title: "Integrated Learning",
                description: "Math concepts applied to real science problems",
              },
              {
                icon: <FiAward className="h-8 w-8 text-primary" />,
                title: "Progress Tracking",
                description:
                  "Badges and certificates to celebrate achievements",
              },
              {
                icon: <FiBarChart2 className="h-8 w-8 text-primary" />,
                title: "Adaptive Practice",
                description: "Questions that adjust to your skill level",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-12 bg-muted px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-foreground text-center">
            Explore Our Courses
          </h2>

          <div className="mt-6 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setActiveTab("math")}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  activeTab === "math"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:bg-muted"
                }`}
              >
                Mathematics
              </button>
              <button
                onClick={() => setActiveTab("science")}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  activeTab === "science"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:bg-muted"
                }`}
              >
                Integrated Science
              </button>
            </div>
          </div>

          <div className="mt-8">
            {activeTab === "math" ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Algebra Foundations",
                    grade: "Grade 7",
                    description: "Variables, expressions, and simple equations",
                    color: "bg-purple-100 text-purple-800",
                  },
                  {
                    title: "Geometry & Measurement",
                    grade: "Grade 8",
                    description:
                      "Angles, shapes, area, volume, and transformations",
                    color: "bg-green-100 text-green-800",
                  },
                  {
                    title: "Data & Probability",
                    grade: "Grade 9",
                    description: "Statistics, graphs, and chance calculations",
                    color: "bg-yellow-100 text-yellow-800",
                  },
                ].map((course, index) => (
                  <Card key={index}>
                    <CardHeader className={`${course.color} rounded-t-lg`}>
                      <h3 className="text-lg font-medium">{course.title}</h3>
                      <p className="text-sm">{course.grade}</p>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-muted-foreground">
                        {course.description}
                      </p>
                      <Button variant="outline" className="mt-4">
                        Explore Course
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Physics Connections",
                    grade: "Grade 7",
                    description:
                      "Motion, forces, and energy with mathematical modeling",
                    color: "bg-red-100 text-red-800",
                  },
                  {
                    title: "Chemistry in Math",
                    grade: "Grade 8",
                    description:
                      "Chemical equations, ratios, and measurement conversions",
                    color: "bg-blue-100 text-blue-800",
                  },
                  {
                    title: "Biological Systems",
                    grade: "Grade 9",
                    description:
                      "Population growth, genetics, and statistical analysis",
                    color: "bg-teal-100 text-teal-800",
                  },
                ].map((course, index) => (
                  <Card key={index}>
                    <CardHeader className={`${course.color} rounded-t-lg`}>
                      <h3 className="text-lg font-medium">{course.title}</h3>
                      <p className="text-sm">{course.grade}</p>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-muted-foreground">
                        {course.description}
                      </p>
                      <Button variant="outline" className="mt-4">
                        Explore Course
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-12 px-4 sm:px-6 lg:px-8 bg-secondary"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-foreground text-center">
            What Students Say
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                quote:
                  "I used to hate algebra until I saw how it connects to physics experiments on this platform!",
                name: "Riya K.",
                grade: "Grade 8",
              },
              {
                quote:
                  "The way they explain geometry concepts with real-world architecture examples is amazing.",
                name: "Alex M.",
                grade: "Grade 9",
              },
              {
                quote:
                  "Finally understand how ratios work in chemistry equations thanks to MathSciLearn!",
                name: "Jordan T.",
                grade: "Grade 7",
              },
              {
                quote:
                  "The interactive graphs make data analysis so much easier to understand.",
                name: "Sam P.",
                grade: "Grade 8",
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-4">
                    <p className="font-medium text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-muted-foreground">{testimonial.grade}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-primary-foreground sm:text-4xl">
            Ready to transform your learning?
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-primary-foreground/90">
            Join thousands of students mastering math and science together.
          </p>
          <div className="mt-8 flex justify-center">
            <Button variant="secondary" className="text-primary">
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                About
              </h3>
              <div className="mt-4 space-y-4">
                <a
                  href="#"
                  className="text-base text-foreground hover:text-primary"
                >
                  Our Mission
                </a>
                <a
                  href="#"
                  className="text-base text-foreground hover:text-primary"
                >
                  Team
                </a>
                <a
                  href="#"
                  className="text-base text-foreground hover:text-primary"
                >
                  Careers
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                Support
              </h3>
              <div className="mt-4 space-y-4">
                <a
                  href="#"
                  className="text-base text-foreground hover:text-primary"
                >
                  Help Center
                </a>
                <a
                  href="#"
                  className="text-base text-foreground hover:text-primary"
                >
                  Contact Us
                </a>
                <a
                  href="#"
                  className="text-base text-foreground hover:text-primary"
                >
                  FAQ
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                Legal
              </h3>
              <div className="mt-4 space-y-4">
                <a
                  href="#"
                  className="text-base text-foreground hover:text-primary"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-base text-foreground hover:text-primary"
                >
                  Terms
                </a>
                <a
                  href="#"
                  className="text-base text-foreground hover:text-primary"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                Connect
              </h3>
              <div className="mt-4 space-y-4">
                <a
                  href="#"
                  className="flex items-center text-base text-foreground hover:text-primary"
                >
                  <FiMail className="mr-2" /> Email
                </a>
                <a
                  href="#"
                  className="flex items-center text-base text-foreground hover:text-primary"
                >
                  <FiPhone className="mr-2" /> (555) 123-4567
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-muted pt-8 flex justify-between">
            <p className="text-base text-muted-foreground">
              &copy; 2024 MathSciLearn. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {/* Social media icons would go here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
