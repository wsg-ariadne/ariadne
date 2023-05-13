/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'adn-light': '#F7F0F0',
        'adn-dark': '#2A272A',
        'adn-purple': '#B677FA',
        'adn-purple-dark': '#884ACC',
        'adn-turquoise': '#66CED6',
        'adn-teal': '#048BA8',
        'adn-border': '#C1B4C1',
        'adn-gray': '#ADA1AD',
        'adn-gray-dark': '#595359',
      },
      fontFamily: {
        'mono': ['IBM Plex Mono'],
        'sans': [
          '"IBM Plex Sans"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"'
        ],
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}
