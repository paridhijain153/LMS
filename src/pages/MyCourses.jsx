import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageState } from "@/components/PageState";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/CourseCard";
import { useCourse } from "@/context/CourseContext";
import { useStudent } from "@/context/StudentContext";
import "@/styles/pages/dashboard.css";
import "@/styles/pages/student-features.css";

export default function MyCourses() {
  const { enrolledCourses, isHydrated: isCourseHydrated } = useCourse();
  const { getCourseProgress, isHydrated: isStudentHydrated } = useStudent();

  return (
    <DashboardLayout role="student">
      <TopBar
        title="My Courses"
        subtitle="Your enrolled courses in one place."
        showSearch={false}
      />

      <div className="dashboard-content">
        {!isCourseHydrated || !isStudentHydrated ? (
          <PageState
            type="loading"
            title="Loading your courses"
            description="Fetching enrolled courses and progress."
          />
        ) : enrolledCourses.length === 0 ? (
          <PageState
            type="empty"
            title="No enrolled courses yet"
            description="Go to All Courses and enroll to begin your learning journey."
            action={<Button asChild><Link to="/student/courses">Browse all courses</Link></Button>}
            icon={BookOpen}
          />
        ) : (
          <section className="courses-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {enrolledCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={{
                  ...course,
                  progress: getCourseProgress(course.id),
                }}
              />
            ))}
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
