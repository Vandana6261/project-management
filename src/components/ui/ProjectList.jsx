import React from "react";

function ProjectList() {
  const projects = [
    {
      id: 1,
      name: "Pulse Engine Architecture",
      key: "PEA-102",
      status: "In Progress",
      progress: 68,
      lead: "Alex R.",
    },
    {
      id: 2,
      name: "Mobile API Integration",
      key: "MAI-409",
      status: "Testing",
      progress: 85,
      lead: "Sarah K.",
    },
    {
      id: 3,
      name: "Design System Refactor",
      key: "DSR-012",
      status: "Backlog",
      progress: 20,
      lead: "David M.",
    },
  ];

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
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 rounded-xl bg-inputBg border border-inputBorder hover:border-cardBorder transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-secondary">
                    {project.key}
                  </span>
                  <h4 className="text-sm font-bold text-title">{project.name}</h4>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-cardBorder bg-card text-title">
                  {project.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-card rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>

              <div className="flex justify-between items-center mt-2 text-[11px] text-muted">
                <span>Lead: {project.lead}</span>
                <span>{project.progress}% completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectList;