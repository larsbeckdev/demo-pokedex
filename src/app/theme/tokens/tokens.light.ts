export const tokensLight = {
  radii: {
    sm: "8px",
    md: "10px",
    lg: "14px",
  },

  font: {
    familyBody:
      '"Geist Variable", system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    familyHeading:
      '"Geist Variable", system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    weightSemibold: "600",
  },

  colors: {
    /* Brand */
    primary: "#f97316",
    primaryHover: "#fb923c",
    primaryPressed: "#ea580c",

    /* Text */
    textBase: "#020617",
    textMuted: "#334155",
    textDisabled: "#64748b",

    /* Backgrounds */
    bodyBg: "#f1f5f9",
    cardBg: "#ffffff",
    cardBgElevated: "#e5e7eb",

    /* Borders */
    border: "#cbd5e1",
    borderStrong: "#94a3b8",

    /* Additions */
    overlayBg: "rgba(2,6,23,0.40)", 
    panelBg: "rgba(255,255,255,0.92)", 
    focusRing: "rgba(249,115,22,0.35)",

    typeChipBg: "rgba(2,6,23,0.04)",
    typeChipBorder: "rgba(2,6,23,0.10)",

    shadowSm: "0 10px 28px rgba(2,6,23,0.10)",
    shadowMd: "0 20px 60px rgba(2,6,23,0.16)",

    cardGradientTo: "rgba(2,6,23,0.04)",
  },
} as const;

export type TokensLight = typeof tokensLight;
