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
        lightText: "#fff",

        darkBackground: "linear-gradient(135deg, #0707e8, #ed6dfd);",
        lightBackground: "#fff",

        darkList: "#0f0a01",
        lightList: "#afafaf",

        darkCard: "#292e32",
        lightCard: "#878787",
      },
    },
  },
  plugins: [],
}

