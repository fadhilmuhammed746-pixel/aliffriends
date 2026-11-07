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
        // Modern Editorial Luxury Color Tokens
        canvas: {
          DEFAULT: "#F7F6F0", // Primary Page Background
          warm: "#FAF9F5",    // Warm canvas tint
          muted: "#EFEFE8",   // Muted canvas tint
          dark: "#E8E7DF",
        },
        forest: {
          950: "#0A231D",     // Immersive Cinematic Background (Video Center, Lightbox, Hero Overlay)
          deep: "#0A231D",    // Deep brand tone
          DEFAULT: "#123C32", // Primary Brand Forest Green
          800: "#18453A",
          700: "#245C49",     // Secondary Green
          secondary: "#245C49",
          600: "#2E6F59",
          500: "#3D856D",
          100: "#E2ECE7",     // Light tint
          50: "#EFF5F2",      // Softest tint
        },
        coral: {
          DEFAULT: "#E66B4E", // Accent, CTAs, breaking tags, highlights
          light: "#F0876E",   // Light coral
          dark: "#C95034",    // Dark coral
          soft: "#FBE9E4",    // Soft coral tint
          50: "#FDF4F1",
        },
        ink: {
          DEFAULT: "#18231F", // Main text
          light: "#2B3A34",
          muted: "#758078",   // Secondary text
          subtle: "#9DA7A0",  // Subtle tertiary text
          wash: "#F0F2EF",
        },
        card: {
          DEFAULT: "#FFFFFF", // Card background
        },
        editorial: {
          card: "#FFFFFF",
          border: "#E6E7DF", // Hairline dividers & borders
          "border-dark": "#D5D7CC",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        cormorant: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        editorial: ["var(--font-cormorant)", "Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
      letterSpacing: {
        tag: ".18em",
        widest: ".18em",
        ultra: ".28em",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(18, 60, 50, 0.04), 0 1px 2px 0 rgba(18, 60, 50, 0.02)",
        editorial: "0 12px 32px -8px rgba(18, 60, 50, 0.08)",
        card: "0 2px 8px -2px rgba(18, 60, 50, 0.04), 0 8px 24px -4px rgba(18, 60, 50, 0.06)",
        lift: "0 20px 40px -12px rgba(18, 60, 50, 0.12)",
        magazine: "0 16px 36px -10px rgba(18, 60, 50, 0.18), 0 4px 12px -2px rgba(18, 60, 50, 0.08)",
        coral: "0 8px 24px -6px rgba(230, 107, 78, 0.28)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        fadeIn: "fadeIn 0.25s ease-out forwards",
        slideInRight: "slideInRight 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
