/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Barrels Brand Colors (High Contrast)
        'barrels-red': '#FF0000',      // Primary Action
        'barrels-black': '#000000',    // Background
        'barrels-grey': '#1A1A1A',     // Surface/Card
        'barrels-text': '#FFFFFF',     // Headings
        'barrels-text-dim': '#A3A3A3', // Body

        // Legacy/Aliases (Mapped to new system to prevent breaking existing components immediately)
        'cb-gold': '#FF0000',          // Mapping Gold -> Red
        'cb-gold-dark': '#CC0000',
        'cb-dark': '#000000',          // Mapping Dark Blue -> Black
        'cb-dark-card': '#1A1A1A',     // Mapping Card -> Dark Charcoal
        'cb-dark-accent': '#333333',   // lighter grey

        // Score Colors (Kept for functional feedback)
        'score-excellent': '#10B981',
        'score-good': '#FF0000', // Red is good now? Or keep standard traffic light? Keeping traffic light for scores, but maybe adjust 'good' to specific brand feelings later.
        'score-average': '#F59E0b',
        'score-needs-work': '#EF4444',
      },
      borderRadius: {
        'barrels': '0px', // Sharp corners
      },
      fontFamily: {
        'barrels': ['Inter', 'sans-serif'], // We will assume Inter is loaded or fallback to sans
      },
    },
  },
  plugins: [],
}
