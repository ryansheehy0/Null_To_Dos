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
        darkText: "#000",
        lightText: "#fff",

        darkBackground: "#000",
        lightBackground: "#fff",

        darkList: "#505050",
        lightList: "#afafaf",

        darkCard: "#787878",
        lightCard: "#878787",
      },
    },
  },
  plugins: [],
}

