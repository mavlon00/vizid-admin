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
          dark: '#2C2C2C',
          green: '#4A4F4C',
          slate: '#3D423F',
          gold: '#c9a96e',
          'gold-dark': '#8B6F47',
          'gold-light': '#dfc597',
          bg: '#FAF9F7',
          'bg-alt': '#F9F9F8',
          text: '#2C2C2C',
          muted: '#666666',
          border: '#E8E6E1',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
        heading: ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
}

