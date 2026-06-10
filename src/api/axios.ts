import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url?.includes("/token-refresh") ||
      originalRequest.url?.includes("/logout")
    ) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (err) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;