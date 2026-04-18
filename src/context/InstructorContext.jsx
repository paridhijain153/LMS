import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { courses as seedCourses } from "@/data/mockData";
import { getCourseCurriculum } from "@/data/courseCurriculum";

const INSTRUCTOR_STORAGE_KEY = "lms_instructor_state";

const InstructorContext = createContext(undefined);

function getDefaultState() {
  const createdCourses = seedCourses.slice(0, 3).map((course) => ({
    ...course,
    status: "published",
    modules: getCourseCurriculum(course.id),
    resources: [
      { id: `r-${course.id}-1`, type: "video", name: `${course.title} intro.mp4` },
      { id: `r-${course.id}-2`, type: "pdf", name: `${course.title} notes.pdf` },
    ],
  }));

  const students = [
    { id: "s1", name: "Sarah Kim", email: "sarah.kim@example.com", courseId: createdCourses[0]?.id, progress: 74, status: "active", enrolledAt: "2026-03-02" },
    { id: "s2", name: "Marco Ruiz", email: "marco.ruiz@example.com", courseId: createdCourses[0]?.id, progress: 45, status: "active", enrolledAt: "2026-03-15" },
    { id: "s3", name: "Aisha Lee", email: "aisha.lee@example.com", courseId: createdCourses[1]?.id, progress: 29, status: "active", enrolledAt: "2026-03-21" },
    { id: "s4", name: "Tom Walker", email: "tom.walker@example.com", courseId: createdCourses[2]?.id, progress: 90, status: "completed", enrolledAt: "2026-02-11" },
    { id: "s5", name: "Lin Zhao", email: "lin.zhao@example.com", courseId: createdCourses[1]?.id, progress: 12, status: "active", enrolledAt: "2026-04-05" },
  ].filter((student) => student.courseId);

  return {
    courses: createdCourses,
    students,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(INSTRUCTOR_STORAGE_KEY);
    if (!raw) {
      return getDefaultState();
    }

    const parsed = JSON.parse(raw);
    return {
      ...getDefaultState(),
      ...parsed,
    };
  } catch (error) {
    console.error("Failed to load instructor state", error);
    localStorage.removeItem(INSTRUCTOR_STORAGE_KEY);
    return getDefaultState();
  }
}

export function InstructorProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    localStorage.setItem(INSTRUCTOR_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addCourse = (payload) => {
    setState((prev) => {
      const newCourse = {
        id: `c_${Date.now()}`,
        title: payload.title.trim(),
        instructor: payload.instructor.trim(),
        thumbnail: payload.thumbnail || prev.courses[0]?.thumbnail,
        rating: 5,
        students: 0,
        duration: payload.duration.trim() || "0h",
        price: Number(payload.price),
        category: payload.category.trim(),
        status: payload.status,
        modules: payload.modules,
        resources: payload.resources,
      };

      return {
        ...prev,
        courses: [newCourse, ...prev.courses],
      };
    });
  };

  const updateCourse = (courseId, updates) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((course) => (course.id === courseId ? { ...course, ...updates } : course)),
    }));
  };

  const deleteCourse = (courseId) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.filter((course) => course.id !== courseId),
      students: prev.students.filter((student) => student.courseId !== courseId),
    }));
  };

  const toggleCourseStatus = (courseId) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((course) => {
        if (course.id !== courseId) {
          return course;
        }

        return {
          ...course,
          status: course.status === "published" ? "draft" : "published",
        };
      }),
    }));
  };

  const updateStudent = (studentId, updates) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.map((student) => (student.id === studentId ? { ...student, ...updates } : student)),
    }));
  };

  const removeStudent = (studentId) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.filter((student) => student.id !== studentId),
    }));
  };

  const metrics = useMemo(() => {
    const totalStudents = state.students.length;
    const activeCourses = state.courses.filter((course) => course.status === "published").length;
    const estimatedRevenue = state.students.reduce((sum, student) => {
      const course = state.courses.find((item) => item.id === student.courseId);
      if (!course) {
        return sum;
      }

      return sum + course.price;
    }, 0);

    const avgRating = state.courses.length
      ? (state.courses.reduce((sum, course) => sum + course.rating, 0) / state.courses.length).toFixed(1)
      : "0.0";

    return {
      totalStudents,
      activeCourses,
      estimatedRevenue,
      avgRating,
    };
  }, [state]);

  const monthlyEarnings = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    return months.map((month, index) => ({
      m: month,
      v: Math.round(metrics.estimatedRevenue * (0.35 + (index + 1) * 0.08)),
    }));
  }, [metrics.estimatedRevenue]);

  const studentEnrollments = useMemo(() => {
    return state.students
      .map((student) => {
        const course = state.courses.find((item) => item.id === student.courseId);
        if (!course) {
          return null;
        }

        return {
          ...student,
          courseTitle: course.title,
          coursePrice: course.price,
        };
      })
      .filter(Boolean);
  }, [state]);

  const value = useMemo(
    () => ({
      courses: state.courses,
      students: studentEnrollments,
      metrics,
      monthlyEarnings,
      isHydrated,
      addCourse,
      updateCourse,
      deleteCourse,
      toggleCourseStatus,
      updateStudent,
      removeStudent,
    }),
    [state, studentEnrollments, metrics, monthlyEarnings, isHydrated],
  );

  return <InstructorContext.Provider value={value}>{children}</InstructorContext.Provider>;
}

export function useInstructor() {
  const context = useContext(InstructorContext);
  if (!context) {
    throw new Error("useInstructor must be used inside InstructorProvider");
  }

  return context;
}
