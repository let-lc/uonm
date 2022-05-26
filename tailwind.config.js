module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tokyo Night colors by enkia
        "tk-night": "#1a1b26",
        "tk-storm": "#24283b",
        "tk-text": "#a9b1d6",
        "tk-red": "#f7768e",
        "tk-orange": "#ff9e64",
        "tk-sand": "#e0af68",
        "tk-grass": "#9ece6a",
        "tk-greenish": "#73daca",
        "tk-pale": "#b4f9f8",
        "tk-cyan": "#2ac3de",
        "tk-sky": "#7dcfff",
        "tk-blue": "#7aa2f7",
        "tk-purple": "#bb9af7",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
