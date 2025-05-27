// app/page.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, BookOpen, Award, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function HomePage() {
  const featuredCourses = [
    {
      id: 1,
      title: "Pythagorean Theorem",
      description: "Master basic concepts for Grades 7-9",
      rating: 4.8,
      students: 1245,
      image: "/assets/images/mathematics.png",
    },
    {
      id: 2,
      title: "The Human Circulatory System",
      description: "3D models & 3D animated lessons",
      rating: 4.6,
      students: 892,
      image: "/assets/images/The-Human-circulatory-system.png",
    },
    {
      id: 3,
      title: "Scratch Programming Intro",
      description: "Learn essential technical skills",
      rating: 4.7,
      students: 756,
      image: "/assets/images/Introduction-to-cratch-programming.png",
    },
  ];

  const popularSubjects = [
    {
      name: "Mathematics",
      icon: <BookOpen className="h-5 w-5" />,
      courses: 12,
    },
    {
      name: "Integrated Science",
      icon: <BookOpen className="h-5 w-5" />,
      courses: 8,
    },
    {
      name: "Pre-Technical Studies",
      icon: <BookOpen className="h-5 w-5" />,
      courses: 10,
    },
  ];

  return (
    <ScrollArea className="h-[90vh] w-full">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-primary/10 to-blue-100 rounded-xl p-6 sm:p-8 text-center ">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">
              Welcome to <span className="text-primary">ElimuXR</span>
            </h1>
            <p className="text-background mb-6 max-w-2xl mx-auto">
              Learn STEM the Smart Way
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/sign-in">Get Started</Link>
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/">Browse Courses</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Featured Courses</h2>
            <Button variant="ghost" asChild className="text-primary">
              <Link href="/courses">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-0">
                  <div className="h-40 bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {course.description}
                  </p>
                  <div className="flex items-center mt-3 text-sm">
                    <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                    <span>{course.rating}</span>
                    <span className="mx-2">•</span>
                    <span>{course.students} students</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/signup">Enroll Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Subjects */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6">Popular Subjects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {popularSubjects.map((subject, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {subject.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {subject.courses} courses available
                    </p>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link
                      href={`/protected/dashboard/courses?subject=${subject.name.toLowerCase()}`}
                    >
                      Explore
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-10 bg-secondary/50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Sign Up",
                description: "Create your free account in minutes",
                icon: <BookOpen className="h-6 w-6" />,
              },
              {
                title: "Choose Courses",
                description: "Select from our curriculum-aligned courses",
                icon: <BookOpen className="h-6 w-6" />,
              },
              {
                title: "Start Learning",
                description: "Access interactive lessons anytime",
                icon: <BookOpen className="h-6 w-6" />,
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of students who are already improving their math and
            science skills
          </p>
          <Button asChild size="lg">
            <Link href="/sign-up">Create Free Account</Link>
          </Button>
        </section>
      </div>
    </ScrollArea>
  );
}
