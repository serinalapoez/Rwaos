import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rwaos: {
          bg: "#0B0F14",
          panel: "#12181F",
          border: "#232B34",
          accent: "#3DD68C",
          accent2: "#5B8CFF",
          warn: "#E6B450",
          danger: "#E5484D",
          text: "#E6EDF3",
          muted: "#8B98A5",
        },
      },
    },
  },
  plugins: [],
};

export default config;
