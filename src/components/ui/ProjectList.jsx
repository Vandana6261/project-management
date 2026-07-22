import React from "react";
// Swapped lucide-react with react-icons (FontAwesome)
import { FaArrowRight, FaCalendarAlt } from "react-icons/fa";

function ProjectList({ projects = [] }) {
  // Helper function to format ISO date strings
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  console.log(projects)

  return (
    <div className="p-6 rounded-2xl bg-card border border-cardBorder shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-title">Active Projects</h3>
          <button className="text-xs uppercase font-bold text-primary hover:text-primaryHover cursor-pointer">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {projects.length === 0 ? (
            <p className="text-sm text-muted py-4 text-center">No projects found.</p>
          ) : (
            projects.map((item) => {
              // Extract nested project data and user relationship info
              const { id: memberId, role, project } = item;
              const { id: projectId, name, description, status, priority, dueDate } = project;

              return (
                <div
                  key={memberId || projectId}
                  className="p-4 rounded-xl bg-inputBg border border-inputBorder hover:border-cardBorder transition-all flex flex-col justify-between gap-3"
                >
                  {/* Header: Title & Status */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-secondary tracking-wider">
                        Role: {role}
                      </span>
                      <h4 className="text-sm font-bold text-title">{name}</h4>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-cardBorder bg-card text-title">
                      {status}
                    </span>
                  </div>

                  {/* Description */}
                  {description && (
                    <p className="text-xs text-muted line-clamp-2">
                      {description}
                    </p>
                  )}

                  {/* Metadata & Navigation Action */}
                  <div className="flex justify-between items-center pt-2 border-t border-cardBorder/50 text-[11px] text-muted">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        <FaCalendarAlt size={11} className="text-muted" />
                        Due: {formatDate(dueDate)}
                      </span>
                      <span className="uppercase font-semibold text-[10px] px-1.5 py-0.2 rounded bg-card">
                        {priority}
                      </span>
                    </div>

                    {/* Navigation Button to Individual Project Dashboard */}
                    <a
                      href={`/projects/${projectId}`} // Replace with <Link to={`/projects/${projectId}`}> if using react-router-dom
                      className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primaryHover transition-colors cursor-pointer"
                    >
                      Open Project
                      <FaArrowRight size={11} />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectList;