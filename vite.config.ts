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
        target: "http://0.0.0.0:8000",
        changeOrigin: true,
        secure: false,
      },
      "/media": {
        target: "http://0.0.0.0:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});


// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), "");

//   return {
//     plugins: [
//       react({
//         babel: {
//           plugins: [["babel-plugin-react-compiler"]],
//         },
//       }),
//     ],

//     server: {
//       host: true,
//       port: 5174,
//       allowedHosts: true,

//       proxy: {
//         "/api": {
//           target: env.VITE_API_URL,
//           changeOrigin: true,
//           secure: false,
//         },
//         "/media": {
//           target: env.VITE_API_URL,
//           changeOrigin: true,
//           secure: false,
//         },
//       },
//     },
//   };
// });