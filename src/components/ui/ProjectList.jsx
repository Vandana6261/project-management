// src/components/ui/ProjectList.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, UserPlus, FolderKanban } from "lucide-react";
import AddMemberModal from "./AddMemberModal";

function ProjectList({ projects = [] }) {
  const [selectedProjectForMember, setSelectedProjectForMember] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="p-6 rounded-2xl bg-card border border-cardBorder shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-title">Active Projects</h3>
            <span className="text-xs font-bold text-muted">{projects.length} Total</span>
          </div>

          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-cardBorder rounded-xl">
                <FolderKanban className="w-8 h-8 text-muted mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-title">No Projects Found</p>
                <p className="text-xs text-muted mt-1">
                  You are not assigned to any projects yet. Create one to get started.
                </p>
              </div>
            ) : (
              projects.map((item) => {
                const { id: memberId, role, project } = item;
                const targetProject = project || item;
                const { id: projectId, name, description, status, priority, dueDate } = targetProject;

                // Check if user has permission to manage members
                const normalizedRole = (role || "").toLowerCase();
                const canAddMember = normalizedRole === "owner" || normalizedRole === "admin";

                return (
                  <div
                    key={memberId || projectId}
                    className="p-4 rounded-xl bg-inputBg border border-inputBorder hover:border-cardBorder transition-all flex flex-col justify-between gap-3"
                  >
                    {/* Header: Title & Status */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        {role && (
                          <span className="text-[10px] font-mono uppercase font-bold text-secondary tracking-wider block mb-0.5">
                            Role: {role}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-title">{name}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Show "Add Member" button if user is Owner/Admin */}
                        {canAddMember && (
                          <button
                            onClick={() => setSelectedProjectForMember(targetProject)}
                            className="flex items-center gap-1 text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all cursor-pointer"
                            title="Add Member to Project"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>Add Member</span>
                          </button>
                        )}

                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-cardBorder bg-card text-title shrink-0">
                          {status || "Active"}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {description && (
                      <p className="text-xs text-muted line-clamp-2">
                        {description}
                      </p>
                    )}

                    {/* Metadata & Open Individual Workspace Link */}
                    <div className="flex justify-between items-center pt-2 border-t border-cardBorder/50 text-[11px] text-muted">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-muted" />
                          Due: {formatDate(dueDate)}
                        </span>
                        {priority && (
                          <span className="uppercase font-semibold text-[10px] px-1.5 py-0.2 rounded bg-card">
                            {priority}
                          </span>
                        )}
                      </div>

                      <Link
                        // to={`/projects/${projectId}`}
                        to={'/workspace'}
                        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primaryHover transition-colors cursor-pointer"
                      >
                        <span>Open Project</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Add Member Modal Target */}
      {selectedProjectForMember && (
        <AddMemberModal
          project={selectedProjectForMember}
          onClose={() => setSelectedProjectForMember(null)}
        />
      )}
    </>
  );
}

export default ProjectList;