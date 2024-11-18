import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      backgroundColor: {
        "true-blue": "#035bbc", 
      }
    },
  },
  darkMode: "class",
  plugins: [nextui({
    
    themes: {
      light: {
      
        colors: {
          // background: '#7c3aed', 
          // foreground: "#11181C", 
          primary: {
           
            foreground: "#FFFFFF",
            DEFAULT: '#7c3aed',

        },
          
        },
      },
      dark: {
        colors: {
          // background: '#7c3aed', 
          // foreground: "#11181C", 
          primary: {
           
            foreground: "#FFFFFF",
            DEFAULT: '#7c3aed',

        },
          
        },
      },
      
    },
  })],
}
