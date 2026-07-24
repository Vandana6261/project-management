import React from "react";

function QuickActions({ onOpenCreateModal }) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-cardBorder shadow-sm">
      <h3 className="text-base font-extrabold text-title mb-4">Quick Operations</h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onOpenCreateModal}
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-cardBorder bg-inputBg hover:bg-primary/10 hover:border-primary/40 text-title transition-all group cursor-pointer"
        >
          <span className="text-xl mb-1 text-primary group-hover:scale-110 transition-transform">+</span>
          <span className="text-xs font-bold uppercase tracking-wider">New Project</span>
        </button>

        <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-cardBorder bg-inputBg hover:bg-secondary/10 hover:border-secondary/40 text-title transition-all group cursor-pointer">
          <span className="text-xl mb-1 text-secondary group-hover:scale-110 transition-transform">⚡</span>
          <span className="text-xs font-bold uppercase tracking-wider">Start Sprint</span>
        </button>
      </div>
    </div>
  );
}

export default QuickActions;