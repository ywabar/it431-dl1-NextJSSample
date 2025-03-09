// Course type definition
export interface Course {
  id: number;
  title: string;
  description: string;
  estimatedTime: string;
}

// Initial course data
export const courseData: Course[] = [
  {
    id: 1,
    title: "Build a Basic Bookcase",
    description:
      "Learn how to build a basic bookcase with this step-by-step guide.",
    estimatedTime: "4 hours",
  },
  {
    id: 2,
    title: "Build a Birdhouse",
    description: "Learn how to build a birdhouse with this step-by-step guide.",
    estimatedTime: "3 hours",
  },
  {
    id: 3,
    title: "Build a Bird Feeder",
    description:
      "Learn how to build a bird feeder with this step-by-step guide.",
    estimatedTime: "2 hours",
  },
];

// In-memory database (would use a real database in production)
let courses: Course[] = [...courseData];

// CRUD operations
export const getCourses = (): Course[] => courses;

export const getCourseById = (id: number): Course | undefined => {
  console.log("Looking for course with ID:", id);
  console.log("Available courses:", courses);
  const course = courses.find((course) => course.id === id);
  console.log("Found course:", course);
  return course;
};

export const createCourse = (course: Omit<Course, "id">): Course => {
  const newId =
    courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
  const newCourse = { ...course, id: newId };
  courses.push(newCourse);
  return newCourse;
};

export const updateCourse = (
  id: number,
  updates: Partial<Omit<Course, "id">>
): Course | null => {
  const index = courses.findIndex((course) => course.id === id);
  if (index === -1) return null;

  const updatedCourse = { ...courses[index], ...updates };
  courses[index] = updatedCourse;
  return updatedCourse;
};

export const deleteCourse = (id: number): boolean => {
  const initialLength = courses.length;
  courses = courses.filter((course) => course.id !== id);
  return courses.length !== initialLength;
};
