import type { Config } from "tailwindcss";

/* The reference is built on Tailwind's zinc scale, so the palette below is
   zinc under semantic names. Components use the names, never a hex. */
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09090b",
        body: "#52525b",
        muted: "#71717a",
        faint: "#a1a1aa",
        line: "#e4e4e7",
        wash: "#f4f4f5",
        page: "#fafafa",
        panel: "#18181b",
        night: "#111111",
      },
      fontFamily: {
        sans: ["Satoshi", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        display: "-0.05em",
        head: "-0.03em",
        snug: "-0.02em",
      },
      borderRadius: { card: "28px", tile: "22px" },
      boxShadow: {
        card: "0 1px 2px rgb(0 0 0 / .04), 0 12px 32px -12px rgb(0 0 0 / .12)",
        key: "inset 0 1px 0 rgb(255 255 255 / .08), inset 0 -2px 0 rgb(0 0 0 / .4), 0 2px 6px rgb(0 0 0 / .45)",
        keylight: "inset 0 1px 0 #fff, inset 0 -2px 0 rgb(0 0 0 / .08), 0 1px 2px rgb(0 0 0 / .08), 0 6px 14px -6px rgb(0 0 0 / .18)",
        glow: "0 0 0 1px rgb(255 255 255 / .6), 0 8px 30px rgb(255 255 255 / .18)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        rise: { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
        pulse2: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".35" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        rise: "rise .7s cubic-bezier(.16,1,.3,1) both",
        blink: "pulse2 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
