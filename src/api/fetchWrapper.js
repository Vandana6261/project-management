import { BASE_URL } from "../config.js";

export async function fetchWrapper(path, options = {}) {
  try {
    const url = `${BASE_URL}/api/${path}`;
    console.log(url, "url");

    const fetchOptions = {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers || {}),
      },
    };

    if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
      fetchOptions.body = JSON.stringify(fetchOptions.body);
      fetchOptions.headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      console.log(response);
      // throw new Error(data.message || "Something went wrong");
    }
    return response;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}


export const api = {
  get: (url) => fetchWrapper(url),

  post: (url, body) =>
    fetchWrapper(url, {
      method: "POST",
      body,
    }),

  put: (url, body) =>
    fetchWrapper(url, {
      method: "PUT",
      body,
    }),

  delete: (url) =>
    fetchWrapper(url, {
      method: "DELETE",
    }),
};
