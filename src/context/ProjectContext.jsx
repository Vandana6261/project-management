import React, { createContext, useState, useContext, useCallback } from "react";
import { cusApi } from "../utils/customFetch";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // Cache flag
  const [tasks, setTasks] = useState([]);


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
        fetchAssignedTasks
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