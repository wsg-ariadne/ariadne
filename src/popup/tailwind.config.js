/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'adn-indigo': '#18134C',
      'adn-indigo-s': '#110D35',
      'adn-purple': '#8200FF',
      'adn-purple-s': '#470C85',
      'adn-cyan': '#06CDFF',
      'adn-cyan-s': '#0A6C8A',
    },
  },
  plugins: [],
}
