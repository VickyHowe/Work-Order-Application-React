/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FAEDCB', // Light primary color
          DEFAULT: '#C9E4DE', // Default primary color
          dark: '#C6DEF1', // Dark primary color
        },
        secondary: {
          light: '#DBCDF0', // Light secondary color
          DEFAULT: '#F2C6DE', // Default secondary color
          dark: '#F7D9C4', // Dark secondary color
        },
        navbar: {
          DEFAULT: '#A8CAD6'
        },
        forms: {
          DEFAULT: '#CFD7CF'
        }
      },
    },
  },
  plugins: [],
}