/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#3AA04B',
        'primary-green-dark': '#2E7D3A',
        'primary-green-light': '#4FB35F',
        'ethio-blue': '#004792',
        'telecom-cyan': '#00AEEF',
        'pattern-green': '#047155',
      },
      fontFamily: {
        sans: ['Ebrima', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}

