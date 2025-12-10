/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./html/**/*.{html,js}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        'both-black': '#000000',
        'both-dark-gray': '#0f0f13',
        'both-red': '#B3131B',
        'both-gold': '#d4af37',
        'both-cream': '#F5F1E8'
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in',
        'fade-in-up': 'fadeInUp 1.2s ease-out',
        'fade-in-down': 'fadeInDown 0.8s ease-out',
        'pulse-gold': 'pulseGold 3s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        }
      }
    }
  },
  plugins: [],
}