import React, { useState } from "react";

function MyTasks({ tasks = [] }) {
  // Track which task IDs or indices are currently expanded
  const [expandedTasks, setExpandedTasks] = useState({});

  const toggleExpand = (index) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="p-6 rounded-2xl bg-card border border-cardBorder shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-extrabold text-title">Assigned to Me</h3>
        <span className="text-xs text-muted font-bold">{tasks.length} pending</span>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-xs text-muted text-center py-4">No tasks found</p>
        ) : (
          tasks.map((item, index) => {
            // Handles both structures: direct task object OR wrapped inside { task: { ... } }
            const task = item.task || item;
            const isExpanded = !!expandedTasks[index];

            return (
              <div
                key={index}
                className="flex flex-col p-3 rounded-xl bg-inputBg border border-inputBorder hover:border-secondary/40 transition-colors gap-2"
              >
                {/* Main Row / Brief Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-title">{task.title}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded bg-card text-muted border border-cardBorder">
                      {task.priority}
                    </span>
                    <button
                      onClick={() => toggleExpand(index)}
                      className="text-xs font-bold text-primary hover:text-primaryHover px-2 py-1 cursor-pointer transition-colors"
                    >
                      {isExpanded ? "Less" : "More"}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-inputBorder text-[11px] text-body space-y-1.5 animate-fadeIn">
                    <p><strong className="text-title">Description:</strong> {task.description}</p>
                    <p><strong className="text-title">Project:</strong> {task.project?.name}</p>
                    <p><strong className="text-title">Status:</strong> {task.status}</p>
                    <div className="flex justify-between text-[10px] text-muted pt-1">
                      <span>Start: {new Date(task.startDate).toLocaleDateString()}</span>
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyTasks;