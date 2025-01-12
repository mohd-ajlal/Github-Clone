/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode:"class",
  theme: {
    extend: {
      backgroundImage: {
        'light-bg': "url('/bg1.jpg')",
        'dark-bg': "url('/bg2.jpg')",
      },
    },
  },
  plugins: [],
}