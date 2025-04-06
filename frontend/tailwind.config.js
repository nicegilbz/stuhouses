/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colours: {
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
        'pill': '9999px', 
      },
      boxShadow: {
        card: '0 2px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'button': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'button-hover': '0 6px 12px rgba(0, 82, 204, 0.3)',
        'glow': '0 0 15px rgba(0, 82, 204, 0.5)',
        'float': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-light': 'pulseLight 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 10s linear infinite',
        'stagger-fade-in': 'fadeIn 0.5s ease-in-out forwards var(--animation-delay, 0s)',
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
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '70%': { transform: 'scale(1.05)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        pulseLight: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': {
            'background-position': '-500px 0',
          },
          '100%': {
            'background-position': '500px 0',
          },
        },
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        'swift-out': 'cubic-bezier(0.55, 0, 0.1, 1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
  safelist: [
    {
      pattern: /animate-/,
    },
    {
      pattern: /fade-/,
    },
    {
      pattern: /slide-/,
    },
    {
      pattern: /duration-/,
    },
    {
      pattern: /delay-/,
    },
  ],
} 