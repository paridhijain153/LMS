import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { courses } from "@/data/mockData";
import { buildLessonKey, getCourseCurriculum } from "@/data/courseCurriculum";
import { useAuth } from "@/context/AuthContext";

const StudentContext = createContext(undefined);

function getDefaultStudentState() {
  return {
    wishlistCourseIds: [courses[3]?.id].filter(Boolean),
    completedLessonKeysByCourse: {},
    lastLessonKeyByCourse: {},
    activity: [],
  };
}

function createStorageKey(user) {
  if (!user?.name || user?.role !== "student") {
    return "lms_student_state_guest";
  }

  const safeName = user.name.trim().toLowerCase().replace(/\s+/g, "_");
  return `lms_student_state_${safeName}`;
}

function mapIdsToCourses(ids) {
  return ids
    .map((id) => courses.find((course) => course.id === id))
    .filter(Boolean);
}

function countLessons(curriculum) {
  return curriculum.reduce((total, module) => total + module.lessons.length, 0);
}

function findLessonByKey(curriculum, lessonKey) {
  for (const module of curriculum) {
    const lesson = module.lessons.find((item) => buildLessonKey(module.id, item.id) === lessonKey);
    if (lesson) {
      return { module, lesson };
    }
  }

  return null;
}

export function StudentProvider({ children }) {
  const { user } = useAuth();
  const storageKey = useMemo(() => createStorageKey(user), [user]);
  const [studentState, setStudentState] = useState(getDefaultStudentState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        setStudentState(getDefaultStudentState());
      } else {
        const parsed = JSON.parse(raw);
        setStudentState({
          ...getDefaultStudentState(),
          ...parsed,
        });
      }
    } catch (error) {
      console.error("Failed to load student state", error);
      setStudentState(getDefaultStudentState());
      localStorage.removeItem(storageKey);
    } finally {
      setIsHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify(studentState));
  }, [isHydrated, storageKey, studentState]);

  const appendActivity = (state, message, type = "info") => {
    const event = {
      id: Date.now().toString(),
      message,
      type,
      createdAt: new Date().toISOString(),
    };

    return [event, ...state.activity].slice(0, 20);
  };

  const toggleWishlist = (courseId) => {
    const course = courses.find((item) => item.id === courseId);
    if (!course) {
      return;
    }

    setStudentState((prev) => {
      const isWishlisted = prev.wishlistCourseIds.includes(courseId);
      const wishlistCourseIds = isWishlisted
        ? prev.wishlistCourseIds.filter((id) => id !== courseId)
        : [...prev.wishlistCourseIds, courseId];

      const message = isWishlisted
        ? `Removed ${course.title} from wishlist`
        : `Added ${course.title} to wishlist`;

      return {
        ...prev,
        wishlistCourseIds,
        activity: appendActivity(prev, message, "wishlist"),
      };
    });
  };

  const markLessonComplete = (courseId, moduleId, lessonId, completed = true) => {
    const lessonKey = buildLessonKey(moduleId, lessonId);

    setStudentState((prev) => {
      const existing = new Set(prev.completedLessonKeysByCourse[courseId] ?? []);
      if (completed) {
        existing.add(lessonKey);
      } else {
        existing.delete(lessonKey);
      }

      const completedLessonKeysByCourse = {
        ...prev.completedLessonKeysByCourse,
        [courseId]: Array.from(existing),
      };

      const activityMessage = completed
        ? "Marked a lesson as complete"
        : "Marked a lesson as incomplete";

      return {
        ...prev,
        completedLessonKeysByCourse,
        lastLessonKeyByCourse: {
          ...prev.lastLessonKeyByCourse,
          [courseId]: lessonKey,
        },
        activity: appendActivity(prev, activityMessage, "learning"),
      };
    });
  };

  const setLastLesson = (courseId, moduleId, lessonId) => {
    const lessonKey = buildLessonKey(moduleId, lessonId);
    setStudentState((prev) => ({
      ...prev,
      lastLessonKeyByCourse: {
        ...prev.lastLessonKeyByCourse,
        [courseId]: lessonKey,
      },
    }));
  };

  const getCourseProgress = (courseId) => {
    const curriculum = getCourseCurriculum(courseId);
    const total = countLessons(curriculum);
    const completed = studentState.completedLessonKeysByCourse[courseId]?.length ?? 0;

    if (total === 0) {
      return 0;
    }

    return Math.round((completed / total) * 100);
  };

  const getResumeLesson = (courseId) => {
    const curriculum = getCourseCurriculum(courseId);
    const completed = new Set(studentState.completedLessonKeysByCourse[courseId] ?? []);
    const lastLessonKey = studentState.lastLessonKeyByCourse[courseId];

    if (lastLessonKey) {
      const found = findLessonByKey(curriculum, lastLessonKey);
      if (found) {
        return found;
      }
    }

    for (const module of curriculum) {
      for (const lesson of module.lessons) {
        const key = buildLessonKey(module.id, lesson.id);
        if (!completed.has(key)) {
          return { module, lesson };
        }
      }
    }

    return curriculum[0] ? { module: curriculum[0], lesson: curriculum[0].lessons[0] } : null;
  };

  const value = useMemo(() => {
    const wishlistCourses = mapIdsToCourses(studentState.wishlistCourseIds);

    return {
      wishlistCourseIds: studentState.wishlistCourseIds,
      completedLessonKeysByCourse: studentState.completedLessonKeysByCourse,
      lastLessonKeyByCourse: studentState.lastLessonKeyByCourse,
      activity: studentState.activity,
      wishlistCourses,
      toggleWishlist,
      markLessonComplete,
      setLastLesson,
      getCourseProgress,
      getResumeLesson,
      isHydrated,
    };
  }, [studentState, isHydrated]);

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used inside StudentProvider");
  }

  return context;
}
