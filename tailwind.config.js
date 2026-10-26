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
          primary: '#ee4d2d',
          dark: '#d73211',
          bg: '#f5f5f5',
          text: '#222222',
          muted: '#757575',
          border: '#e8e8e8',
          lightOrange: '#fff5f1',
          hoverOrange: '#f05d40',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        shopee: '0 1px 1px 0 rgba(0,0,0,.05)',
        'shopee-hover': '0 2px 10px 0 rgba(0,0,0,.08)',
      }
    },
  },
  plugins: [],
}
