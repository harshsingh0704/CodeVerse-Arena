import React, { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f14] text-white">
      <Sidebar
        isMobileOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_left,_rgba(248,210,80,0.08),_transparent_32%),linear-gradient(180deg,_#0f0f14_0%,_#12131b_100%)] p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
