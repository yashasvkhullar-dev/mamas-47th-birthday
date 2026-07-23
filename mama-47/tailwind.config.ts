import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8F3",
        blush: "#FFD9E8",
        lavender: "#E7D9F7",
        gold: "#F4C77B",
        rose: "#8A4A5E",
      },
      fontFamily: {
        quicksand: ["var(--font-quicksand)", "sans-serif"],
        caveat: ["var(--font-caveat)", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
