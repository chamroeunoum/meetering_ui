/**
 * Tailwind CSS v3 Configuration
 *
 * Scans .vue, .js, .ts, .jsx, and .tsx files for utility class usage.
 * Includes custom font-size, background-size, and scale extensions
 * for the meeting management UI (Khmer typography, TV display sizes).
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  darkMode: false, // NaiveUI + CSS variables handle theming — not Tailwind
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // UPDATED: added .vue to content glob so Tailwind scans SFCs
  ],
  theme: {
    extend: {
      fontSize: {
        'xxxxxs' : '.3rem' ,
        'xxxxs' : '.4rem' ,
        'xxxs' : '.5rem' ,
        'xxs' : '.6rem' ,
      },
      backgroundSize: {
          '90%': '90%' ,
          '85%': '85%' ,
          '80%': '80%' ,
          '75%': '75%' ,
          '50%': '50%' ,
          '25%': '25%' ,
          '10%': '10%' ,
          '10px': '10px' ,
          '20px': '20px' ,
          '30px': '30px' ,
          '40px': '40px' ,
          '50px': '50px' ,
          '60px': '60px'
      },
      /** UPDATED: Added scale '120' for .hover-enlarge-120 utility */
      scale: {
        '120': '1.20',
      },
    },
  },
  plugins: [
    // require('@tailwindcss/line-clamp'),
  ],
}
