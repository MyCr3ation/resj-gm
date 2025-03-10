/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#009e67",
        back: "#161616",
      },
      screens: {
        xs: "475px",
      },
      keyframes: {
        glow: {
          "0%, 100%": {
            textShadow:
              "0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.6)",
          },
          "50%": {
            textShadow:
              "0 0 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(255, 255, 255, 0.6)",
          },
        },
      },
      animation: {
        glow: "glow 2s infinite",
      },
    },
  },
  plugins: [],
}