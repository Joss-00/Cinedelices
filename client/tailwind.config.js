/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
        colors: {
          'cine-red': '#EB425B',
          'cine-bg': '#f5f5f7',
          'cine-bg-white': '#FFFFFF',
          'cine-stars': '#FFB703',
          'cine-text': '#020203',
        },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
