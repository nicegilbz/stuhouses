/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0052CC',
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0052CC',
          600: '#0047b3',
          700: '#003d99',
          800: '#003380',
          900: '#002966',
        },
        secondary: {
          DEFAULT: '#FF5630',
          50: '#fff0eb',
          100: '#ffd6cc',
          200: '#ffbcad',
          300: '#ffa28e',
          400: '#ff896f',
          500: '#FF5630',
          600: '#e64d2b',
          700: '#cc4526',
          800: '#b33c21',
          900: '#99321c',
        },
        tertiary: {
          DEFAULT: '#36B37E',
          light: '#79F2C0',
          dark: '#006644',
        },
        neutral: {
          DEFAULT: '#505F79',
          light: '#F4F5F7',
          dark: '#172B4D',
        }
      },
      fontFamily: {
        sans: ['Avenir', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 2px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 10px 40px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
} 