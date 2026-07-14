import React, { useState } from "react";
import { inputBase, label, passWordInput } from "../styles/Auth";

function Login() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {/* Removed container layout classes from form since parent handles it gracefully */}
      <form className="flex flex-col gap-4 w-full">
        
        {/* Email Field */}
        <div className="flex flex-col">
          <label htmlFor="email" className={label}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="name@company.com"
            className={inputBase}
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="password" className="text-xs font-semibold tracking-wider text-zinc-400">
              Password
            </label>
            {/* Added Indigo secondary palette feature here */}
            <a href="#forgot" className="text-[11px] font-medium text-[#6366F1] hover:text-[#4f46e5] hover:underline transition-colors">
              Forgot password?
            </a>
          </div>
          <div className={passWordInput}>
            <input
              className="flex-1 bg-transparent py-3 px-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="px-4 text-xs font-bold uppercase tracking-wider text-[#07BAA5] hover:text-[#059887] transition-colors cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button 
          type="submit"
          className="w-full mt-4 rounded-xl bg-[#07BAA5] py-3 text-sm font-semibold text-white shadow-lg shadow-[#07BAA5]/10 hover:bg-[#059887] active:scale-[0.99] transition-all cursor-pointer"
        >
          Sign In to Account
        </button>
      </form>
    </>
  );
}

export default Login;