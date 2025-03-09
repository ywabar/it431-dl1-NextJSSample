import { NextResponse } from "next/server";
import { getCourses, createCourse } from "../../../models/courseModel";

// GET handler for retrieving all courses
export async function GET() {
  try {
    const courses = getCourses();
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { message: "Error fetching courses", error },
      { status: 500 }
    );
  }
}

// POST handler for creating a new course
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, estimatedTime } = body;

    // Validate required fields
    if (!title || !description || !estimatedTime) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newCourse = createCourse({ title, description, estimatedTime });
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating course", error },
      { status: 500 }
    );
  }
}
