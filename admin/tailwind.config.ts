import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Jost", "sans-serif"] },
      colors: {
        brand: {
          green: "#0B3D33",
          gold: "#C9A96E",
          sidebar: "#0B3D33",
          content: "#F5F3EE",
          card: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};

export default config;
