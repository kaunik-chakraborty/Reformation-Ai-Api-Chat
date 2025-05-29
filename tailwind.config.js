/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      transitionDuration: {
        '2000': '2000ms',
      },
      colors: {
        primary: "#4C8BF5", // Changed from Indigo-600 to match accent
        secondary: "#10B981", // Emerald-500
        background: {
          light: "#f3f3ee", // Light background
          dark: "#191a1a", // Dark background
        },
        card: {
          light: "#ffffff", // White cards
          dark: "#202222", // Dark cards
        },
        text: {
          light: "#0C1022", // Dark text for light mode
          dark: "#ffffff", // White text for dark mode
        },
        border: {
          light: "#E5E7EB", // Light border
          dark: "#2e3030", // Dark border
        },
        accent: "#4C8BF5", // Blue accent color
        muted: "#6B7280", // Gray-500 for muted text
      },
      animation: {
        'circle-pulse': 'circle-pulse 10s ease-in-out infinite alternate',
        'heading-shine': 'heading-shine 6s linear infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'fade-in-out': 'fadeInOut 2s ease-in-out forwards',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'sidebar-show': 'sidebar-show 0.3s ease-out forwards',
        'sidebar-hide': 'sidebar-hide 0.3s ease-out forwards',
      },
      keyframes: {
        'circle-pulse': {
          '0%': { transform: 'scale(1)', opacity: '0.2' },
          '100%': { transform: 'scale(1.1)', opacity: '0.15' }
        },
        'heading-shine': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        'sidebar-show': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'sidebar-hide': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'glow': {
          '0%': {
            textShadow: '0 0 10px rgba(76, 139, 245, 0.7), 0 0 20px rgba(76, 139, 245, 0.5)',
          },
          '100%': {
            textShadow: '0 0 15px rgba(76, 139, 245, 0.7), 0 0 25px rgba(76, 139, 245, 0.5)', // Updated to new accent color
          },
        },
        'fadeInOut': {
          '0%': {
            opacity: '0',
            transform: 'translate(-50%, 10px)',
          },
          '10%': {
            opacity: '1',
            transform: 'translate(-50%, 0)',
          },
          '90%': {
            opacity: '1',
            transform: 'translate(-50%, 0)',
          },
          '100%': {
            opacity: '0',
            transform: 'translate(-50%, -10px)',
          },
        },
        'fadeIn': {
          'from': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          'to': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};