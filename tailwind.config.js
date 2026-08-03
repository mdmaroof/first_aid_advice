/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aid: {
          ink: "#122026",
          muted: "#4F646C",
          teal: "#0A6B6F",
          "teal-deep": "#085457",
          seafoam: "#1A8F98",
          emergency: "#B42318",
        },
      },
      backgroundImage: {
        "aid-page":
          "linear-gradient(160deg, #d9ecee 0%, #c5e0e4 38%, #b7d5db 100%)",
      },
      fontFamily: {
        quicksand: ["var(--font-quicksand)"],
        mulish: ["var(--font-mulish)"],
      },
    },
  },
  plugins: [],
};
