import React, { useState } from "react";
import {
  inputBase,
  label,
  passWordInput,
  passWordInnerInput,
  submitButton,
} from "../styles/Auth";
import { register, requestOtp, varifyOtp } from "../api/Auth";
import { useNavigate } from "react-router-dom";

function Signup() {
  const initialForm = {
    email: "",
    username: "",
    fullName: "",
    password: "",
    otp: "",
  };


  const [formData, setFormData] = useState(initialForm);

  const [isEmailVarified, setIsEmailVarified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [resError, setResError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate("/dashboard");

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,16}$/;

  const handleChange = (e) => {
    setResError({});
    setError({});
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const err = {};
    if (formData.email && !emailRegex.test(formData.email)) {
      err.email = "Please give valid email";
    }
    if (formData.password && !passwordRegex.test(formData.password)) {
      err.password = "Please enter strong password";
    }

    setError(err);
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (Object.entries(error).length > 0) {
      return;
    }
    setIsLoading(true);
    setResError({});

    if (!otpSent && !isEmailVarified) {
      const otpResponse = await requestOtp(formData.email);
      setIsLoading(false);
      if (!otpResponse.success) {
        setResError({ message: otpResponse.message });
        return;
      }
      setOtpSent(true);
    } else if (!isEmailVarified && otpSent) {
      const validationResponse = await varifyOtp({
        email: formData.email,
        otp: formData.otp,
      });
      setIsLoading(false);
      if (!validationResponse.success) {
        setResError({ message: validationResponse.message });
        return;
      }
      setIsEmailVarified(true);
      setOtpSent(true);
    } else {
      const user = {
        email: formData.email,
        username: formData.username,
        fullName: formData.fullName,
        password: formData.password,
      };
      const registerResponse = await register(user);
      setIsLoading(false);
      if (!registerResponse.success) {
        setResError({ message: registerResponse.message });
        return;
      }
      navigate("/dashboard");
    }

    setFormData(initialForm);
  };

  console.log(resError)

  return (
    <form
      className="flex flex-col gap-4 w-full"
      onSubmit={(e) => handleSubmit(e)}
    >
      {/* Email Field */}
      {!isEmailVarified && (
        <div className="flex flex-col gap-1">
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
            onBlur={handleBlur}
          />
          {error?.email && <p className="text-alert text-sm">{error.email}</p>}
        </div>
      )}

      {/* OTP Field */}
      {otpSent && !isEmailVarified && (
        <div className="flex flex-col animate-fadeIn">
          <label htmlFor="otp" className={label}>
            Verification Code
          </label>
          <input
            type="text"
            name="otp"
            value={formData.otp}
            id="otp"
            placeholder="Enter 6-digit OTP"
            className={inputBase}
            onChange={handleChange}
          />
        </div>
      )}

      {/* Post-Verification Fields */}
      {otpSent && isEmailVarified && (
        <div className="flex flex-col gap-4 animate-fadeIn">
          {/* Username */}
          <div className="flex flex-col">
            <label htmlFor="username" className={label}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              id="username"
              placeholder="johndoe"
              className={inputBase}
              onChange={handleChange}
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
              value={formData.fullName}
              id="fullName"
              placeholder="John Doe"
              className={inputBase}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className={label}>
              Password
            </label>
            <div className={passWordInput}>
              <input
                className={passWordInnerInput}
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                id="password"
                placeholder="••••••••"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                className="px-4 text-[10px] font-extrabold uppercase tracking-widest text-primary hover:text-primaryHover transition-colors cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {error?.password && (
              <p className="text-alert text-sm">{error.password}</p>
            )}
          </div>
        </div>
      )}

      {resError?.message && (
        <p className="text-alert text-sm">{resError.message}</p>
      )}

      {/* Dynamic Action Button */}
      <button type="submit" className={submitButton} disabled={isLoading}>
        {
          isLoading ? <span>Progressing...</span> 
          :
          !isEmailVarified && !otpSent
            ? "Request Security Code"
            : otpSent && !isEmailVarified
              ? "Verify Security Code"
              : "Complete Registration"
        }
      </button>
    </form>
  );
}

export default Signup;
