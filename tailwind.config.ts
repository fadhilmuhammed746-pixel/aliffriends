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
        navy: {
          950: "#090d15",
          DEFAULT: "#101827", // Midnight Navy
          light: "#172338",
          dark: "#0b101b",
        },
        ivory: {
          50: "#ffffff",
          DEFAULT: "#F8F6F0", // Warm Ivory
          warm: "#FAF7EE",
          dark: "#ede8db",
          deep: "#e2dcce",
        },
        gold: {
          light: "#d9be85",
          DEFAULT: "#C8A96B", // Champagne Gold
          dark: "#a58543",
          deep: "#816429",
        },
        charcoal: {
          DEFAULT: "#17191F", // Deep Charcoal
          soft: "#23262f",
          deep: "#0f1014",
        },
        muted: {
          DEFAULT: "#858995", // Muted Grey
          light: "#a2a6b2",
          dark: "#5e616c",
        },
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Cinzel", "Playfair Display", "Georgia", "serif"],
        editorial: ["var(--font-cormorant)", "Cormorant Garamond", "Playfair Display", "serif"],
        sans: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: ".2em",
        ultra: ".3em",
      },
      boxShadow: {
        editorial: "0 20px 40px -15px rgba(16, 24, 39, 0.1)",
        gold: "0 10px 30px -10px rgba(200, 169, 107, 0.25)",
        card: "0 4px 20px -2px rgba(16, 24, 39, 0.05)",
        lift: "0 20px 30px -10px rgba(16, 24, 39, 0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
