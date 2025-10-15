/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // <-- enables manual dark/light toggle using a class
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🌞 Light theme palette
        light: {
          bg: "#f9fafb",
          card: "#ffffff",
          text: "#111827",
          accent: "#16a34a", // green-600
        },
        // 🌚 Dark theme palette
        dark: {
          bg: "#0d1117",
          card: "#161b22",
          text: "#e5e7eb",
          accent: "#22c55e", // green-500
        },
      },
    },
  },
  plugins: [],
};
