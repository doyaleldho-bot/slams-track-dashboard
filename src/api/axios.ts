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
  headers: {
    "Content-Type": "application/json",
  },
});

const isValidToken = (token: string | null | undefined) =>
  Boolean(token && token !== "undefined" && token !== "null" && token.trim() !== "");

// ===============================
// 1. REQUEST INTERCEPTOR
// Attach access token to every request
// ===============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (isValidToken(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ===============================
// 2. RESPONSE INTERCEPTOR
// Handle 401 + refresh token
// ===============================
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    // Avoid infinite loop
    if (
      originalRequest.url?.includes("/token-refresh/") ||
      originalRequest.url?.includes("/logout")
    ) {
      // localStorage.clear();
      // window.location.href = "/login";
      return Promise.reject(error);
    }

    // Handle expired access token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!isValidToken(refreshToken)) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          return Promise.reject(error);
        }

        const res = await api.post("/token-refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;

        if (isValidToken(newAccessToken)) {
          // store new access token
          localStorage.setItem("access_token", newAccessToken);
          // update header for retry
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return Promise.reject(error);

      } catch (err) {
        // localStorage.clear();
        // window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;