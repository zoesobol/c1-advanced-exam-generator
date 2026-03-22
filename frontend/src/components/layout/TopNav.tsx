import { LogOut, Plus, LayoutDashboard, FileText } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/exams/new", label: "New Exam", icon: Plus },
];

export function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <div className="rounded-2xl border border-border bg-card p-2">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                C1 Advanced Exam Generator
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email ?? "Practice workspace"}
              </p>
            </div>
          </NavLink>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card hover:bg-accent",
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 text-sm transition hover:bg-accent"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>

      <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3 md:hidden sm:px-6 lg:px-8">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "inline-flex shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card hover:bg-accent",
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
