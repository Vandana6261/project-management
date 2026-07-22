// src/layouts/AppLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AppNavbar from "../../assets/AppNavbar";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isThemeLight, setIsThemeLight] = useState(
    () => document.documentElement.classList.contains("light")
  );

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("light")) {
      html.classList.remove("light");
      setIsThemeLight(false);
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.add("light");
      setIsThemeLight(true);
      localStorage.setItem("theme", "light");
    }
  };

  const location = useLocation();
  const isDashboardHome = location.pathname === "/dashboard";

  return (
  <div className="min-h-screen bg-page text-body transition-colors duration-300">

    {/* Show Sidebar only when NOT on /dashboard */}
    {!isDashboardHome && (
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
    )}

    {/* Main Workspace */}
    <div
      className={`flex flex-col min-h-screen ${
        !isDashboardHome ? "lg:ml-64" : ""
      }`}
    >
      <AppNavbar
        onMenuClick={() => setIsSidebarOpen(true)}
        toggleTheme={toggleTheme}
        isThemeLight={isThemeLight}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  </div>
);
}


export default AppLayout;