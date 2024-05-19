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

        darkList: "#090601",
        lightList: "#f6f9fe",

        darkCard: "#545e63",
        lightCard: "#c5c8ca",
      },
    },
  },
  plugins: [],
}