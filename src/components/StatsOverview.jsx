import React from "react";

function StatsOverview() {
  const stats = [
    { title: "Active Projects", value: "8", change: "+2 this week", accent: "text-primary" },
    { title: "Pending Tasks", value: "34", change: "12 high priority", accent: "text-secondary" },
    { title: "Completed Sprints", value: "19", change: "94% velocity rate", accent: "text-primary" },
    { title: "Team Members", value: "14", change: "3 teams online", accent: "text-muted" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl bg-card border border-cardBorder backdrop-blur-md shadow-sm hover:border-primary/40 transition-all duration-200"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
            {stat.title}
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className={`text-3xl font-extrabold ${stat.accent}`}>{stat.value}</h3>
            <span className="text-[11px] font-medium text-muted">{stat.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsOverview;