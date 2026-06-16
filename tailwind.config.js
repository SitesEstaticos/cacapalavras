/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A535C',
        secondary: '#4ECDC4',
        dark: '#0B1220',
        surface: '#0B1220',
        background: '#0B1220',
        light: '#FFFFFF',
        muted: '#CBD5E1',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounce 1s infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'medium': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'hard': '0 20px 25px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
  darkMode: 'class',
}
