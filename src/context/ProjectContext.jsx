import React, { createContext, useState, useContext, useCallback } from "react";
import { cusApi } from "../services/customFetch";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // Cache flag
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectLoading, setProjectLoading] = useState(false);

  const [isWorkSpaceSidebarOpen, setIsWorkSpaceSidebarOpen] = useState(false);


  // Memoized fetch function so it can be safely used in useEffects
  const fetchProjects = useCallback(async (forceRefresh = false) => {
    // Avoid re-fetching if data is already fetched (unless explicitly forced)
    if (hasFetched && !forceRefresh) return;

    setLoading(true);
    try {
      const response = await cusApi.get("project/get-project");
      const data = await response.json();
      setProjects(data.project || []);
      setHasFetched(true);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  }, [hasFetched]);

  // Helper to add or invalidate projects after creating a new one
  const refreshProjects = () => fetchProjects(true);

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


  const fetchAssignedTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await cusApi.get("project/task/assigned-task");
      const result = await response.json();
      setTasks(result.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  }, []);


  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        fetchProjects,
        refreshProjects,
        tasks,
        fetchAssignedTasks,
        selectedProject,
        setSelectedProject,
        selectedProjectId,
        setSelectedProjectId: handleSetSelectedProjectId,
        projectLoading,
        isWorkSpaceSidebarOpen,
        setIsWorkSpaceSidebarOpen

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