import { useMemo } from "react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { useAdmin } from "@/context/AdminContext";
import "@/styles/pages/dashboard.css";
import "@/styles/pages/admin-management.css";

export default function AdminAnalytics() {
  const { users, courses } = useAdmin();

  const usersByRole = useMemo(() => {
    const map = { student: 0, instructor: 0, admin: 0 };
    users.forEach((user) => {
      if (map[user.role] !== undefined) {
        map[user.role] += 1;
      }
    });

    return [
      { role: "Student", count: map.student },
      { role: "Instructor", count: map.instructor },
      { role: "Admin", count: map.admin },
    ];
  }, [users]);

  const courseCategoryShare = useMemo(() => {
    const counts = {};
    courses.forEach((course) => {
      counts[course.category] = (counts[course.category] ?? 0) + 1;
    });

    const colors = ["#646cff", "#7f8cff", "#55b38a", "#f2a65a", "#d06b6b", "#8a7adf"];
    return Object.entries(counts).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [courses]);

  const topCoursesByStudents = useMemo(() => {
    return [...courses]
      .sort((a, b) => b.students - a.students)
      .slice(0, 6)
      .map((course) => ({
        name: course.title.length > 22 ? `${course.title.slice(0, 22)}...` : course.title,
        students: course.students,
      }));
  }, [courses]);

  return (
    <DashboardLayout role="admin">
      <TopBar title="Admin Analytics" subtitle="Role distribution, course category mix, and top performing courses." showSearch={false} />

      <div className="dashboard-content">
        <section className="admin-analytics-grid">
          <div className="chart-card">
            <h3 className="chart-card__title">Users by role</h3>
            <div className="admin-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usersByRole}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="role" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Bar dataKey="count" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3 className="chart-card__title">Courses by category</h3>
            <div className="admin-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={courseCategoryShare} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={4}>
                    {courseCategoryShare.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="chart-card">
          <h3 className="chart-card__title">Top courses by enrollment</h3>
          <div className="admin-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCoursesByStudents} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={12} width={140} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="students" fill="var(--primary-glow)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
