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
          bg: "#101815",
          panel: "#17211C",
          border: "#2A362E",
          accent: "#C9A15A",
          accent2: "#4FA9A2",
          warn: "#B4552F",
          danger: "#B23B3B",
          text: "#EDE6D8",
          muted: "#93998F",
        },
      },
      fontFamily: {
        serif: ['"Newsreader"', "serif"],
        sans: ['"IBM Plex Sans"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
