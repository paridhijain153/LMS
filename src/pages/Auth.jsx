import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Github, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import "@/styles/pages/auth.css";

const roleRedirectMap = {
  student: "/student-dashboard",
  instructor: "/instructor-dashboard",
  admin: "/admin-dashboard",
};

function deriveNameFromEmail(email) {
  if (!email.includes("@")) {
    return "Learner";
  }

  const [localPart] = email.split("@");
  return localPart || "Learner";
}

export const AuthShell = ({ mode, title, subtitle }) => {
    const isSignup = mode === "signup";
    const navigate = useNavigate();
    const { user, login, logout } = useAuth();
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      role: "student",
    });

    const onFieldChange = (field) => (event) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = (event) => {
      event.preventDefault();

      const email = formData.email.trim();
      const password = formData.password.trim();
      const role = formData.role;
      const name = isSignup
        ? formData.name.trim()
        : formData.name.trim() || deriveNameFromEmail(email);

      if (!email || !password || !name) {
        toast({
          title: "Missing fields",
          description: "Please fill in all required fields before continuing.",
          variant: "destructive",
        });
        return;
      }

      login({ name, role });
      toast({
        title: "Login successful",
        description: `Welcome ${name}! Redirecting to your ${role} dashboard.`,
      });

      navigate(roleRedirectMap[role] ?? "/student-dashboard");
    };

    const handleLogout = () => {
      logout();
      toast({ title: "Logged out", description: "Your local session has been cleared." });
    };

    return (<div className="auth-layout">
      {/* Left brand panel */}
      <div className="auth-brand">
        <div className="auth-brand__overlay"/>
        <Logo to="/" className="auth-brand__logo"/>
        <div className="auth-brand__copy">
          <h2 className="auth-brand__heading">Learn without limits.</h2>
          <p className="auth-brand__desc">
            Join 50,000+ learners advancing their careers with expert-led courses.
          </p>
        </div>
        <div className="auth-brand__footer">© 2025 EduVibe</div>
      </div>

      {/* Right form */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-logo-mobile"><Logo to="/"/></div>
          <div className="auth-heading-group">
            <h1 className="auth-heading">{title}</h1>
            <p className="auth-subheading">{subtitle}</p>
          </div>

          <div className="auth-card">
            {user && (<div className="auth-session">
                <p>
                  Signed in as <strong>{user.name}</strong> ({user.role})
                </p>
                <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut /> Logout
                </Button>
              </div>)}

            <form className="auth-form" onSubmit={handleSubmit}>
              {isSignup && (<div className="form-field">
                  <Label htmlFor="name">Full name</Label>
                  <div className="input-icon-wrap">
                    <User className="input-icon"/>
                    <Input id="name" value={formData.name} onChange={onFieldChange("name")} placeholder="Jane Doe" className="form-input--icon-left"/>
                  </div>
                </div>)}
              <div className="form-field">
                <Label htmlFor="email">Email</Label>
                <div className="input-icon-wrap">
                  <Mail className="input-icon"/>
                  <Input id="email" type="email" value={formData.email} onChange={onFieldChange("email")} placeholder="you@email.com" className="form-input--icon-left"/>
                </div>
              </div>
              <div className="form-field">
                <Label htmlFor="password">Password</Label>
                <div className="input-icon-wrap">
                  <Lock className="input-icon"/>
                  <Input id="password" type="password" value={formData.password} onChange={onFieldChange("password")} placeholder="••••••••" className="form-input--icon-left"/>
                </div>
              </div>
              <div className="form-field">
                <Label htmlFor="role">Role (demo)</Label>
                <select id="role" value={formData.role} onChange={onFieldChange("role")} className="auth-select">
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {!isSignup && (<div className="auth-forgot">
                  <a href="#">Forgot password?</a>
                </div>)}
              <Button type="submit" variant="hero" className="btn--lg" style={{ width: "100%" }}>
                {isSignup ? "Create account" : "Sign in"}
              </Button>
            </form>

            <div className="auth-divider">
              <div className="auth-divider__line"/>OR<div className="auth-divider__line"/>
            </div>

            <Button variant="outline" style={{ width: "100%" }}>
              <Github /> Continue with GitHub
            </Button>
          </div>

          <p className="auth-footer">
            {isSignup ? "Already have an account? " : "New to EduVibe? "}
            <Link to={isSignup ? "/login" : "/signup"}>
              {isSignup ? "Sign in" : "Create one"}
            </Link>
          </p>
        </div>
      </div>
    </div>);
};
export const Login = () => <AuthShell mode="login" title="Welcome back" subtitle="Sign in to continue learning."/>;
export const Signup = () => <AuthShell mode="signup" title="Create your account" subtitle="Start learning in less than a minute."/>;
