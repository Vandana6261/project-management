import React, { createContext, useState, useContext, useCallback, useRef } from "react";
import { cusApi } from "../services/customFetch";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // Cache flag for UI
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectLoading, setProjectLoading] = useState(false);

  const [isWorkSpaceSidebarOpen, setIsWorkSpaceSidebarOpen] = useState(false);

  // Synchronous cache flags that persist across re-renders
  const hasFetchedProjectsRef = useRef(false);
  const hasFetchedTasksRef = useRef(false);

  // Memoized fetch function so it can be safely used in useEffects
  const fetchProjects = useCallback(async (forceRefresh = false) => {
    // Avoid re-fetching if data is already fetched (unless explicitly forced)
    if (hasFetchedProjectsRef.current && !forceRefresh) return;

    setLoading(true);
    try {
      const response = await cusApi.get("project/get-project");
      const data = await response.json();
      setProjects(data.project || []);
      hasFetchedProjectsRef.current = true;
      setHasFetched(true);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper to add or invalidate projects after creating a new one
  const refreshProjects = useCallback(() => {
    hasFetchedProjectsRef.current = false;
    return fetchProjects(true);
  }, [fetchProjects]);

  // Fetch single project details by ID (used when landing directly on a route)
  const fetchProjectById = useCallback(async (id) => {
    if (!id) return;
    setProjectLoading(true);
    try {
      const response = await cusApi.get(`project/${id}`);
      const result = await response.json();
      if (result.success) {
        setSelectedProject(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch project details:", error);
    } finally {
      setProjectLoading(false);
    }
  }, []);

  // Set selected project ID and sync selected project object
  const handleSetSelectedProjectId = useCallback((id) => {
    setSelectedProjectId(id);
    
    // Check if we already have it in state list
    const found = projects.find(
      (item) => (item.project?.id || item.id) === id
    );

    if (found) {
      setSelectedProject(found.project || found);
    } else {
      // If refreshed directly via URL, fetch from API
      fetchProjectById(id);
    }
  }, [projects, fetchProjectById]);

  const fetchAssignedTasks = useCallback(async (forceRefresh = false) => {
    // Avoid re-fetching assigned tasks if already fetched
    if (hasFetchedTasksRef.current && !forceRefresh) return;

    setTasksLoading(true);
    try {
      const response = await cusApi.get("project/task/assigned-task");
      const result = await response.json();
      setTasks(result.data || []);
      hasFetchedTasksRef.current = true;
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setTasksLoading(false);
    }
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        hasFetched,
        tasks,
        tasksLoading,
        fetchProjects,
        refreshProjects,
        fetchAssignedTasks,
        selectedProject,
        setSelectedProject,
        selectedProjectId,
        setSelectedProjectId: handleSetSelectedProjectId,
        projectLoading,
        isWorkSpaceSidebarOpen,
        setIsWorkSpaceSidebarOpen,
        fetchProjectById
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
}