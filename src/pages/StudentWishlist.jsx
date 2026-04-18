import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { useStudent } from "@/context/StudentContext";
import "@/styles/pages/student-features.css";

export default function StudentWishlist() {
  const { wishlistCourses } = useStudent();

  return (
    <DashboardLayout role="student">
      <TopBar title="Wishlist" subtitle="Courses you saved for later." />
      <div className="dashboard-content">
        {wishlistCourses.length === 0 ? (
          <section className="student-empty-state">
            <Heart />
            <h3>Your wishlist is empty</h3>
            <p>Browse courses and add your favorites to keep them here.</p>
            <Button asChild>
              <Link to="/student/courses">Browse courses</Link>
            </Button>
          </section>
        ) : (
          <section className="student-courses-grid">
            {wishlistCourses.map((course) => (
              <div key={course.id} className="student-course-tile">
                <CourseCard course={course} />
              </div>
            ))}
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
