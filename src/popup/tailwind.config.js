/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'adn-light': '#F7F0F0',
        'adn-dark': '#2A272A',
        'adn-purple': '#B677FA',
        'adn-turquoise': '#66CED6',
        'adn-teal': '#048BA8',
        'adn-border': '#C1B4C1',
      },
      fontFamily: {
        'mono': ['IBM Plex Mono'],
        'sans': ['IBM Plex Sans'],
      }
    },
  },
  plugins: [],
}
