/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf9f5',
          100: '#f5efe4',
          200: '#e7d9c1',
          300: '#d7bc97',
          400: '#c59a6d',
          500: '#b7804a',
          600: '#a2673d',
          700: '#834e34',
          800: '#6b402f',
          900: '#58362a',
          950: '#301c15',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
