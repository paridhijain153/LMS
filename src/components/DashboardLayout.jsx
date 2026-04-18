import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Heart, Activity, Settings, LogOut, PlusCircle, Users, BarChart3, DollarSign, Shield, GraduationCap, Menu, X, FileQuestion, CreditCard } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import { useAuth } from "@/context/AuthContext";
import "@/styles/layout/dashboard-layout.css";
const navByRole = {
    student: [
    { to: "/student-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/student/courses", label: "All Courses", icon: BookOpen },
    { to: "/student/my-courses", label: "My Courses", icon: GraduationCap },
    { to: "/student/payments", label: "Payments", icon: CreditCard },
        { to: "/student/quizzes/history", label: "Quiz History", icon: FileQuestion },
        { to: "/student/wishlist", label: "Wishlist", icon: Heart },
        { to: "/student/activity", label: "Activity", icon: Activity },
    ],
    instructor: [
    { to: "/instructor-dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/instructor/quizzes", label: "Manage Quizzes", icon: FileQuestion },
      { to: "/instructor/courses", label: "My Courses", icon: BookOpen },
        { to: "/instructor/create", label: "Create Course", icon: PlusCircle },
        { to: "/instructor/quizzes/create", label: "Create Quiz", icon: FileQuestion },
        { to: "/instructor/students", label: "Students", icon: Users },
        { to: "/instructor/earnings", label: "Earnings", icon: DollarSign },
    ],
    admin: [
    { to: "/admin-dashboard", label: "Overview", icon: LayoutDashboard },
        { to: "/admin/users", label: "Users", icon: Users },
        { to: "/admin/courses", label: "Courses", icon: BookOpen },
        { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
};
const roleLabels = {
    student: { label: "Student", icon: GraduationCap },
    instructor: { label: "Instructor", icon: BookOpen },
    admin: { label: "Admin", icon: Shield },
};
export const DashboardLayout = ({ role, children }) => {
    const [open, setOpen] = useState(false);
    const items = navByRole[role];
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const RoleIcon = roleLabels[role].icon;

    const handleLogout = () => {
      logout();
      setOpen(false);
      navigate("/auth");
    };

    return (<div className="dashboard-layout">
      {/* Mobile top bar */}
      <header className="mobile-header">
        <Logo />
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </Button>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className={clsx("sidebar", open && "sidebar--open")}>
          <div className="sidebar__header">
            <Logo />
          </div>

          <div style={{ padding: "0 1rem" }}>
            <span className="sidebar__role-badge">
              <RoleIcon />
              {roleLabels[role].label}
            </span>
          </div>

          <nav className="sidebar__nav">
            {items.map((item) => {
            const active = location.pathname === item.to;
            return (<NavLink key={item.to} to={item.to} end onClick={() => setOpen(false)} className={clsx("sidebar__nav-item", active && "sidebar__nav-item--active")}>
                  <item.icon />
                  {item.label}
                </NavLink>);
        })}
          </nav>

          <div className="sidebar__footer">
            <NavLink to="/settings" className="sidebar__nav-item">
              <Settings /> Settings
            </NavLink>
            <button type="button" onClick={handleLogout} className="sidebar__nav-item sidebar__nav-item-btn">
              <LogOut /> Logout
            </button>
          </div>
        </aside>

        {open && (<div className="sidebar-overlay" onClick={() => setOpen(false)}/>)}

        <main className="dashboard-main">{children}</main>
      </div>
    </div>);
};
