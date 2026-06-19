import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
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

    if (!error.response) {
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
        const refreshToken =
          localStorage.getItem("refresh_token");

        if (!refreshToken) {
          return Promise.reject(error);
        }

        console.log("Refreshing token...");

        const refreshRes = await axios.post(
          "/api/token-refresh/",
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken =
          refreshRes.data.tokens.access;

        localStorage.setItem(
          "access_token",
          newAccessToken
        );
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
          window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;