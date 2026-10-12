/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030206',
          900: '#07060a',
          800: '#0d0b14',
          700: '#171424',
        },
        terminal: {
          cyan: '#6dfcc0',
          amber: '#f29c55',
          gold: '#f4cd72',
          red: '#ed6754',
          blue: '#abcfff',
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
