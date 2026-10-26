/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shopee: {
          DEFAULT: '#ee4d2d',
          orange: '#ee4d2d',
          darkOrange: '#d73211',
          lightOrange: '#fff5f1',
          hoverOrange: '#f05d40',
        }
      }
    },
  },
  plugins: [],
}
