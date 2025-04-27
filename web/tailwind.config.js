/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
      },
      colors: {
        "blue-base": "#2C46B1",
        "blue-dark": "#2C4091",
      },
    },
  },
  plugins: [],
};
