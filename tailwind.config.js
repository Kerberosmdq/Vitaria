/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F9F7F2',
        surface: '#FFFFFF',
        primary: '#B08968',
        secondary: '#A4AC86',
        accent: '#D4A373',
        'text-main': '#3D342B',
        'text-muted': '#9CA3AF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Or 'Lato' if preferred
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
