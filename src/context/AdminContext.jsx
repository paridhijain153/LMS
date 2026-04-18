import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { courses as seedCourses } from "@/data/mockData";

const ADMIN_STORAGE_KEY = "lms_admin_state";

const AdminContext = createContext(undefined);

function getDefaultUsers() {
  return [
    { id: "u1", name: "Sarah Mitchell", email: "sarah@example.com", role: "instructor", status: "active" },
    { id: "u2", name: "Marco Diaz", email: "marco@example.com", role: "student", status: "active" },
    { id: "u3", name: "Aisha Khan", email: "aisha@example.com", role: "instructor", status: "active" },
    { id: "u4", name: "Tom Walker", email: "tom@example.com", role: "student", status: "suspended" },
    { id: "u5", name: "Lin Zhao", email: "lin@example.com", role: "student", status: "active" },
  ];
}

function getDefaultCourses() {
  return seedCourses.map((course) => ({
    ...course,
    status: "published",
  }));
}

function getDefaultAdminState() {
  return {
    users: getDefaultUsers(),
    courses: getDefaultCourses(),
  };
}

export function AdminProvider({ children }) {
  const [adminState, setAdminState] = useState(getDefaultAdminState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (!raw) {
        setAdminState(getDefaultAdminState());
      } else {
        const parsed = JSON.parse(raw);
        setAdminState({
          ...getDefaultAdminState(),
          ...parsed,
        });
      }
    } catch (error) {
      console.error("Failed to load admin state", error);
      setAdminState(getDefaultAdminState());
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminState));
  }, [adminState, isHydrated]);

  const addUser = (payload) => {
    setAdminState((prev) => ({
      ...prev,
      users: [
        {
          id: `u_${Date.now()}`,
          name: payload.name.trim(),
          email: payload.email.trim().toLowerCase(),
          role: payload.role,
          status: payload.status,
        },
        ...prev.users,
      ],
    }));
  };

  const updateUser = (userId, updates) => {
    setAdminState((prev) => ({
      ...prev,
      users: prev.users.map((user) => (user.id === userId ? { ...user, ...updates } : user)),
    }));
  };

  const deleteUser = (userId) => {
    setAdminState((prev) => ({
      ...prev,
      users: prev.users.filter((user) => user.id !== userId),
    }));
  };

  const toggleUserStatus = (userId) => {
    setAdminState((prev) => ({
      ...prev,
      users: prev.users.map((user) => {
        if (user.id !== userId) {
          return user;
        }

        return {
          ...user,
          status: user.status === "active" ? "suspended" : "active",
        };
      }),
    }));
  };

  const addCourse = (payload) => {
    setAdminState((prev) => ({
      ...prev,
      courses: [
        {
          id: `${Date.now()}`,
          title: payload.title.trim(),
          instructor: payload.instructor.trim(),
          thumbnail: prev.courses[0]?.thumbnail,
          rating: Number(payload.rating),
          students: Number(payload.students),
          duration: payload.duration.trim(),
          price: Number(payload.price),
          category: payload.category.trim(),
          status: payload.status,
        },
        ...prev.courses,
      ],
    }));
  };

  const updateCourse = (courseId, updates) => {
    setAdminState((prev) => ({
      ...prev,
      courses: prev.courses.map((course) => (course.id === courseId ? { ...course, ...updates } : course)),
    }));
  };

  const deleteCourse = (courseId) => {
    setAdminState((prev) => ({
      ...prev,
      courses: prev.courses.filter((course) => course.id !== courseId),
    }));
  };

  const toggleCourseStatus = (courseId) => {
    setAdminState((prev) => ({
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

  const metrics = useMemo(() => {
    const usersCount = adminState.users.length;
    const activeUsersCount = adminState.users.filter((user) => user.status === "active").length;
    const coursesCount = adminState.courses.length;
    const publishedCoursesCount = adminState.courses.filter((course) => course.status === "published").length;
    const estimatedRevenue = adminState.courses.reduce((sum, course) => sum + course.students * course.price, 0);

    return {
      usersCount,
      activeUsersCount,
      coursesCount,
      publishedCoursesCount,
      estimatedRevenue,
    };
  }, [adminState]);

  const value = useMemo(
    () => ({
      users: adminState.users,
      courses: adminState.courses,
      metrics,
      isHydrated,
      addUser,
      updateUser,
      deleteUser,
      toggleUserStatus,
      addCourse,
      updateCourse,
      deleteCourse,
      toggleCourseStatus,
    }),
    [adminState, metrics, isHydrated],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used inside AdminProvider");
  }

  return context;
}
