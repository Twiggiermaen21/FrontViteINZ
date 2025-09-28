/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // wszystkie pliki w src
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar'), // wtyczka do custom scrollbara
  ],
};
