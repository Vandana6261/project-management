import React, { useState } from "react";
// Auth form styling classes
const inputBase = "block w-full bg-inputBg backdrop-blur-xl rounded-xl border border-inputBorder py-3 px-4 text-sm font-medium tracking-wide text-title placeholder-placeholder/50 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";
const label = "text-[10px] uppercase font-bold tracking-widest text-muted";
const passWordInput = "flex items-center w-full bg-inputBg backdrop-blur-xl rounded-xl border border-inputBorder transition-all duration-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10";
const passWordInnerInput = "flex-1 bg-transparent py-3 px-4 text-sm font-medium tracking-wide text-title placeholder-placeholder/50 focus:outline-none";
const submitButton = "w-full mt-4 rounded-xl bg-primary py-3.5 text-xs uppercase font-extrabold tracking-widest text-white shadow-lg shadow-primary/15 hover:bg-primaryHover hover:shadow-primary/25 active:scale-[0.985] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";
const errorMessage = "p-3 rounded-xl bg-alert/10 border border-alert/20 text-alert text-xs font-semibold flex items-center gap-2 animate-fadeIn";
import { login } from "../services/Auth";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../context/AuthContext";

function Login() {
  const {setUser} = useAuthContext();

  const [formData, setFormData] = useState({email: "", password: ""});
  const [showPassword, setShowPassword] = useState(false);
  const [resError, setResError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e) => {
    setResError("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setResError("");
    setIsLoading(true);

    try {
      const loginRes = await login(formData);
      if (!loginRes || !loginRes.success) {
        setResError(loginRes?.message || "Invalid credentials. Please try again.");
        return;
      }
      setFormData({email: "", password: ""});
      setUser(loginRes.username);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setResError("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={(e) => handleSubmit(e)}>
      {/* Email Field */}
      <div className="flex flex-col">
        <label htmlFor="email" className={label}>
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          id="email"
          placeholder="name@company.com"
          className={inputBase}
          onChange={handleChange}
        />
      </div>

      {/* Password Field */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="password" className={label}>
            Password
          </label>
        </div>
        
        <div className={passWordInput}>
          <input
            className={passWordInnerInput}
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            id="password"
            placeholder="••••••••"
            onChange={handleChange}
          />
          <button
            type="button"
            className="px-4 text-[10px] font-extrabold uppercase tracking-widest text-primary hover:text-primaryHover transition-colors cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Error Feedback */}
      {resError && (
        <div className={errorMessage}>
          <span>⚠️</span>
          <span>{typeof resError === "string" ? resError : resError.message || "Invalid credentials"}</span>
        </div>
      )}

      {/* Action Button */}
      <button type="submit" className={submitButton} disabled={isLoading}>
        {isLoading ? "Logging in..." : "Sign In to Account"}
      </button>
    </form>
  );
}

export default Login;