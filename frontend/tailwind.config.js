/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns:{
        'auto':'repeat(auto-fill, minmax(150px, 1fr))'
      },
      colors:{
        'primary':'#10b981',
        'secondary':'#06b6d4',
        'accent':'#3b82f6'
      }
    },
  },
  plugins: [],
}