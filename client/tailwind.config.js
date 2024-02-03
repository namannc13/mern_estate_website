/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      "grey-slate": {
        1: "#E0CCBE",
        2: "#747264",
        3: "#3C3633"
      },
      "red": {
        1: "#AF2655"
      },
      "white": {
        1: "#F6F4EB"
      },
      "green": {
        1: "#ADBC9F",
        2: "#436850"
      }
    },
    extend: {},
  },
  plugins: [],
};
