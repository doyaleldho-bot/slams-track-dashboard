// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api", 
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Refresh token request should also use same api instance
// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     if (!error.response) {
//       return Promise.reject(error);
//     }

//     //  avoid infinite loop
//     if (
//       originalRequest.url?.includes("/refresh-token") ||
//       originalRequest.url?.includes("/logout")
//     ) {
//       window.location.href = "/login";
//       return Promise.reject(error);
//     }

//     // handle expired token
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         await api.post("/refresh-token"); //  same baseURL

//         return api(originalRequest);
//       } catch (err) {
//         window.location.href = "/login";
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;




import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  // Note: Do NOT set Content-Type here — axios sets it automatically
  // per request (e.g. multipart/form-data with boundary for FormData,
  // or application/json for plain objects).
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // No response at all = network error (server down, CORS, etc.)
    if (!error.response) {
      console.error("[API] Network error (no response):", error.message, error.code);
      return Promise.reject(error);
    }

    // Prevent refresh loops
    if (
      originalRequest.url?.includes("/token-refresh/") ||
      originalRequest.url?.includes("/logout/")
    ) {
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          // No refresh token — reject with the original 401 error (not a new one)
          return Promise.reject(error);
        }

        console.log("Refreshing token...");

        const refreshRes = await api.post("/token-refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = refreshRes.data.tokens.access;
        localStorage.setItem("access_token", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError: any) {
        // Refresh failed — clear tokens and reject with the ORIGINAL error
        // so callers see the 401, not an unrelated refresh network error
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        console.error("[API] Token refresh failed:", refreshError?.message);
        return Promise.reject(error); // ← original error, not refreshError
      }
    }

    return Promise.reject(error);
  }
);

export default api;