/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#07111f', 900: '#0c1b2a', 800: '#112437' },
        electric: '#123fe4',
      },
      fontFamily: { sans: ['DM Sans', 'Arial', 'sans-serif'] },
    },
  },
  plugins: [],
}
