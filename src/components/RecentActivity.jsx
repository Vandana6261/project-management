import React from "react";

function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: "Sarah K.",
      action: "commented on",
      target: "PEA-102: Setup OAuth Context",
      time: "10m ago",
    },
    {
      id: 2,
      user: "Alex R.",
      action: "moved issue to",
      target: "In Review",
      time: "45m ago",
    },
    {
      id: 3,
      user: "System Engine",
      action: "deployed build",
      target: "v1.0.4-beta",
      time: "2h ago",
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-card border border-cardBorder shadow-sm">
      <h3 className="text-base font-extrabold text-title mb-4">Activity Stream</h3>
      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start gap-3 text-xs">
            <div className="h-7 w-7 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px] shrink-0">
              {item.user.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-body leading-tight">
                <span className="font-bold text-title">{item.user}</span> {item.action}{" "}
                <span className="font-semibold text-primary">{item.target}</span>
              </p>
              <span className="text-[10px] text-muted block mt-0.5">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;