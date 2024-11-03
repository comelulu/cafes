/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#B37E2E",
        secondary: "#F5DAB3",
        warning: "#F5DAB3",
        darkBrown: "#58473B",
      },
      boxShadow: {
        custom: "0px 4px 60px rgba(4, 6, 15, 0.05)",
      },
    },
  },
  plugins: [],
};
