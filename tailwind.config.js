/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CatchBarrels Brand Colors
        'cb-gold': '#F4C542',
        'cb-gold-dark': '#E0B030',
        'cb-gold-light': '#FFD966',

        // Dark Theme
        'cb-dark': '#1A1F2E',
        'cb-dark-card': '#252B3D',
        'cb-dark-accent': '#2F3649',

        // Score Colors
        'score-excellent': '#10B981',
        'score-good': '#F4C542',
        'score-average': '#F59E0b',
        'score-needs-work': '#EF4444',
      },
    },
  },
  plugins: [],
}
