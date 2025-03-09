import { FC } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { getCourseById } from "@/models/courseModel";
import DeleteCourseButton from "@/components/DeleteCourseButton";

interface CoursePageProps {
  params: {
    id: string;
  };
}

const CoursePage: FC<CoursePageProps> = async ({ params }) => {
  const courseId = parseInt((await params).id, 10);
  
  // Check if the ID is valid
  if (isNaN(courseId)) {
    notFound();
  }
  
  const course = getCourseById(courseId);
  
  // If course not found, show 404
  if (!course) {
    notFound();
  }
  
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <Link href="/">
              <Button variant="outline" className="mb-4">
                ← Back to Courses
              </Button>
            </Link>
            <DeleteCourseButton courseId={courseId} />
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <div className="mb-6">
                <div className="bg-gray-100 p-3 rounded-md inline-block">
                  <span className="text-gray-700 font-medium">Estimated Time:</span> {course.estimatedTime}
                </div>
              </div>
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePage; 