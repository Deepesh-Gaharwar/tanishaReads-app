/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

const config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#5e2b97', // deep purple
        background: '#f3f0f7',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
      backgroundImage: {
        'literature-gradient': 'linear-gradient(to bottom right, #5e2b97, #3c1361, #1a032b)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        tanishaTheme: {
          "primary": "#5e2b97",
          "secondary": "#8f5cc1",
          "accent": "#d1a9f2",
          "neutral": "#1f1b24",
          "base-100": "#f3f0f7",
          "info": "#a5b4fc",
          "success": "#86efac",
          "warning": "#facc15",
          "error": "#f87171",
        }
      }
    ],
  },
};

export default config;
