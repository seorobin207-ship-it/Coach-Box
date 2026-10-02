/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/app/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'primary-main': '#FF6315',
        'primary-lighter': '#FFE3D1',
        'primary-light': '#FFA570',
        'primary-dark': '#CC4B00',
        'primary-darker': '#8A3700',
        'secondary-dark': '#47338F',
        'secondary-lighter': '#E0D9F2',
        'secondary-main': '#5542BB',
        primary: '#212B36',
        secondary: '#637381',
        neutral: '#F4F6F8',
        'bg-main': '#F0FDF4',
        'bg-secondary': '#afe6d9',
        'quaternary-main': '#DA8D58',
      },
    },
  },
  plugins: [],
}
