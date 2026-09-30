/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable toggling manually via 'class' rather than OS preference tracking aggressively
  theme: {
    extend: {
      colors: {
        dark: '#121212',
        darker: '#0a0a0a',
        darkLayer: '#1e1e1e',
        brand: '#4F46E5', // Indigo-600
        brandHover: '#4338CA', // Indigo-700
      }
    },
  },
  plugins: [],
}
