import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppNavbar from "../../components/AppNavbar";
import WorkspaceLayout from "./WorkspaceLayout";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page text-body transition-colors duration-300 flex flex-col">
      <AppNavbar />

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;