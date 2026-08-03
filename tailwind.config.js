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
          ink: "#14242A",
          muted: "#5B6F76",
          line: "#D5E2E6",
          mist: "#EEF5F6",
          surface: "#F7FBFC",
          teal: "#0D7377",
          "teal-deep": "#095E61",
          seafoam: "#14919B",
          emergency: "#B42318",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "aid-page":
          "radial-gradient(ellipse 90% 60% at 10% -10%, rgba(20,145,155,0.14), transparent 50%), radial-gradient(ellipse 70% 50% at 100% 0%, rgba(13,115,119,0.1), transparent 45%), linear-gradient(180deg, #F4FAFB 0%, #E8F2F3 100%)",
      },
      fontFamily: {
        quicksand: ["var(--font-quicksand)"],
        mulish: ["var(--font-mulish)"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s ease-out both",
      },
    },
  },
  plugins: [],
};
