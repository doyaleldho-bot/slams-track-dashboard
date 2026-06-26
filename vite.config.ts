import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],

  server: {
    host: true,
    port: 5174,
    allowedHosts: true,

    proxy: {
      "/api": {
        target: "http://192.168.1.47:8000",
        changeOrigin: true,
        secure: false,
      },
      "/media": {
        target: "http://192.168.1.47:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});