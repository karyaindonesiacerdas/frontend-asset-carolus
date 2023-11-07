module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22c55e',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        secondary: {
          DEFAULT: '#E8753D',
          50: '#FBEAE1',
          100: '#F9DDCF',
          200: '#F5C3AA',
          300: '#F1A986',
          400: '#EC8F61',
          500: '#E8753D',
          600: '#D45619',
          700: '#A24213',
          800: '#6F2D0D',
          900: '#3D1907',
        },
        'brand-gray': '#5F5D5D',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
