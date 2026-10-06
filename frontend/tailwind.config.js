/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#050505', // Primary background
          900: '#0D0D0D', // Secondary background
          850: '#121212',
          800: '#1A1A1A',
          700: '#2A2A2A',
        },
        crimson: {
          900: '#3A0303',
          800: '#5C0505',
          700: '#800A0A',
          600: '#990000', // Primary accent
          500: '#B31212',
          400: '#CC1F1F',
          glow: 'rgba(153, 0, 0, 0.25)',
        },
        paper: {
          100: '#F9F8F6',
          200: '#EFECE6',
          muted: '#A3A3A3',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'crimson-glow': '0 0 30px -5px rgba(153, 0, 0, 0.35)',
        'crimson-subtle': '0 4px 20px -2px rgba(153, 0, 0, 0.15)',
        'book-depth': '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 40px -10px rgba(139, 0, 0, 0.25)',
      },
      backgroundImage: {
        'radial-crimson': 'radial-gradient(circle at 50% 50%, rgba(153, 0, 0, 0.12) 0%, rgba(5, 5, 5, 0) 70%)',
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(153, 0, 0, 0.18) 0%, rgba(5, 5, 5, 0) 60%)',
      }
    },
  },
  plugins: [],
}
