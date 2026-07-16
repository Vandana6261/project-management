import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="relative overflow-hidden">
      
      {/* Ambient background blur elements for modern glow */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center">
        
        {/* Release Pill Accent */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-card border border-cardBorder py-1 px-3.5 text-[10px] font-bold uppercase tracking-widest text-primary mb-6 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Pulse Engine v1.0 Active
        </span>

        {/* Headings */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-title sm:text-5xl lg:text-6xl leading-[1.15]">
          Manage Projects with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Absolute Velocity</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-muted">
          A high-performance workspace designed to streamline workflows, sync team velocity, and centralize documentation. Experience clean architecture for builders.
        </p>

        {/* Dynamic Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/auth"
            className="rounded-xl bg-primary py-3 px-8 text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-primary/15 hover:bg-primaryHover hover:shadow-primary/25 active:scale-[0.98] transition-all duration-200"
          >
            Create Workspace
          </Link>
          <a
            href="#features"
            className="rounded-xl border border-cardBorder bg-card/40 hover:bg-card py-3 px-8 text-xs font-bold uppercase tracking-widest text-title transition-all duration-200"
          >
            See Showcase
          </a>
        </div>

      </section>

      {/* Feature Panel Grid Container */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Card 1 */}
          <div className="group rounded-2xl border border-cardBorder bg-card/30 p-6 backdrop-blur-xl hover:border-primary/30 transition-all duration-300">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-sm uppercase font-bold tracking-wider text-title mb-2">Real-time Velocity</h3>
            <p className="text-xs leading-relaxed text-muted">
              Instantly track active sprints, bottleneck blockers, and project milestones using live synced WebSockets.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-2xl border border-cardBorder bg-card/30 p-6 backdrop-blur-xl hover:border-secondary/30 transition-all duration-300">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-transform group-hover:scale-105">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-sm uppercase font-bold tracking-wider text-title mb-2">Workspace Boards</h3>
            <p className="text-xs leading-relaxed text-muted">
              Organize complex backlogs with ultra-responsive drag-and-drop Kanban arrays and timeline systems.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-2xl border border-cardBorder bg-card/30 p-6 backdrop-blur-xl hover:border-primary/30 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-sm uppercase font-bold tracking-wider text-title mb-2">Granular Security</h3>
            <p className="text-xs leading-relaxed text-muted">
              Protect your organizational resources with industry-standard data encryption and role-based access.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Home;