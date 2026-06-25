import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => {
  //  load .env variables
  const env = loadEnv(mode, process.cwd(), '')
console.log('VITE_API_URL', env.VITE_API_URL)
  return {
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

      // correct type
      allowedHosts: true,

      proxy: {
        "/api": {
          //  from env file
          target: "http://192.168.1.17:8000",
          changeOrigin: true,
          secure: false,
        },
        "/media": {
          // proxy Django media files (uploaded photos, etc.)
          target: "http://192.168.1.17:8000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
