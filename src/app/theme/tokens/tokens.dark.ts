export const tokensDark = {
  radii: {
    sm: "8px",
    md: "10px",
    lg: "14px",
  },

  font: {
    weightSemibold: "600",
  },

  colors: {
    /* Brand */
    primary: "#f97316",
    primaryHover: "#fdba74",
    primaryPressed: "#c2410c",

    /* Text */
    textBase: "#f1f5f9",
    textMuted: "#94a3b8",
    textDisabled: "#64748b",

    /* Surfaces */
    bodyBg: "#0a0a0b",
    cardBg: "#141417",
    cardBgElevated: "#1c1c21",

    /* Borders */
    border: "#26262b",
    borderStrong: "#3f3f46",

    overlayBg: "rgba(0,0,0,0.55)",
    panelBg: "rgba(20,20,23,0.88)",
    focusRing: "rgba(249,115,22,0.45)",

    typeChipBg: "rgba(255,255,255,0.06)",
    typeChipBorder: "rgba(255,255,255,0.10)",

    shadowSm: "0 10px 28px rgba(0,0,0,0.35)",
    shadowMd: "0 20px 60px rgba(0,0,0,0.45)",

    /* Für Fallbacks/Gradients in Cards */
    cardGradientTo: "rgba(255,255,255,0.06)",
  },
} as const;

export type TokensDark = typeof tokensDark;
