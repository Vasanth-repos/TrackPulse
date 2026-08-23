/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rail: {
          950: '#070A10',
          900: '#0B0F19',
          850: '#101624',
          800: '#161F33',
          750: '#1D2840',
          700: '#263452',
          600: '#3A4D73',
          500: '#566D9B',
          400: '#839AC7',
          300: '#B0C2E8',
          200: '#D5E0FA',
          100: '#EDF2FE',
          50:  '#F6F9FF',
        },
        signal: {
          green: '#10B981',
          amber: '#F59E0B',
          red: '#EF4444',
          cyan: '#06B6D4',
          blue: '#3B82F6'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
}
