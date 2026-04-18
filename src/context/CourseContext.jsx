import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const CourseContext = createContext(undefined);

function createStorageKey(user) {
  if (!user?.name || user?.role !== "student") {
    return "lms_enrolled_courses_guest";
  }

  const safeName = user.name.trim().toLowerCase().replace(/\s+/g, "_");
  return `lms_enrolled_courses_${safeName}`;
}

function loadEnrolledCourses(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load enrolled courses", error);
    localStorage.removeItem(storageKey);
    return [];
  }
}

export function CourseProvider({ children }) {
  const { user } = useAuth();
  const storageKey = useMemo(() => createStorageKey(user), [user]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [hydratedKey, setHydratedKey] = useState("");

  useEffect(() => {
    const nextCourses = loadEnrolledCourses(storageKey);
    setEnrolledCourses(nextCourses);
    setHydratedKey(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (hydratedKey !== storageKey) {
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify(enrolledCourses));
  }, [storageKey, enrolledCourses, hydratedKey]);

  const enrollCourse = (course) => {
    if (!course?.id) {
      return;
    }

    setEnrolledCourses((prev) => {
      const alreadyEnrolled = prev.some((item) => item.id === course.id);
      if (alreadyEnrolled) {
        return prev;
      }

      return [...prev, course];
    });
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some((course) => course.id === courseId);
  };

  const value = useMemo(
    () => ({
      enrolledCourses,
      enrollCourse,
      isEnrolled,
      isHydrated: hydratedKey === storageKey,
    }),
    [enrolledCourses, hydratedKey, storageKey],
  );

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used inside CourseProvider");
  }

  return context;
}
