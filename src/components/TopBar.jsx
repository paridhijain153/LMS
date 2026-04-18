import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import "@/styles/layout/topbar.css";

function getInitials(name) {
  if (!name) {
    return "GU";
  }

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export const TopBar = ({
  title,
  subtitle,
  showSearch = true,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search courses...",
}) => {
  const { user } = useAuth();

  return (<div className="topbar">
      <div className="topbar__inner container">
        <div>
          <h1 className="topbar__title">{title}</h1>
          {subtitle && <p className="topbar__subtitle">{subtitle}</p>}
        </div>
        <div className="topbar__actions">
          {showSearch && (<div className="topbar__search">
              <Search className="topbar__search-icon"/>
              {onSearchChange ? (<Input value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder={searchPlaceholder} className="topbar__search-input form-input--icon-left"/>) : (<Input placeholder={searchPlaceholder} className="topbar__search-input form-input--icon-left"/>)}
            </div>)}
          <div className="topbar__bell">
            <Button variant="ghost" size="icon">
              <Bell />
            </Button>
            <span className="topbar__bell-dot"/>
          </div>
          <div className="topbar__user">
            <Avatar className="avatar--ring">
              <AvatarFallback className="avatar__fallback--gradient">{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <div className="topbar__user-meta">
              <p className="topbar__user-name">{user?.name ?? "Guest User"}</p>
              <p className="topbar__user-role">{user?.role ?? "visitor"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
