// src/components/AppNavbar.jsx
import React from "react";
import useAuthContext from "../context/AuthContext";

function AppNavbar({ onMenuClick, toggleTheme, isThemeLight }) {
  const { user } = useAuthContext();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-cardBorder bg-page/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl border border-cardBorder bg-card text-title hover:bg-inputBg transition-colors"
          aria-label="Open Sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-xs uppercase font-extrabold tracking-widest text-muted hidden sm:inline-block">
          Workspace / Control Panel
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-cardBorder bg-card hover:bg-inputBg text-title transition-all cursor-pointer"
          title="Toggle Theme Mode"
        >
          {isThemeLight ? (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          )}
        </button>

        {/* User Pill */}
        <div className="px-3 py-1.5 rounded-xl border border-cardBorder bg-card text-xs font-bold text-title">
          {user ? user : "Guest"}
        </div>
      </div>
    </header>
  );
}

export default AppNavbar;