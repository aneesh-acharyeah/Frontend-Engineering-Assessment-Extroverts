/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Sampled from the Extroverts app screenshots.
        ink: {
          DEFAULT: '#000000',
          surface: '#0E0E0E',
          raised: '#161616',
        },
        vibe: {
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#A855F7',
          600: '#9333EA',
        },
        danger: '#FF6B6B',
      },
      borderColor: {
        hairline: 'rgba(255,255,255,0.10)',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(168,85,247,0.55)',
      },
      keyframes: {
        'carousel-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.3333%)' },
        },
        'indicator-line': {
          '0%, 100%': { transform: 'scaleY(0.35)' },
          '50%': { transform: 'scaleY(1)' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-5px)' },
          '40%, 80%': { transform: 'translateX(5px)' },
        },
        'blob-drift': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(3%, -4%, 0) scale(1.08)' },
        },
      },
      animation: {
        'indicator-line': 'indicator-line 1s ease-in-out infinite',
        'toast-in': 'toast-in 220ms ease-out',
        shake: 'shake 380ms ease-in-out',
        'blob-drift': 'blob-drift 18s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
