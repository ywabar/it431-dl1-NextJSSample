import fs from "fs";
import path from "path";

// Define the path to our JSON file
const coursesFilePath = path.join(process.cwd(), "data", "courses.json");

// Define the course type
export interface Course {
  id: number;
  title: string;
  description: string;
  estimatedTime: string;
}

// Helper function to read courses from the JSON file
function readCoursesFromFile(): Course[] {
  try {
    if (!fs.existsSync(coursesFilePath)) {
      // Create the file with empty array if it doesn't exist
      fs.writeFileSync(coursesFilePath, JSON.stringify([], null, 2), "utf8");
      return [];
    }

    const fileContent = fs.readFileSync(coursesFilePath, "utf8");
    return JSON.parse(fileContent) as Course[];
  } catch (error) {
    console.error("Error reading courses file:", error);
    return [];
  }
}

// Helper function to write courses to the JSON file
function writeCoursesToFile(courses: Course[]): void {
  try {
    fs.writeFileSync(coursesFilePath, JSON.stringify(courses, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing to courses file:", error);
  }
}

// Get all courses
export function getAllCourses(): Course[] {
  return readCoursesFromFile();
}

// Get a specific course by ID
export function getCourseById(id: number): Course | undefined {
  const courses = readCoursesFromFile();
  return courses.find((course) => course.id === id);
}

// Add a new course
export function addCourse(courseData: Omit<Course, "id">): Course {
  const courses = readCoursesFromFile();

  // Generate a new ID (simple increment approach)
  const maxId =
    courses.length > 0 ? Math.max(...courses.map((course) => course.id)) : 0;

  const newCourse: Course = {
    id: maxId + 1,
    ...courseData,
  };

  courses.push(newCourse);
  writeCoursesToFile(courses);

  return newCourse;
}

// Update an existing course
export function updateCourse(
  id: number,
  courseData: Partial<Course>
): Course | undefined {
  const courses = readCoursesFromFile();
  const courseIndex = courses.findIndex((course) => course.id === id);

  if (courseIndex === -1) {
    return undefined;
  }

  // Update the course data
  const updatedCourse = {
    ...courses[courseIndex],
    ...courseData,
    id, // Ensure ID doesn't change
  };

  courses[courseIndex] = updatedCourse;
  writeCoursesToFile(courses);

  return updatedCourse;
}

// Delete a course
export function deleteCourse(id: number): boolean {
  const courses = readCoursesFromFile();
  const initialLength = courses.length;

  const filteredCourses = courses.filter((course) => course.id !== id);

  if (filteredCourses.length === initialLength) {
    return false; // No course was deleted
  }

  writeCoursesToFile(filteredCourses);
  return true;
}

// Function to create a new course
export const createCourse = (courseData: {
  title: string;
  description: string;
  estimatedTime: string;
}) => {
  try {
    const courses = getAllCourses();

    // Generate a new ID (simple approach: max ID + 1)
    const newId =
      courses.length > 0 ? Math.max(...courses.map((c: any) => c.id)) + 1 : 1;

    const newCourse = {
      id: newId,
      ...courseData,
    };

    // Add the new course to the array
    courses.push(newCourse);

    // Write the updated array back to the file
    fs.writeFileSync(coursesFilePath, JSON.stringify(courses, null, 2));

    return newCourse;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};
