import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ["'Cinzel'", "'Times New Roman'", 'serif'],
        merriweather: ["'Merriweather'", 'Georgia', 'serif'],
        'im-fell': ["'IM Fell English'", 'Georgia', 'serif'],
        inter: ["'Inter'", 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
