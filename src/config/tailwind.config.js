/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        coffee: "#6F4E37",
        cream: "#F5F5DC",
        darkCoffee: "#3E2723"
      },
    },
  },
  plugins: [],
};