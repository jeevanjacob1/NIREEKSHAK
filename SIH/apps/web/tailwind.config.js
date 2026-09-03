/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './investigation/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gruv: {
          bgHard: '#101514',
          bg: '#141b1a',
          panel: '#1a2321',
          surface: '#202b29',
          border: '#2c3b38',
          borderLight: '#3a4e4a',
          fg: '#ebdbb2',
          fgMuted: '#d5c4a1',
          gray: '#839490',
          orange: '#fe8019',
          amber: '#fabd2f',
          red: '#fb4934',
        },
        jade: {
          glow: '#2dd4bf',
          mint: '#5eead4',
          emerald: '#10b981',
          deep: '#0f766e',
          dim: '#134e4a',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
