import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import CourseCard from "@/components/CourseCard";

interface Course {
  id: number;
  title: string;
  description: string;
  instructor?: string;
  thumbnail?: string;
  // Add any other course properties that exist in your model
}

// This is a Server Component that fetches data
async function getCourses(): Promise<Course[]> {
  // In server components, we need an absolute URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const res = await fetch(`${baseUrl}/api/courses`, {
    cache: "no-store", // Disable caching for this request
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }
  
  return res.json();
}

const Home: FC = async () => {
  const courses = await getCourses();
  
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Available Courses</h1>
        
        {courses.length === 0 ? (
          <p className="text-center text-gray-500">No courses available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
