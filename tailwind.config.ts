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
        background: "#000000",
        foreground: "#f5f5f7", // Apple's light text
        primary: "#00F0FF",
        secondary: "#7B2FFF",
        apple: {
          grey: "#86868b",
          dark: "#1d1d1f",
          blue: "#2997ff",
        },
        surface: "rgba(255, 255, 255, 0.04)",
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Display", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      backgroundImage: {
        "apple-gradient": "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
