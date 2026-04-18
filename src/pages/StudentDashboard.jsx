import { Link } from "react-router-dom";
import { ArrowRight, Award, Clock, Flame, Play, Trophy } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { CourseCard } from "@/components/CourseCard";
import { QuizCard } from "@/components/QuizCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useStudent } from "@/context/StudentContext";
import { useCourse } from "@/context/CourseContext";
import { useQuiz } from "@/context/QuizContext";
import "@/styles/pages/dashboard.css";

const stats = [
  { label: "Hours learned", value: "47", icon: Clock },
  { label: "Courses active", value: "5", icon: Play },
  { label: "Day streak", value: "12", icon: Flame },
  { label: "Certificates", value: "3", icon: Award },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const { enrolledCourses } = useCourse();
  const { wishlistCourses, activity, getCourseProgress } = useStudent();
  const { quizzes, getUserSubmission } = useQuiz();

  const continueCourse = enrolledCourses[0];
  const continueProgress = continueCourse ? getCourseProgress(continueCourse.id) : 0;
  const enrolledCourseIds = enrolledCourses.map((course) => course.id);
  const availableQuizzes = quizzes.filter((quiz) => enrolledCourseIds.includes(quiz.courseId));

  return (
    <DashboardLayout role="student">
      <TopBar
        title={`Welcome back, ${user?.name ?? "Learner"} 👋`}
        subtitle="Pick up where you left off."
      />

      <div className="dashboard-content">
        <div className="stats-grid">
          {stats.map((item) => (
            <div key={item.label} className="stat-card">
              <div className="stat-card__header">
                <div>
                  <div className="stat-card__label">{item.label}</div>
                  <div className="stat-card__value">{item.value}</div>
                </div>
                <div className="stat-card__icon">
                  <item.icon />
                </div>
              </div>
            </div>
          ))}
        </div>

        {continueCourse ? (
          <section className="continue-banner">
            <div className="continue-banner__inner">
              <img src={continueCourse.thumbnail} alt="" className="continue-banner__img" />
              <div className="continue-banner__body">
                <div className="continue-banner__label">Continue learning</div>
                <h3 className="continue-banner__title">{continueCourse.title}</h3>
                <div className="continue-banner__progress">
                  <div className="continue-banner__progress-row">
                    <span>Current progress</span>
                    <span>{continueProgress}%</span>
                  </div>
                  <Progress value={continueProgress} className="progress-root--md progress-root--light" />
                </div>
                <Button asChild style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
                  <Link to={`/learn/${continueCourse.id}`}>Resume <ArrowRight /></Link>
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <section className="activity-card">
            <h2 className="activity-card__title">Start your first course</h2>
            <p className="dash-section-sub">Enroll in a course to begin your learning journey.</p>
            <Button asChild style={{ marginTop: "1rem" }}>
              <Link to="/student/courses">Browse courses</Link>
            </Button>
          </section>
        )}

        <section>
          <div className="dash-section-header">
            <h2 className="dash-section-title">My Courses</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/student/my-courses">View all <ArrowRight /></Link>
            </Button>
          </div>
          <div className="courses-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={{ ...course, progress: getCourseProgress(course.id) }}
                />
              ))
            ) : (
              <p className="dash-section-sub">No enrolled courses yet.</p>
            )}
          </div>
        </section>

        <section>
          <div className="dash-section-header">
            <h2 className="dash-section-title">New Quizzes from your instructors</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/student/quizzes/history">View history <ArrowRight /></Link>
            </Button>
          </div>
          {availableQuizzes.length > 0 ? (
            <div className="courses-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {availableQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  submission={getUserSubmission(quiz.id)}
                />
              ))}
            </div>
          ) : (
            <p className="dash-section-sub">No quizzes available for your enrolled courses yet.</p>
          )}
        </section>

        <div className="grid-3-col">
          <section className="col-span-2">
            <div className="dash-section-header">
              <h2 className="dash-section-title">From your wishlist</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/student/wishlist">Open wishlist</Link>
              </Button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
              {wishlistCourses.length > 0 ? (
                wishlistCourses.map((course) => <CourseCard key={course.id} course={course} />)
              ) : (
                <p className="dash-section-sub">Wishlist is empty.</p>
              )}
            </div>
          </section>

          <section className="activity-card">
            <h2 className="activity-card__title">Recent activity</h2>
            <ul className="activity-list">
              {(activity.length > 0
                ? activity.slice(0, 4).map((entry) => ({
                    who: "You",
                    action: entry.message,
                    time: new Date(entry.createdAt).toLocaleString(),
                    icon: Trophy,
                  }))
                : [
                    {
                      who: "You",
                      action: "have no recent activity yet",
                      time: "Start by enrolling in a course",
                      icon: Play,
                    },
                  ]
              ).map((item, index) => (
                <li key={index} className="activity-item">
                  <Avatar>
                    <AvatarFallback className="avatar__fallback--soft"><item.icon /></AvatarFallback>
                  </Avatar>
                  <div className="activity-item__body">
                    <p><span style={{ fontWeight: 600 }}>{item.who}</span> {item.action}</p>
                    <p className="activity-item__time">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
