import React, { useState } from "react";
import { inputBase, label, passWordInput } from "../styles/Auth";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const [isEmailVarfied, setIsVarified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {/* Container layout matches the Login form precisely */}
      <form className="flex flex-col gap-4 w-full">
        
        {/* Email Field */}
        {!isEmailVarfied && (
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
        )}

        {/* OTP Field */}
        {otpSent && !isEmailVarfied && (
          <div className="flex flex-col animate-fadeIn">
            <label htmlFor="otp" className={label}>
              Verification Code (OTP)
            </label>
            <input 
              type="text" 
              name="otp" 
              id="otp" 
              placeholder="Enter 6-digit OTP"
              className={inputBase} 
            />
          </div>
        )}

        {/* Post-Verification Fields (Username, Full Name, Password) */}
        {otpSent && isEmailVarfied && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            
            {/* Username */}
            <div className="flex flex-col">
              <label htmlFor="username" className={label}>
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="johndoe"
                className={inputBase}
              />
            </div>

            {/* Full Name */}
            <div className="flex flex-col">
              <label htmlFor="fullName" className={label}>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                placeholder="John Doe"
                className={inputBase}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label htmlFor="password" className={label}>
                Password
              </label>
              <div className={passWordInput}>
                <input
                  className="flex-1 bg-transparent py-3 px-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                  type={showPassword ? "text" : "password"} // Fixed the "test" -> "text" string typo
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
          </div>
        )}

        {/* Dynamic Action Button */}
        <button 
          type="submit"
          className="w-full mt-4 rounded-xl bg-[#07BAA5] py-3 text-sm font-semibold text-white shadow-lg shadow-[#07BAA5]/10 hover:bg-[#059887] active:scale-[0.99] transition-all cursor-pointer"
        >
          {!isEmailVarfied && !otpSent 
            ? "Request OTP" 
            : otpSent && !isEmailVarfied 
            ? "Verify OTP" 
            : "Register Account"}
        </button>
      </form>
    </>
  );
}

export default Signup;