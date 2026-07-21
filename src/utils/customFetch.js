import { BASE_URL } from "../config";

export async function customFetch(path, options = {}) {
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

  let response = await fetch(url, fetchOptions);
  // let x = response.clone();
  // console.log(x);

  if ((response.status === 401 || response.status === 403) && !options._retry) {
    options._retry = true;

    try {
      console.log("Access token expired. Attempting silent refresh...");

      const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.ok) {
        console.log("Refresh successful! Retrying original request...");
        return await fetch(url, options);
      }
    } catch (refreshError) {
      console.error("Refresh token network error:", refreshError);
    }

    console.warn("Session expired completely. Redirecting to auth node.");
    // window.location.href = "/";
  }

  return response;
}

export const cusApi = {
  get: (url) => customFetch(url),

  post: (url, body) =>
    customFetch(url, {
      method: "POST",
      body,
    }),

  put: (url, body) =>
    customFetch(url, {
      method: "PUT",
      body,
    }),

  delete: (url) =>
    customFetch(url, {
      method: "DELETE",
    }),
};
