import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF8F3",
        "paper-dim": "#F1EEE5",
        ink: "#1B1E27",
        "ink-soft": "#4B5060",
        line: "#DAD4C4",
        slate: {
          DEFAULT: "#33415C",
          deep: "#232C40",
        },
        gold: "#B08A2E",
        rust: "#9A3B2C",
        moss: "#3F5A45",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(27,30,39,0.06) 1px, transparent 0)",
      },
      backgroundSize: {
        grain: "14px 14px",
      },
    },
  },
  plugins: [],
};
export default config;
