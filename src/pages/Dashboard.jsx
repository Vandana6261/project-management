import React, { useEffect, useState } from "react";
import StatsOverview from "../components/ui/StatsOverview";
import ProjectList from "../components/ui/ProjectList";
import RecentActivity from "../components/ui/RecentActivity";
import MyTasks from "../components/ui/MyTasks";
import QuickActions from "../components/ui/QuickActions";
import ProjectForm from "../components/ProjectForm";
import { cusApi } from "../utils/customFetch";
import { BASE_URL } from "../config";

function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projects, setProjects] = useState();

  useEffect(() => {
    async function getProject() {
      try {
        const response = await cusApi.get('project/get-project')
        const data = await response.json();
        console.log(data);
        setProjects(data.project);
      } catch (error) {
        console.log(error);
      }
    }
    getProject();
  }, []);

  return (
    <div className="min-h-screen bg-page text-body p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-title tracking-tight">
            Engine Workspace Dashboard
          </h1>
          <p className="text-xs text-muted mt-1">
            Overview of real-time velocity, active sprints, and task
            distributions.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-xl bg-primary hover:bg-primaryHover text-xs font-extrabold uppercase tracking-widest text-white py-3 px-5 shadow-lg shadow-primary/15 transition-all duration-200 cursor-pointer"
        >
          + Create Project
        </button>
      </div>

      {/* Top Row: Metric Stats */}
      <StatsOverview />

      {/* Main Grid: 2 Columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Span (2 Columns) */}
        <div className="lg:col-span-2 space-y-8">
          <ProjectList projects={projects} />
          <MyTasks />
        </div>

        {/* Right Span (1 Column Sidebar) */}
        <div className="space-y-8">
          <QuickActions onOpenCreateModal={() => setShowCreateModal(true)} />
          <RecentActivity />
        </div>
      </div>

      {/* Modal Container for Project Form */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl">
            {/* Close Button */}
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 z-10 text-muted hover:text-title text-sm font-bold p-2 cursor-pointer"
            >
              ✕
            </button>
            <ProjectForm />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
