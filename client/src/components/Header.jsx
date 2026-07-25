import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Moon, Sun, Menu, Bell, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export const Header = ({ toggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [usernameInitials, setUsernameInitials] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateUserStatus = () => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        const username = parsed.username || parsed.name || "";
        if (username) {
          const initials = username
            .split(" ")
            .map((word) => word[0]?.toUpperCase())
            .join("")
            .slice(0, 2);
          setUsernameInitials(initials || "US");
          setIsLoggedIn(true);
          return;
        }
      } catch {
        console.warn("Failed to parse user from localStorage.");
      }
    }
    setIsLoggedIn(false);
    setUsernameInitials(null);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    updateUserStatus();

    window.addEventListener("userStatusChanged", updateUserStatus);
    return () => window.removeEventListener("userStatusChanged", updateUserStatus);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cfHandle");
    localStorage.removeItem("lcHandle");
    window.dispatchEvent(new Event("userStatusChanged"));
  };

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-[#f8d250]/15 bg-[#111218]/95 px-4 backdrop-blur lg:px-6">
      <div className="flex flex-1 items-center gap-3">
        {toggleSidebar && (
          <button className="rounded-2xl border border-[#f8d250]/15 bg-[#171a22] p-2 text-[#f8d250] sm:hidden" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a8a8b3]" />
          <Input
            type="search"
            placeholder="Search problems, contests..."
            className="h-10 w-full rounded-2xl border border-[#f8d250]/15 bg-[#171a22] pl-9 text-sm text-white shadow-[0_0_0_1px_rgba(248,210,80,0.05)] placeholder:text-[#a8a8b3] focus-visible:border-[#f8d250] focus-visible:ring-2 focus-visible:ring-[#f8d250]/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          onClick={toggleDarkMode}
          size="sm"
          className="rounded-2xl border border-[#f8d250]/15 bg-[#171a22] text-[#f8d250] hover:bg-[#23242e]"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button size="sm" className="rounded-2xl border border-[#f8d250]/15 bg-[#171a22] text-white hover:bg-[#23242e]">
          <Bell className="mr-2 h-4 w-4 text-[#f8d250]" />
          Alerts
        </Button>

        {isLoggedIn ? (
          <div className="flex items-center gap-2 rounded-2xl border border-[#f8d250]/15 bg-[#171a22] px-2 py-1.5">
            <div className="relative">
              <Avatar className="h-9 w-9 border border-[#f8d250]/20">
                <AvatarImage src="" alt="User Avatar" />
                <AvatarFallback className="bg-[#f8d250]/15 text-[#f8d250]">{usernameInitials}</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#111218] bg-[#22c55e]" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-white">{usernameInitials || "User"}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#a8a8b3]">Online</p>
            </div>
            <Button size="sm" onClick={handleLogout} className="ml-1 rounded-2xl bg-[#f8d250] px-3 text-[#0f0f14] hover:bg-[#ffe38b]">
              Logout
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button size="sm" className="rounded-2xl bg-[#f8d250] px-3 text-[#0f0f14] hover:bg-[#ffe38b]">
              <Crown className="mr-2 h-4 w-4" />
              Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
