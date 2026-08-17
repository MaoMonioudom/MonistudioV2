/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#3ea108",
          white: "#f8f8f8",
          black: "#020202",
        },
      },
    },
  },
  plugins: [],
}

