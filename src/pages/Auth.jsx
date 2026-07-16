import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";


const switcherBtnBase = "w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer";
const switcherBtnActive = "bg-primary text-white shadow-md shadow-primary/25";
const switcherBtnInactive = "bg-transparent text-muted hover:text-title";

function Auth() {
  const [active, setActive] = useState("signIn");

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-12 sm:px-6 lg:px-8 w-full select-none transition-colors duration-300">
      
      {/* Container Card utilizing semantic tokens and a dynamic, theme-safe shadow */}
      <div className="p-8 rounded-2xl bg-card backdrop-blur-2xl border border-cardBorder w-full max-w-md shadow-xl shadow-title/5 flex flex-col gap-6 transition-all">
        
        {/* Modern Pill Switcher Header Container */}
        <div className="bg-page/50 p-1 rounded-xl flex items-center border border-cardBorder">
          <button 
            type="button"
            className={`${switcherBtnBase} ${active === "signIn" ? switcherBtnActive : switcherBtnInactive}`}
            onClick={() => setActive("signIn")}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`${switcherBtnBase} ${active === "signUp" ? switcherBtnActive : switcherBtnInactive}`}
            onClick={() => setActive("signUp")}
          >
            Sign Up
          </button>
        </div>

        {/* Dynamic Header Titles using semantic text colors */}
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-title transition-all">
            {active === "signUp" ? "Create your account" : "Welcome Back"}
          </h2>
          <p className="mt-1.5 text-xs text-muted">
            {active === "signUp" 
              ? "Join us today! Please enter your details." 
              : "Enter your credentials to access your account."}
          </p>
        </div>

        {/* Render Active Form Module */}
        <div className="mt-2">
          {active === "signIn" ? <Login /> : <Signup />}
        </div>

      </div>
    </div>
  );
}

export default Auth;