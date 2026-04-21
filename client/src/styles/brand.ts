export const AFM_BRAND = {
  colors: {
    primary: "#40A8F5",
    secondary: "#62CFF7",
    accent: "#7CDFA7",
    highlight: "#6FEDAC",
    text: "#1A1A1A",
    textMuted: "#6B7280",
    background: "#FFFFFF",
    backgroundSoft: "#F5F7F9",
    border: "#D7E3EA",
  },
  gradient:
    "linear-gradient(90deg, #40A8F5 0%, #62CFF7 30%, #7CDFA7 60%, #6FEDAC 100%)",
  logoPath: "/aktive-afm-logo-clean.png",
} as const;

export function applyAfmBrandTheme(root: HTMLElement = document.documentElement) {
  root.style.setProperty("--primary-dark", AFM_BRAND.colors.primary);
  root.style.setProperty("--primary-mid", AFM_BRAND.colors.secondary);
  root.style.setProperty("--accent", AFM_BRAND.colors.accent);
  root.style.setProperty("--accent-light", AFM_BRAND.colors.highlight);
  root.style.setProperty("--border-soft", AFM_BRAND.colors.border);

  root.style.setProperty("--color-primary", AFM_BRAND.colors.primary);
  root.style.setProperty("--color-primary-hover", AFM_BRAND.colors.secondary);
  root.style.setProperty("--color-accent", AFM_BRAND.colors.accent);
  root.style.setProperty("--color-highlight", AFM_BRAND.colors.highlight);
  root.style.setProperty("--color-text", AFM_BRAND.colors.text);
  root.style.setProperty("--color-text-secondary", AFM_BRAND.colors.textMuted);
  root.style.setProperty("--color-text-muted", AFM_BRAND.colors.textMuted);
  root.style.setProperty("--color-bg", AFM_BRAND.colors.background);
  root.style.setProperty("--color-bg-soft", AFM_BRAND.colors.backgroundSoft);
  root.style.setProperty("--color-bg-section", AFM_BRAND.colors.backgroundSoft);
  root.style.setProperty("--color-border", AFM_BRAND.colors.border);

  root.style.setProperty("--brand-gradient", AFM_BRAND.gradient);
}
