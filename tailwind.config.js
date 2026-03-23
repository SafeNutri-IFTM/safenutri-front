/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFC605',
        white: '#FFFFFF',
        black: '#000000',
      },
      fontFamily: {
        sans: ['Arial'],
      }
    },
  },
  plugins: [],
}