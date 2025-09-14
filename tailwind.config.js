/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F4FD',
          100: '#D1E9FB', 
          500: '#040C23', // Background principal
          600: '#030A1F',
          700: '#02081A',
          800: '#010615',
          900: '#000410',
        },
        accent: {
          purple: '#EEF2FF', // Couleur card/highlight
          orange: '#F9BD64', // Bouton CTA
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B8C5D6',
        }
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}