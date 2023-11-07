module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f43f5e",
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
          950: "#4c0519",
        },
        secondary: {
          DEFAULT: "#E8753D",
          50: "#FBEAE1",
          100: "#F9DDCF",
          200: "#F5C3AA",
          300: "#F1A986",
          400: "#EC8F61",
          500: "#E8753D",
          600: "#D45619",
          700: "#A24213",
          800: "#6F2D0D",
          900: "#3D1907",
        },
        "brand-gray": "#5F5D5D",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
