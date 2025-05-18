// "use client";
import { createClient } from "@/utils/supabase/server";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, BookOpen, Clock, Award, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const enrolledCourses = [
    {
      id: 1,
      title: "Grade 7 Mathematics",
      instructor: "Dr. Sarah Johnson",
      progress: 68,
      lastAccessed: "Algebra Basics",
      image: "/math-course.jpg",
      totalLessons: 24,
      completedLessons: 16,
    },
    {
      id: 2,
      title: "Grade 8 Integrated Science",
      instructor: "Prof. Michael Chen",
      progress: 42,
      lastAccessed: "Cell Biology",
      image: "/science-course.jpg",
      totalLessons: 30,
      completedLessons: 13,
    },
    {
      id: 3,
      title: "Grade 9 Pre-Technical Studies",
      instructor: "Eng. David Wilson",
      progress: 15,
      lastAccessed: "Technical Drawing",
      image: "/tech-course.jpg",
      totalLessons: 18,
      completedLessons: 3,
    },
  ];

  const recommendedCourses = [
    {
      id: 4,
      title: "Mathematics Challenge",
      description: "Advanced problems for grade 7 students",
      rating: 4.8,
      students: 1245,
      image: "/math-advanced.jpg",
    },
    {
      id: 5,
      title: "Science Explorers",
      description: "Hands-on experiments and activities",
      rating: 4.6,
      students: 892,
      image: "/science-lab.jpg",
    },
  ];

  const achievements = [
    {
      name: "Fast Learner",
      icon: <Clock className="h-5 w-5" />,
      date: "Earned 2 days ago",
    },
    {
      name: "Perfect Score",
      icon: <Award className="h-5 w-5" />,
      date: "Earned 1 week ago",
    },
    {
      name: "Course Complete",
      icon: <BookOpen className="h-5 w-5" />,
      date: "Earned 2 weeks ago",
    },
  ];
  return (
    <ScrollArea className=" h-[90vh] w-full ">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <section className="mb-10">
          <Card className="border-none shadow-none bg-gradient-to-r from-primary/10 to-blue-100">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    Welcome back, {user?.email}!
                  </h1>
                  <p className="text-muted-foreground">
                    Continue your learning journey where you left off
                  </p>
                </div>
                <Button className="mt-4 md:mt-0">
                  Continue Learning <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Current Progress */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary" />
            Your Courses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="h-40 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    By {course.instructor}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress: {course.progress}%</span>
                      <span>
                        {course.completedLessons}/{course.totalLessons} lessons
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Last accessed: {course.lastAccessed}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Recommended Courses */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Recommended For You
            </h2>
            <Button variant="ghost" className="text-primary">
              See All <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedCourses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-40 bg-gray-100 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <CardHeader>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">{course.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                        {course.rating} ({course.students} students)
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="mr-3">
                        Preview
                      </Button>
                      <Button>Enroll Now</Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Award className="h-5 w-5 mr-2 text-primary" />
            Your Achievements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center space-x-4 space-y-0 pb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {achievement.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {achievement.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {achievement.date}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </ScrollArea>
  );
}
