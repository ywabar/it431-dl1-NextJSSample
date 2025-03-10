import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Course } from "@/types/course";

// Define the path to the JSON file
const dataFilePath = path.join(process.cwd(), "data", "courses.json");

// Helper function to read courses
const readCourses = (): Course[] => {
  try {
    const jsonData = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(jsonData) as Course[];
  } catch (error) {
    console.error("Error reading courses file:", error);
    return [];
  }
};

// Helper function to write courses
const writeCourses = (courses: Course[]) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(courses, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to courses file:", error);
  }
};

// GET: Retrieve a course by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const courses = readCourses();
    // Await params before accessing its properties
    const id = (await params).id;
    const courseId = parseInt(id, 10);
    const course = courses.find((c) => c.id === courseId);

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve course." },
      { status: 500 }
    );
  }
}

// PUT: Update a course by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const courses = readCourses();
    // Await params before accessing its properties
    const id = (await params).id;
    const courseId = parseInt(id, 10);
    const updatedCourse: Course = await request.json();

    // Find the course index
    const courseIndex = courses.findIndex((c) => c.id === courseId);

    // If course not found, return 404
    if (courseIndex === -1) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    // Ensure the ID is preserved and consistent
    updatedCourse.id = courseId;

    // Update the course
    courses[courseIndex] = updatedCourse;

    // Write the updated course list back to the file
    writeCourses(courses);

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update course." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a course by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const courses = readCourses();
    // Await params before accessing its properties
    const id = (await params).id;
    const courseId = parseInt(id, 10);

    // Filter out the course to delete
    const filteredCourses = courses.filter((c) => c.id !== courseId);

    // If no course was removed, return 404
    if (filteredCourses.length === courses.length) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    // Write the updated course list back to the file
    writeCourses(filteredCourses);

    return NextResponse.json(
      { message: `Course with ID ${courseId} deleted.` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete course." },
      { status: 500 }
    );
  }
}
