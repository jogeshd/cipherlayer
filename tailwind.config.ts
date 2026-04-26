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
        background: "#050810",
        foreground: "#E8F0FF",
        primary: {
          DEFAULT: "#00F0FF",
          glow: "rgba(0, 240, 255, 0.15)",
        },
        secondary: "#7B2FFF",
        danger: "#FF2D55",
        muted: "#6B7FA3",
        surface: "rgba(255, 255, 255, 0.04)",
      },
      fontFamily: {
        mono: ["Space Mono", "monospace"],
        sans: ["DM Sans", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "cyber-grid": "linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)",
      },
      animation: {
        "pulse-cyan": "pulse-cyan 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scan-line 3s linear infinite",
      },
      keyframes: {
        "pulse-cyan": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(0, 240, 255, 0.3)" },
          "50%": { opacity: "0.5", boxShadow: "0 0 10px rgba(0, 240, 255, 0.1)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
