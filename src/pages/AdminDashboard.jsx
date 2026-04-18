import { Link } from "react-router-dom";
import { Users, BookOpen, DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/context/AdminContext";
import "@/styles/pages/dashboard.css";
import "@/styles/pages/admin-management.css";

const enrollData = [
    { d: "Mon", v: 230 }, { d: "Tue", v: 320 }, { d: "Wed", v: 410 },
    { d: "Thu", v: 280 }, { d: "Fri", v: 520 }, { d: "Sat", v: 380 }, { d: "Sun", v: 290 },
];
const categoryData = [
    { name: "Development", value: 42, color: "var(--primary)" },
    { name: "Design", value: 24, color: "var(--primary-glow)" },
    { name: "Business", value: 18, color: "hsl(265 85% 80%)" },
    { name: "Other", value: 16, color: "hsl(220 16% 80%)" },
];

const AdminDashboard = () => {
    const { metrics, users, courses } = useAdmin();
    const stats = [
        { label: "Total users", value: metrics.usersCount.toLocaleString(), icon: Users, change: `${metrics.activeUsersCount} active` },
        { label: "Total courses", value: metrics.coursesCount.toLocaleString(), icon: BookOpen, change: `${metrics.publishedCoursesCount} published` },
        { label: "Estimated revenue", value: `$${metrics.estimatedRevenue.toLocaleString()}`, icon: DollarSign, change: "catalog estimate" },
        { label: "Growth", value: "23.8%", icon: TrendingUp, change: "+3.1%" },
    ];

    const latestUsers = users.slice(0, 5);
    const latestCourses = courses.slice(0, 5);

    return (<DashboardLayout role="admin">
      <TopBar title="Admin Overview" subtitle="Platform-wide analytics and management." showSearch={false}/>
      <div className="dashboard-content">
        <div className="stats-grid">
          {stats.map((s) => (<div key={s.label} className="stat-card">
              <div className="stat-card__header--top">
                <div className="stat-card__icon stat-card__icon--sm">
                  <s.icon />
                </div>
                <Badge className="badge--success">{s.change}</Badge>
              </div>
              <div className="stat-card__value--lg">{s.value}</div>
              <div className="stat-card__label">{s.label}</div>
            </div>))}
        </div>

        <div className="admin-quick-links">
          <Link to="/admin/users" className="admin-quick-link">Manage users <ArrowRight /></Link>
          <Link to="/admin/courses" className="admin-quick-link">Manage courses <ArrowRight /></Link>
          <Link to="/admin/analytics" className="admin-quick-link">View analytics <ArrowRight /></Link>
        </div>

        <div className="grid-3-col">
          <div className="chart-card col-span-2">
            <h3 className="chart-card__title">Weekly enrollments</h3>
            <div className="chart-card__chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                  <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={12}/>
                  <YAxis stroke="var(--muted-foreground)" fontSize={12}/>
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }}/>
                  <Bar dataKey="v" fill="var(--primary)" radius={[8, 8, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="chart-card">
            <h3 className="chart-card__title">Course categories</h3>
            <div style={{ height: "14rem" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={4}>
                    {categoryData.map((d, i) => <Cell key={i} fill={d.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="category-legend">
              {categoryData.map((c) => (<li key={c.name} className="category-legend-item">
                  <span className="category-legend-item__name">
                    <span className="category-legend-dot" style={{ background: c.color }}/>{c.name}
                  </span>
                  <span className="category-legend-item__pct">{c.value}%</span>
                </li>))}
            </ul>
          </div>
        </div>

        <div className="admin-grid-2">
          <div className="table-card">
          <div className="table-card__header">
            <h3 className="table-card__title">Recent users</h3>
            <Button variant="ghost" size="sm" asChild><Link to="/admin/users">Open users</Link></Button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {latestUsers.map((u) => (<tr key={u.id}>
                    <td>
                      <div className="table-user-name">{u.name}</div>
                      <div className="table-user-email">{u.email}</div>
                    </td>
                    <td>{u.role}</td>
                    <td>
                      <Badge className={u.status === "active" ? "badge--success" : "badge--error"}>
                        {u.status}
                      </Badge>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
          </div>

          <div className="table-card">
            <div className="table-card__header">
              <h3 className="table-card__title">Recent courses</h3>
              <Button variant="ghost" size="sm" asChild><Link to="/admin/courses">Open courses</Link></Button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Category</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {latestCourses.map((course) => (<tr key={course.id}>
                      <td>{course.title}</td>
                      <td>{course.category}</td>
                      <td>
                        <Badge className={course.status === "published" ? "badge--success" : "badge--error"}>
                          {course.status}
                        </Badge>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>);
};
export default AdminDashboard;
