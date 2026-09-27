
import React, { useEffect } from "react";
import { useParams, Outlet, NavLink, Link, useLoaderData } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  UserCheck,
  Bot,
  X,
  ArrowLeft,
} from "lucide-react";
import useProjectContext from "../../context/ProjectContext";

function WorkspaceLayout() {
  const { projectId } = useParams();
  const loaderData = useLoaderData();
  const currentProject = loaderData?.data || loaderData;

  const { selectedProject, setSelectedProject, isWorkSpaceSidebarOpen, setIsWorkSpaceSidebarOpen } = useProjectContext();

  // Sync selected project object into context
  useEffect(() => {
    if (currentProject) {
      setSelectedProject(currentProject);
    }
  }, [currentProject, setSelectedProject]);

  const activeProject = currentProject || selectedProject;

  const navItems = [
    {
      name: "Overview",
      path: `/workspace/${projectId}`,
      icon: <LayoutDashboard className="w-4 h-4" />, 
      exact: true,
    },
    {
      name: "All Tasks",
      path: `/workspace/${projectId}/tasks`,
      icon: <CheckSquare className="w-4 h-4" />, 
    },
    {
      name: "Assigned to Me",
      path: `/workspace/${projectId}/my-tasks`,
      icon: <UserCheck className="w-4 h-4" />, 
    },
    {
      name: "AI Assistant",
      path: `/workspace/${projectId}/chatbot`,
      icon: <Bot className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-page flex flex-col lg:flex-row relative">
      {/* Mobile Drawer Backdrop */}
      {isWorkSpaceSidebarOpen && (
        <div
          onClick={() => setIsWorkSpaceSidebarOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      {/* Workspace Left Sidebar - starts from top-0 spanning full screen */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-card border-r border-cardBorder transition-transform duration-300 ease-in-out flex flex-col justify-between shrink-0 ${
          isWorkSpaceSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header & Back Link */}
          <div className="p-5 border-b border-cardBorder flex items-center justify-between">
            <div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primaryHover mb-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Dashboard
              </Link>
              <h2 className="text-sm font-black text-title truncate">
                {activeProject?.name || "Project Workspace"}
              </h2>
            </div>

            <button
              onClick={() => setIsWorkSpaceSidebarOpen(false)}
              className="lg:hidden text-muted hover:text-title p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            <p className="px-3 text-[10px] uppercase font-bold tracking-widest text-muted mb-3">
              Project Context
            </p>
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                onClick={() => setIsWorkSpaceSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-muted hover:text-title hover:bg-inputBg"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Project Status Footer Badge */}
          {activeProject && (
            <div className="p-4 border-t border-cardBorder">
              <div className="p-3 rounded-xl bg-inputBg border border-inputBorder text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Status:</span>
                  <span className="font-bold text-title uppercase text-[10px] px-2 py-0.5 rounded bg-card border border-cardBorder">
                    {activeProject.status || "ACTIVE"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Priority:</span>
                  <span className="font-bold text-secondary uppercase text-[10px]">
                    {activeProject.priority || "NORMAL"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area - Pushed right on desktop to accommodate the 64px (w-64) sidebar */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 max-w-7xl w-full overflow-x-hidden">
        <Outlet context={{ project: activeProject, projectData: activeProject }} />
      </main>
    </div>
  );
}

export default WorkspaceLayout;