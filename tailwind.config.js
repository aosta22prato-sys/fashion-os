/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./App.tsx",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./resources/**/*.{js,ts,jsx,tsx}",
    "./AIOperationsCenter.tsx"
  ],
  theme: {
    extend: {
      colors: {
        'brand-beige': '#F5F2ED',
        'brand-ink': '#1A1A1A',
        'background': '#ffffff',
        'text': '#111111',
        'accent': '#c5a880',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [
    function({ addVariant }) {
      addVariant('en', '&:lang(en)');
      addVariant('zh', '&:lang(zh)');
    }
  ],
}
