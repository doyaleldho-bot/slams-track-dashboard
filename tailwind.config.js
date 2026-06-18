/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        arimo: ["Arimo", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },

      keyframes: {
        gradient: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
      },

      animation: {
        gradient: "gradient 3s ease infinite",
      },
    },
  },

  plugins: [],
}
