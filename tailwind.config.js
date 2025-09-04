/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          800: '#1a202c', // hsl(220, 26%, 14%)
          700: '#2d3748', // hsl(218, 23%, 23%)
          600: '#374151', // hsl(217, 19%, 27%)
        },
        accent: {
          DEFAULT: '#d69e2e', // hsl(40, 67%, 51%)
          hover: '#b8860b', // Un tono más oscuro para el hover
        },
      },
      backgroundColor: {
        'primary-800': '#075985',
        'primary-700': '#0369a1',
        'primary-600': '#0284c7',
        'accent': '#d69e2e',
      },
      textColor: {
        'primary': '#f3f4f6', // Texto claro para fondos oscuros
        'secondary': '#d1d5db', // Texto secundario
        'accent': '#d69e2e',
      },
      borderColor: {
        'primary': '#374151',
        'accent': '#d69e2e',
      },
    },
  },
  plugins: [],
}
