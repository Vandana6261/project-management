import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuthContext from "../context/AuthContext";

function Navbar() {
  const { user } = useAuthContext();
  // Initialize state based on what's currently active on the html element
  const [isThemeLight, setIsThemeLight] = useState(
    () => document.documentElement.classList.contains("light"), // return true or false
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    // Check system preference if no local storage exists
    const systemPrefersLight = window.matchMedia(
      "(prefers-color-scheme: light)",
    ).matches; // return true or false

    const shouldBeLight =
      savedTheme === "light" || (!savedTheme && systemPrefersLight);

    if (shouldBeLight) {
      document.documentElement.classList.add("light");
      setIsThemeLight(true);
    } else {
      document.documentElement.classList.remove("light");
      setIsThemeLight(false);
    }
  }, []);

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cardBorder bg-page/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Brand Accent */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary p-[2px] transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-card text-title font-extrabold text-sm">
                P
              </div>
            </div>
            <span className="text-base font-bold tracking-wider text-title uppercase">
              Pulse<span className="text-primary font-black">.</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-xs uppercase font-bold tracking-widest transition-colors ${
                  isActive ? "text-primary" : "text-muted hover:text-title"
                }`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="/features"
              className={({ isActive }) =>
                `text-xs uppercase font-bold tracking-widest transition-colors ${
                  isActive ? "text-primary" : "text-muted hover:text-title"
                }`
              }
            >
              Features
            </NavLink>
            <NavLink
              to="/workspace"
              className={({ isActive }) =>
                `text-xs uppercase font-bold tracking-widest transition-colors ${
                  isActive ? "text-primary" : "text-muted hover:text-title"
                }`
              }
            >
              Workspace
            </NavLink>

            {user && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `text-xs uppercase font-bold tracking-widest transition-colors ${
                    isActive ? "text-primary" : "text-muted hover:text-title"
                  }`
                }
              >
                Dashboard
              </NavLink>
            )}
          </div>

          {/* Actions & Theme Toggler */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-cardBorder bg-card/60 hover:bg-card text-title transition-all cursor-pointer"
              title="Toggle Theme Mode"
            >
              {isThemeLight ? (
                // Dark Mode Icon (Shows when theme is light, clicking sets it to dark)
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                // Light Mode Icon
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                  />
                </svg>
              )}
            </button>

            {/* Premium CTA Link */}
            <Link
              to="/auth"
              className="hidden sm:inline-block rounded-xl bg-primary hover:bg-primaryHover text-xs uppercase font-extrabold tracking-widest text-white py-2.5 px-5 shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all duration-200 active:scale-[0.98]"
            >
              Get Started
            </Link>

            <div>
              <span className="text-primary">{user ? user : "Login"}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
