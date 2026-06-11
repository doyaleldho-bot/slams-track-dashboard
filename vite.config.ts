import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => {
  //  load .env variables
  const env = loadEnv(mode, process.cwd(), "")
  console.log(env.VITE_API_URL)
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
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
