import { Link } from "react-router-dom";
import { PlusCircle, DollarSign, Users, Star, BookOpen, ArrowRight, FileQuestion } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInstructor } from "@/context/InstructorContext";
import "@/styles/pages/dashboard.css";

export default function InstructorDashboard() {
  const { metrics, monthlyEarnings, students, courses } = useInstructor();

  const stats = [
    { label: "Total earnings", value: `$${metrics.estimatedRevenue.toLocaleString()}`, change: "Live", icon: DollarSign },
    { label: "Total students", value: metrics.totalStudents.toLocaleString(), change: "Active learners", icon: Users },
    { label: "Avg. rating", value: metrics.avgRating, change: "Across courses", icon: Star },
    { label: "Active courses", value: metrics.activeCourses.toString(), change: `${courses.length} total`, icon: BookOpen },
  ];

  const recentEnrollments = students.slice(0, 5);

  return (
    <DashboardLayout role="instructor">
      <TopBar title="Instructor Studio" subtitle="Manage your courses and track performance." />

      <div className="dashboard-content">
        <div className="quick-actions-header">
          <div>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>Quick actions</h2>
            <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>Launch and manage your course catalog.</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Button variant="hero" size="lg" asChild>
              <Link to="/instructor/create"><PlusCircle /> Create new course</Link>
            </Button>
            <Button variant="soft" size="lg" asChild>
              <Link to="/instructor/quizzes/create"><FileQuestion /> Create quiz</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/instructor/courses">Manage courses <ArrowRight /></Link>
            </Button>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((item) => (
            <div key={item.label} className="stat-card">
              <div className="stat-card__header--top">
                <div className="stat-card__icon stat-card__icon--sm">
                  <item.icon />
                </div>
                <Badge className="badge--success">{item.change}</Badge>
              </div>
              <div className="stat-card__value--lg">{item.value}</div>
              <div className="stat-card__label">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="grid-3-col">
          <div className="chart-card col-span-2">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div>
                <h3 className="chart-card__title" style={{ marginBottom: 0 }}>Earnings overview</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>Last 7 months</p>
              </div>
            </div>
            <div className="chart-card__chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyEarnings}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="v" stroke="url(#g1)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h3 className="chart-card__title" style={{ marginBottom: 0 }}>Recent enrollments</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/instructor/students">View all</Link>
              </Button>
            </div>
            <ul className="enrollment-list">
              {recentEnrollments.length === 0 ? (
                <li className="enrollment-item">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p className="enrollment-item__name">No enrollments yet</p>
                    <p className="enrollment-item__course">Publish a course to start receiving students.</p>
                  </div>
                </li>
              ) : (
                recentEnrollments.map((enrollment) => (
                  <li key={enrollment.id} className="enrollment-item">
                    <div className="enrollment-item__avatar">
                      {enrollment.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p className="enrollment-item__name">{enrollment.name}</p>
                      <p className="enrollment-item__course">{enrollment.courseTitle}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="table-card">
          <div className="table-card__header">
            <h3 className="table-card__title">Your courses</h3>
            <Button variant="soft" size="sm" asChild><Link to="/instructor/courses">Manage all</Link></Button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Students</th>
                  <th>Rating</th>
                  <th>Revenue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <div className="table-user-cell">
                        <img src={course.thumbnail} alt="" className="table-thumbnail" />
                        <span style={{ fontWeight: 500 }}>{course.title}</span>
                      </div>
                    </td>
                    <td>{course.students.toLocaleString()}</td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Star style={{ width: "0.875rem", height: "0.875rem", fill: "var(--warning)", color: "var(--warning)" }} />
                        {course.rating}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>${(course.students * course.price).toLocaleString()}</td>
                    <td><Badge className={course.status === "published" ? "badge--success" : "badge--error"}>{course.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
