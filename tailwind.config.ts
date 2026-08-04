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
        base: "#F7F6F3",
        ink: "#16161A",
        muted: "#8A8A92",
        dark: "#101014",
        bone: "#F2F0EB",
        hairline: "rgba(0,0,0,0.08)",
        hairlineDark: "rgba(255,255,255,0.12)",
        // Flat brand pink — same hex already used site-wide for the pink accent
        // (CTA glow, focus rings). The survey is the first place it's a
        // full-bleed background, so it gets a named token (bg-survey-bg /
        // --survey-bg via the addVariablesForColors plugin below).
        "survey-bg": "#D46FC8",
        // Same hue as survey-bg, lightness raised (HSL 307°, 54%, 63% ->
        // 80%) — the question/content panel's tone; the empty image-slot
        // panel keeps the stronger survey-bg unchanged.
        "survey-bg-soft": "#E8B0E1",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [addVariablesForColors, require('@tailwindcss/typography')],
};
export default config;
