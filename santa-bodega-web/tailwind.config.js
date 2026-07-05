/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        signal: "#e8531e",
        ink: "#1e2530",
        "ink-soft": "#5b6472",
        paper: "#ffffff",
        "paper-warm": "#fbf6f1",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};
