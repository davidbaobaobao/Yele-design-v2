import type { Config } from "tailwindcss";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette").default;

function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
  addBase({ ":root": newVars });
}

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
      },
      colors: {
        bg: "#FFFFFF",
        "bg-secondary": "#F5F5F7",
        glass: "rgba(255,255,255,0.72)",
        "text-primary": "#1D1D1F",
        "text-secondary": "#86868B",
        accent: "#000000",
        interactive: "#0066CC",
        success: "#34C759",
        border: "rgba(0,0,0,0.08)",
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
        manrope: ["var(--font-manrope)", "sans-serif"],
      },
    },
  },
  plugins: [addVariablesForColors],
};
export default config;
