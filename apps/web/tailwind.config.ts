import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        "bg-card": "#151515",
        line: "#262626",
        text: "#F2F2F2",
        "text-dim": "#8C8C8C",
        ok: "#5FA86B",
        busy: "#B4554F",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
} satisfies Config;
