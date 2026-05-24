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
      animation: {
        'screen-in': 'screenFadeIn 0.45s ease-out both',
        'shake': 'shake 0.52s ease-in-out',
        'snap-in': 'snapIn 0.42s cubic-bezier(0.34,1.56,0.64,1) both',
        'book-glow': 'bookGlow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.35s ease-out both',
        'candle-flicker': 'candleFlicker 1.9s ease-in-out infinite',
      },
      keyframes: {
        screenFadeIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-9px) rotate(-1deg)' },
          '40%': { transform: 'translateX(9px) rotate(1deg)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        snapIn: {
          '0%': { transform: 'scale(0.65) translateY(6px)', opacity: '0' },
          '65%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bookGlow: {
          '0%,100%': { boxShadow: '0 0 12px rgba(200,162,77,0.25)' },
          '50%': { boxShadow: '0 0 40px rgba(200,162,77,0.7), 0 0 80px rgba(200,162,77,0.18)' },
        },
        meterGrow: {
          'from': { width: '0%' },
          'to': { width: 'var(--meter-target)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(14px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        candleFlicker: {
          '0%,100%': { transform: 'scaleX(1) scaleY(1) translateX(0)', opacity: '1' },
          '20%': { transform: 'scaleX(0.92) scaleY(1.08) translateX(0.5px)', opacity: '0.94' },
          '45%': { transform: 'scaleX(1.05) scaleY(0.95) translateX(-1px)', opacity: '0.98' },
          '70%': { transform: 'scaleX(0.96) scaleY(1.05) translateX(1px)', opacity: '0.96' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
