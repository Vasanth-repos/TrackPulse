/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Government Railway Deep Navy & IR Blues
        gov: {
          950: '#07162C',
          900: '#0B2545',
          850: '#103058',
          800: '#133B5C',
          700: '#1D4ED8',
          600: '#2563EB',
          500: '#3B82F6',
          400: '#60A5FA',
          300: '#93C5FD',
          200: '#BFDBFE',
          100: '#DBEAFE',
          50:  '#EFF6FF',
        },
        // Electronic Station Board Navy Palette
        board: {
          bg: '#061121',
          card: '#0B1B33',
          border: '#1E293B',
          header: '#0F2744',
          highlight: '#1E3A8A',
        },
        // Standard Railway Status Indicators
        status: {
          ontime: '#15803D',
          ontimeBg: '#DCFCE7',
          ontimeDark: '#22C55E',
          
          delayed: '#B45309',
          delayedBg: '#FEF3C7',
          delayedDark: '#F59E0B',
          
          disrupted: '#B91C1C',
          disruptedBg: '#FEE2E2',
          disruptedDark: '#EF4444',
          
          neutral: '#475569',
          neutralBg: '#F1F5F9',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'gov': '8px',
        'gov-card': '12px',
      }
    },
  },
  plugins: [],
}
