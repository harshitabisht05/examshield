/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e40af", // Deep Blue
        secondary: "#64748b", // Slate
        accent: "#3b82f6", // Bright Blue
        danger: "#ef4444",
        success: "#22c55e",
      },
    },
  },
  plugins: [],
}