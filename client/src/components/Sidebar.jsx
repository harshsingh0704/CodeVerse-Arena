import { useState } from "react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import {
  Calendar,
  Code,
  Award,
  User,
  Terminal,
  Bot,
  Brain,
  ChevronLeft,
  ChevronRight,
  Users,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: Calendar, label: "Contests", href: "/contests" },
  { icon: Code, label: "Practice", href: "/practice" },
  { icon: Terminal, label: "Code Editor", href: "/questions" },
  { icon: Award, label: "Leaderboard", href: "/leaderboard" },
  { icon: Bot, label: "Internship Tracker", href: "/intern" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Brain, label: "Learn", href: "/learn" },
  { icon: Users, label: "Peer Rooms", href: "/room" },
];

const NavItem = ({ icon: Icon, label, href, isCollapsed, closeSidebar }) => (
  <NavLink
    to={href}
    onClick={() => {
      if (closeSidebar) closeSidebar();
    }}
    className={({ isActive }) =>
      cn(
        "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
        isActive
          ? "bg-[#f8d250]/12 text-white shadow-[0_0_20px_rgba(248,210,80,0.12)]"
          : "text-[#a8a8b3] hover:bg-[#23242e] hover:text-white"
      )
    }
  >
    {({ isActive }) => (
      <>
        <span
          className={cn(
            "absolute left-0 top-2 bottom-2 w-1 rounded-full transition-all",
            isActive ? "bg-[#f8d250]" : "bg-transparent"
          )}
        />
        <div className={cn("flex h-5 w-5 items-center justify-center", isActive && "text-[#f8d250]")}>
          <Icon className="h-4 w-4" />
        </div>
        {!isCollapsed && <span>{label}</span>}
      </>
    )}
  </NavLink>
);

export const Sidebar = ({ isMobileOpen = false, closeSidebar = () => {} }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "fixed sm:static z-40 h-screen overflow-y-auto border-r border-[#f8d250]/15 bg-[#111218] transition-all duration-300 ease-in-out",
        "flex flex-col",
        isCollapsed ? "w-16" : "w-64",
        isMobileOpen ? "left-0" : "left-[-100%] sm:left-0"
      )}
    >
      <div className="sm:hidden flex justify-end p-3">
        <Button variant="ghost" size="icon" onClick={closeSidebar} className="text-white">
          <X />
        </Button>
      </div>

      <a href="/" className="flex h-16 items-center gap-3 border-b border-[#f8d250]/15 px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#f8d250]/20 bg-[#f8d250]/10 text-[#f8d250] gold-ring">
          <Sparkles className="h-5 w-5" />
        </div>
        {!isCollapsed && <div>
          <h2 className="text-base font-semibold text-white">CodeVerse</h2>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#a8a8b3]">Elite Arena</p>
        </div>}
      </a>

      <div className="flex flex-1 flex-col gap-1 p-2">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isCollapsed={isCollapsed}
            closeSidebar={closeSidebar}
          />
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="m-2 hidden sm:block mt-auto ml-auto rounded-2xl border border-[#f8d250]/15 bg-[#171a22] text-[#f8d250]"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default Sidebar;
