/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#F6F7F2',              // Exact screenshot page background
          card: '#FFFFFF',            // Main middle cards background
          cardMuted: '#F1F4ED',       // Exact right sidebar cards background
          border: '#E2E7DE',          // Exact subtle border line
          borderLight: '#EAEBE6',     // Header bottom border
          text: '#1F322C',            // Exact deep spruce-black headline
          muted: '#5E7067',           // Exact subtitle text
          subtle: '#7C8B82',          // Exact small uppercase labels
          accent: '#3E6F58',          // Exact logo forest green
          accentHover: '#335C49',
          activePill: '#E7EDE4',      // Exact "Today's studio" active background
          badgeBg: '#FAF7ED',         // Exact "NOT CONNECTED" badge background
          badgeBorder: '#EFEAD8',
          badgeText: '#966A38',       // Warm amber text
          orangeDot: '#E66E43',       // Orange accent dot
          constellation: '#DBE8D7',   // Star circle background
        }
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        serif: ['Georgia', 'Cambria', 'serif']
      }
    },
  },
  plugins: [],
}
