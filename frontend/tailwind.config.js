/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          900: "#0a0b0f",
          800: "#12141c",
          700: "#1a1d28",
          600: "#232736",
          border: "#2d3344",
        },
        accent: {
          DEFAULT: "#6366f1",
          muted: "#818cf8",
          glow: "rgba(99, 102, 241, 0.35)",
        },
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px -12px rgba(0,0,0,0.5)",
        glow: "0 0 40px -10px var(--tw-shadow-color)",
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};
