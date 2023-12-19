/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        darkText: "#fff",
        lightText: "#000",

        darkBackground: "#000",
        lightBackground: "#fff",

        darkList: "#282828",
        lightList: "#d7d7d7",

        darkCard: "#505050",
        lightCard: "#afafaf"
      },
    },
  },
  plugins: [],
}

