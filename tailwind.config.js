/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          metallic: '#D4AF37',
          muted: '#B8963E',
          dark: '#8B7326',
          light: '#F4E0A5',
          glow: 'rgba(212, 175, 55, 0.15)',
        },
        dark: {
          pitch: '#000000',
          deep: '#0A0A0A',
          card: '#121212',
          surface: '#161616',
          hover: '#1F1F1F',
          border: '#262626',
        },
        brand: {
          dark: '#000000',
          slate: '#0A0A0A',
          gold: '#D4AF37',
          'gold-dark': '#B8963E',
          'gold-light': '#F4E0A5',
          bg: '#000000',
          'bg-alt': '#0A0A0A',
          text: '#FFFFFF',
          muted: '#D6D6D6',
          border: '#1F1F1F',
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

