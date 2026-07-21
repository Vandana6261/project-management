import React from "react";

function MyTasks() {
  const tasks = [
    { id: 1, title: "Fix CSS variable color bleed on themes", priority: "High", tag: "Bug" },
    { id: 2, title: "Refactor AuthContext logic with token refresh", priority: "Medium", tag: "Feature" },
    { id: 3, title: "Add Project Creation Endpoint validation", priority: "Low", tag: "Backend" },
  ];

  return (
    <div className="p-6 rounded-2xl bg-card border border-cardBorder shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-extrabold text-title">Assigned to Me</h3>
        <span className="text-xs text-muted font-bold">{tasks.length} pending</span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 rounded-xl bg-inputBg border border-inputBorder hover:border-secondary/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary cursor-pointer rounded"
              />
              <span className="text-xs font-medium text-title">{task.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded bg-card text-muted border border-cardBorder">
                {task.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTasks;