import React from "react";

function AppLoader() {
  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <div className="absolute h-10 w-10 animate-spin rounded-full border-2 border-t-[var(--color-primary)] border-r-transparent border-b-transparent border-l-transparent"></div>
          <div className="absolute h-8 w-8 animate-[spin_1.5s_linear_infinite] rounded-full border-2 border-b-[var(--color-secondary)] border-t-transparent border-r-transparent border-l-transparent"></div>
          <div className="absolute h-6 w-6 animate-[spin_0.8s_linear_infinite_reverse] rounded-full border-2 border-l-[var(--color-primary)] border-t-transparent border-r-transparent border-b-transparent"></div>
        </div>
      </div>
    </>
  );
}

export default AppLoader;
