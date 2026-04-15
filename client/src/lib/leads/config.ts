const PLACEHOLDER_VALUES = new Set([
  "",
  "https://hooks.example.com/proclean-leads",
  "https://crm.example.com/leads",
  "https://email.example.com/send-lead",
]);

function readEnv(name: string, fallback = "") {
  return String(import.meta.env[name] ?? fallback);
}

function readBooleanEnv(name: string, fallback = false) {
  const value = import.meta.env[name];
  if (value === undefined) return fallback;
  return String(value).toLowerCase() === "true";
}

export const LEAD_SUBMISSION_CONFIG = {
  apiEndpoint: readEnv("VITE_LEAD_API_ENDPOINT", "/api/leads"),
  providers: {
    webhook: {
      enabled: readBooleanEnv("VITE_LEAD_WEBHOOK_ENABLED", false),
      endpoint: readEnv("VITE_LEAD_WEBHOOK_ENDPOINT", "https://hooks.example.com/proclean-leads"),
    },
    crm: {
      enabled: readBooleanEnv("VITE_LEAD_CRM_ENABLED", false),
      endpoint: readEnv("VITE_LEAD_CRM_ENDPOINT", "https://crm.example.com/leads"),
      provider: readEnv("VITE_LEAD_CRM_PROVIDER", "placeholder"),
    },
    email: {
      enabled: readBooleanEnv("VITE_LEAD_EMAIL_ENABLED", false),
      endpoint: readEnv("VITE_LEAD_EMAIL_ENDPOINT", "https://email.example.com/send-lead"),
      provider: readEnv("VITE_LEAD_EMAIL_PROVIDER", "placeholder"),
    },
  },
} as const;

export function hasConfiguredLeadValue(value: string) {
  return !PLACEHOLDER_VALUES.has(value.trim());
}
