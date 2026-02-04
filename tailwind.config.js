/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
    backdropBlur: {
      xs: '2px',
    },
    colors: {
      glassWhite: "rgba(255,255,255,0.6)",
      glassBorder: "rgba(255,255,255,0.18)",
    }
  },
  },
  plugins: [],
}
