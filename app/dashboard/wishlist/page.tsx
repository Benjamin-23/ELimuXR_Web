// app/wishlist/page.tsx
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Clock, Star, X } from "lucide-react";
import { useState } from "react";

const wishlistItems = [
  {
    id: "math-301",
    title: "Advanced Algebra Mastery",
    instructor: "Dr. Sarah Johnson",
    rating: 4.8,
    duration: "8 weeks",
    price: "$79.99",
    originalPrice: "$99.99",
    image: "/math-course.jpg",
  },
  {
    id: "sci-202",
    title: "Science Explorers Lab",
    instructor: "Prof. Michael Chen",
    rating: 4.6,
    duration: "6 weeks",
    price: "$59.99",
    originalPrice: "$79.99",
    image: "/science-course.jpg",
  },
  {
    id: "tech-105",
    title: "Engineering Fundamentals",
    instructor: "Eng. David Wilson",
    rating: 4.9,
    duration: "10 weeks",
    price: "$89.99",
    originalPrice: "$119.99",
    image: "/tech-course.jpg",
  },
];

export default function WishlistPage() {
  const [items, setItems] = useState(wishlistItems);

  const removeFromWishlist = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Heart className="h-8 w-8 mr-3 text-pink-500 fill-pink-500" />
          My Wishlist
        </h1>
        <p className="text-muted-foreground">
          {items.length} {items.length === 1 ? "course" : "courses"} saved for
          later
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow-lg transition-shadow group"
            >
              <CardHeader className="relative pb-0">
                <div className="h-40 bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-gray-700" />
                </button>
                {item.originalPrice && (
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                    On Sale
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle className="text-lg mb-1">{item.title}</CardTitle>
                <p className="text-sm text-muted-foreground mb-3">
                  By {item.instructor}
                </p>

                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-4">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-sm">{item.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-sm text-muted-foreground">
                      {item.duration}
                    </span>
                  </div>
                </div>

                <div className="flex items-center mt-4">
                  {item.originalPrice && (
                    <span className="line-through text-sm text-muted-foreground mr-2">
                      {item.originalPrice}
                    </span>
                  )}
                  <span className="font-bold text-lg">{item.price}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button className="w-full">Enroll Now</Button>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-10 w-10 text-pink-400" />
          </div>
          <h3 className="text-xl font-medium mb-1">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6">
            Save courses you're interested in by clicking the heart icon
          </p>
          <Button>Browse Courses</Button>
        </div>
      )}
    </div>
  );
}
