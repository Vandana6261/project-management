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

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&*!]).{8,}$/;

function Signup() {
  const initialForm = {
    email: "",
    username: "",
    fullName: "",
    password: "",
    otp: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [resError, setResError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (isEmailVerified && !passwordRegex.test(formData.password)) {
      errors.password =
        "Password must contain letters, numbers and special characters";
    }

    return errors;
  };

  const handleChange = (e) => {
    setResError({});
    setError({});
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const errors = validateForm();
    if (Object.keys(errors).length) {
      setError(errors);
      return;
    }

    setIsLoading(true);
    setResError({});

    try {
      if (!otpSent && !isEmailVerified) {
        const otpResponse = await requestOtp(formData.email);

        if (!otpResponse.success) {
          setResError({ message: otpResponse.message });
          return;
        }

        setOtpSent(true);
      } else if (!isEmailVerified && otpSent) {
        const validationResponse = await varifyOtp({
          email: formData.email,
          otp: formData.otp,
        });

        if (!validationResponse.success) {
          setResError({ message: validationResponse.message });
          return;
        }

        setIsEmailVerified(true);
      } else {
        const user = {
          email: formData.email,
          username: formData.username,
          fullName: formData.fullName,
          password: formData.password,
        };

        const registerResponse = await register(user);

        if (!registerResponse.success) {
          setResError({ message: registerResponse.message });
          return;
        }

        setFormData(initialForm);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);

      setResError({
        message:
          error?.message || "Something went wrong. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log(resError);

  return (
    <form
      className="flex flex-col gap-4 w-full"
      onSubmit={(e) => handleSubmit(e)}
    >
      {/* Email Field */}
      {!isEmailVerified && (
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
          />
          {error?.email && <p className="text-alert text-sm">{error.email}</p>}
        </div>
      )}

      {/* OTP Field */}
      {otpSent && !isEmailVerified && (
        <div className="flex flex-col animate-fadeIn">
          <label htmlFor="otp" className={label}>
            Verification Code
          </label>
          <input
            type="text"
            name="otp"
            inputMode="numeric"
            maxLength="6"
            value={formData.otp}
            id="otp"
            placeholder="Enter 6-digit OTP"
            className={inputBase}
            onChange={handleChange}
          />
        </div>
      )}

      {/* Post-Verification Fields */}
      {otpSent && isEmailVerified && (
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
        {isLoading ? (
          <span>Progressing...</span>
        ) : !isEmailVerified && !otpSent ? (
          "Request Security Code"
        ) : otpSent && !isEmailVerified ? (
          "Verify Security Code"
        ) : (
          "Complete Registration"
        )}
      </button>
    </form>
  );
}

export default Signup;
