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
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#0071E3",
          hover: "#147CE5",
          glow: "rgba(0, 113, 227, 0.4)",
        },
        apple: {
          grey: "#86868B",
          dark: "#1D1D1F",
          silver: "#F5F5F7",
          glass: "rgba(22, 22, 23, 0.72)",
        },
      },
      fontFamily: {
        sans: [
          "Inter", 
          "-apple-system", 
          "BlinkMacSystemFont", 
          "'SF Pro Display'", 
          "sans-serif"
        ],
      },
      backgroundImage: {
        'mesh-gradient': "radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'reveal': 'reveal 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      borderRadius: {
        'apple': '28px',
        'apple-pro': '40px',
      },
    },
  },
  plugins: [],
};
export default config;
