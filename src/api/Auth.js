import { BASE_URL } from "../config.js";

export async function requestOtp(email) {
  try {
    console.log(email)
    const res = await fetch(`${BASE_URL}/api/auth/send-otp`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}


export async function varifyOtp({email, otp}) {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}


export async function register(userData) {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}
