/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sena: {
          green: '#39A900',
          'green-dark': '#2d8700',
          blue: '#00324D',
          'blue-light': '#004a73',
          white: '#FFFFFF',
          'gray-light': '#F2F2F2',
          'gray-dark': '#333333',
        },
        leps: {
          yellow: '#FDC300',
          navy: '#00304D',
        },
      },
      fontFamily: {
        sans: ['Work Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
