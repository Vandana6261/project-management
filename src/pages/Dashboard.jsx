import React, { useEffect, useState } from "react";
import StatsOverview from "../components/StatsOverview";
import ProjectList from "../components/ProjectList";
import RecentActivity from "../components/RecentActivity";
import MyTasks from "../components/MyTasks";
import QuickActions from "../components/QuickActions";
import ProjectForm from "../components/ProjectForm";
import useProjectContext from "../context/ProjectContext";

function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { projects, loading, hasFetched, fetchProjects, tasks, fetchAssignedTasks } = useProjectContext();
  // const projects = []

  useEffect(() => {
    fetchProjects(); // Will only execute an API call if projects haven't been fetched yet
    fetchAssignedTasks();
  }, [fetchProjects, fetchAssignedTasks]);

  return (
    <div className="min-h-screen bg-page text-body p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-title tracking-tight">
            Engine Workspace Dashboard
          </h1>
          <p className="text-xs text-muted mt-1">
            Overview of real-time velocity, active sprints, and task distributions.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-xl bg-primary hover:bg-primaryHover text-xs font-extrabold uppercase tracking-widest text-white py-3 px-5 shadow-lg shadow-primary/15 transition-all duration-200 cursor-pointer"
        >
          + Create Project
        </button>
      </div>

      {/* Metric Stats */}
      <StatsOverview projects={projects} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {!hasFetched && projects.length === 0 ? (
            <div className="p-10 text-center text-xs text-muted border border-dashed border-cardBorder rounded-2xl bg-card">
              Loading projects...
            </div>
          ) : (
            <ProjectList projects={projects} />
          )}
          <MyTasks tasks={tasks} />
        </div>

        <div className="space-y-8">
          <QuickActions onOpenCreateModal={() => setShowCreateModal(true)} />
          <RecentActivity />
        </div>
      </div>

      {/* Modal Container for Project Form */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 z-10 text-muted hover:text-title text-sm font-bold p-2 cursor-pointer"
            >
              ✕
            </button>
            <ProjectForm onSuccess={() => setShowCreateModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;