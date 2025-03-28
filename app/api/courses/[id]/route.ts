import { NextResponse } from "next/server";
import { Course } from "@/types/course";
import clientPromise from "@/lib/mongodb";

// GET: Retrieve a course by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params
) {
  try {
    const { id } = await context.params; // Await params before accessing
    const courseId = parseInt(id, 10);

    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("coursesDB");
    const course = await db
      .collection("courses")
      .findOne<Course>({ id: courseId });

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error retrieving course:", error);
    return NextResponse.json(
      { error: "Failed to retrieve course." },
      { status: 500 }
    );
  }
}

// PUT: Update a course by ID
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params
) {
  try {
    const { id } = await context.params; // Await params before accessing
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID." },
        { status: 400 }
      );
    }

    const updatedCourse: Partial<Course> = await request.json();

    const client = await clientPromise;
    const db = client.db("coursesDB");
    const course = await db
      .collection("courses")
      .findOne<Course>({ id: courseId });

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    const updatedCourseValues = { ...course, ...updatedCourse } as any;

    delete updatedCourseValues["_id"]; // Ensure id is not overwritten

    console.log("Updating course with values:", updatedCourseValues);

    const updatedCourseDB = await db
      .collection("courses")
      .updateOne({ id: course.id }, { $set: updatedCourseValues });

    console.log("Updated course in DB:", updatedCourseDB);

    const newCourseDB = await db
      .collection("courses")
      .findOne<Course>({ id: courseId });

    return NextResponse.json(newCourseDB, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a course by ID
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params
) {
  try {
    const { id } = await context.params; // Await params before accessing
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("coursesDB");
    const course = await db
      .collection("courses")
      .findOne<Course>({ id: courseId });

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    await db.collection("courses").deleteOne({ id: courseId });

    return NextResponse.json(
      { message: `Course with ID ${courseId} deleted.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course." },
      { status: 500 }
    );
  }
}
