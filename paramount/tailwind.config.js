/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      letterSpacing: {
        'mega-tight': '-0.12em'
      },
      keyframes: {
        marqueeSlow: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'marquee-slow': 'marqueeSlow 90s linear infinite',
      },
      fontFamily: {
        impact: ["Anton", "sans-serif"],
      }
    }
  },
  plugins: [],
}