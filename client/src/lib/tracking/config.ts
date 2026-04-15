import { companyConfig } from "@/config/company";

const PLACEHOLDER_VALUES = new Set([
  "",
  "G-XXXXXXXXXX",
  "GTM-XXXXXXX",
  "UMAMI-WEBSITE-ID",
  "https://analytics.example.com/script.js",
  "https://crm.example.com/leads",
  "YOUR_HEATMAP_PROJECT_ID",
]);

function readEnv(name: string, fallback = "") {
  return String(import.meta.env[name] ?? fallback);
}

function readBooleanEnv(name: string, fallback = false) {
  const value = import.meta.env[name];
  if (value === undefined) return fallback;
  return String(value).toLowerCase() === "true";
}

export const TRACKING_CONFIG = {
  siteName: companyConfig.brand.name,
  debug: readBooleanEnv("VITE_TRACKING_DEBUG", import.meta.env.DEV),
  consent: {
    requireAnalyticsConsentForExternalDestinations: true,
  },
  storage: {
    sessionIdKey: "proclean_tracking_session_id",
    firstTouchUtmKey: "proclean_first_touch_utm",
    lastTouchUtmKey: "proclean_last_touch_utm",
  },
  destinations: {
    ga4: {
      enabled: readBooleanEnv("VITE_GA4_ENABLED", true),
      measurementId: readEnv("VITE_GA4_MEASUREMENT_ID", "G-RM3SBZCP0G"),
      debug: readBooleanEnv("VITE_GA4_DEBUG", import.meta.env.DEV),
    },
    gtm: {
      enabled: readBooleanEnv("VITE_GTM_ENABLED", false),
      containerId: readEnv("VITE_GTM_CONTAINER_ID", "GTM-XXXXXXX"),
    },
    umami: {
      enabled: readBooleanEnv("VITE_UMAMI_ENABLED", false),
      websiteId: readEnv("VITE_UMAMI_WEBSITE_ID", "UMAMI-WEBSITE-ID"),
      scriptUrl: readEnv("VITE_UMAMI_SCRIPT_URL", "https://analytics.example.com/script.js"),
    },
    heatmap: {
      enabled: readBooleanEnv("VITE_HEATMAP_ENABLED", false),
      provider: readEnv("VITE_HEATMAP_PROVIDER", "placeholder"),
      projectId: readEnv("VITE_HEATMAP_PROJECT_ID", "YOUR_HEATMAP_PROJECT_ID"),
    },
    crm: {
      enabled: readBooleanEnv("VITE_CRM_TRACKING_ENABLED", false),
      leadEndpoint: readEnv("VITE_CRM_LEAD_ENDPOINT", "https://crm.example.com/leads"),
    },
  },
} as const;

export function hasConfiguredValue(value: string) {
  return !PLACEHOLDER_VALUES.has(value.trim());
}
