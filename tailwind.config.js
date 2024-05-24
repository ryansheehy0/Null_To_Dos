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
        lightList: "#cdcdcd",

        darkCard: "#505050",
        lightCard: "#f6f9fe",
      },
    },
  },
  plugins: [],
}