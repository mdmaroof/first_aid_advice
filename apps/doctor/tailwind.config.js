/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "../../packages/ui/src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { aid: { ink: "#122026", muted: "#4F646C", teal: "#0A6B6F", "teal-deep": "#085457", seafoam: "#1A8F98", emergency: "#B42318" } },
      fontFamily: { quicksand: ["var(--font-quicksand)"], mulish: ["var(--font-mulish)"] },
    },
  },
  plugins: [],
};
