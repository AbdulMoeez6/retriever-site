/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#1B365D", 700: "#152A4A", 900: "#0B1729", 950: "#000F27" },
        page: "#F3F6F9",
        soft: "#EEF3F8",
        ink: "#0D1420",
        muted: "#4B5465",
        line: "#DCE3EC",
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', '"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        raised: "0 0 0 1px rgba(13,20,32,.06), 0 16px 32px -20px rgba(27,54,93,.5)",
      },
    },
  },
  plugins: [],
};
