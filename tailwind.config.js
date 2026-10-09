/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F6F0E1',
        forest: '#1E3A2F',
        terracotta: '#B4533A',
        sage: '#DCE4D2'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Public Sans', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Newsreader', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
};
