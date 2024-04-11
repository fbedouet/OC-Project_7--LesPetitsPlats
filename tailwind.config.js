/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./css/tailwind_src/**/*.{html,js}", "./html/*.html"],
  theme: {
    extend: {
      fontFamily:{
        anton: 'Anton',
        manrope: 'Manrope, sans-serif',
      },
  
      backgroundImage:{
        'headerImage': "url('/assets/photos/Recette42.jpg')",
      },

      fontSize:{
        xl:'1.313',
        '5xl':'3rem'
      },

      colors:{
        'yellow':'#FFD15B',
        'grey':'#7A7A7A',
        'light_grey':'#C6C6C6',
      },
    },
  },
  plugins: [],
}

