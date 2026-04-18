import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { clsx } from "clsx";
import "@/styles/components/logo.css";
export const Logo = ({ className, to = "/" }) => (<Link to={to} className={clsx("logo", className)}>
    <span className="logo__icon">
      <GraduationCap />
    </span>
    <span className="logo__text">
      Edu<span className="text-gradient">Vibe</span>
    </span>
  </Link>);
