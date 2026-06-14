import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0B3D33",
          "bg-light": "#0e4a3d",
          gold: "#C9A96E",
          "gold-hover": "#d4b87a",
        },
      },
      fontFamily: {
        jost: ["var(--font-jost)", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
