/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0d5eaf", // AICTE-inspired blue
        "primary-dark": "#06457c",
        "status-verified": "#28a745",
        "status-pending": "#ffc107",
        "status-rejected": "#dc3545",
        "status-review": "#fd7e14",
      },
      fontFamily: {
        sans: ["Helvetica", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};
