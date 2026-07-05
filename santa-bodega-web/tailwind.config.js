/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        signal: "#d9622b",
        steel: "#4b5563",
        "steel-dark": "#2c333b",
        sand: "#e8ddc8",
        "sand-light": "#f5efe1",
        marine: "#3c5a56",
        "marine-faded": "#6f8b87",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};
