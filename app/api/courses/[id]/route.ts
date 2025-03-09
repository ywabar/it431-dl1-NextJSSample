import { NextResponse } from "next/server";
import {
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../../../../models/courseModel";

// GET handler for retrieving a specific course
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("API route called with ID:", params.id);

  const courseId = Number(params.id);

  // Check if id is a valid number
  if (isNaN(courseId)) {
    console.log("Invalid course ID:", params.id);
    return NextResponse.json({ message: "Invalid course ID" }, { status: 400 });
  }

  const course = getCourseById(courseId);
  console.log("Course found:", course);

  if (!course) {
    console.log("Course not found for ID:", courseId);
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(course);
}

// PUT handler for updating a course
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = Number(params.id);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { message: "Invalid course ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updatedCourse = updateCourse(courseId, body);

    if (!updatedCourse) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCourse);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating course", error },
      { status: 500 }
    );
  }
}

// DELETE handler for removing a course
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const courseId = Number(params.id);
  if (isNaN(courseId)) {
    return NextResponse.json({ message: "Invalid course ID" }, { status: 400 });
  }

  const deleted = deleteCourse(courseId);
  if (!deleted) {
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
