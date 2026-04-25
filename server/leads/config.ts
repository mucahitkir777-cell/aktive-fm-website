import path from "path";

const PLACEHOLDER_VALUES = new Set([
  "",
  "https://hooks.example.com/proclean-leads",
  "https://crm.example.com/leads",
  "https://email.example.com/send-lead",
  "smtp.example.com",
  "notifications@example.com",
  "team@example.com",
  "your-brevo-api-key",
]);

function readEnv(name: string, fallback = "") {
  return String(process.env[name] ?? fallback);
}

function readBooleanEnv(name: string, fallback = false) {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return String(value).toLowerCase() === "true";
}

export const LEAD_SERVER_CONFIG = {
  inbox: {
    enabled: readBooleanEnv("LEAD_INBOX_ENABLED", false),
    filePath: readEnv("LEAD_INBOX_FILE", path.resolve(process.cwd(), "data", "leads.jsonl")),
  },
  webhook: {
    enabled: readBooleanEnv("LEAD_WEBHOOK_ENABLED", false),
    endpoint: readEnv("LEAD_WEBHOOK_ENDPOINT", "https://hooks.example.com/proclean-leads"),
  },
  crm: {
    enabled: readBooleanEnv("LEAD_CRM_ENABLED", false),
    endpoint: readEnv("LEAD_CRM_ENDPOINT", "https://crm.example.com/leads"),
    provider: readEnv("LEAD_CRM_PROVIDER", "placeholder"),
  },
  email: {
    enabled: readBooleanEnv("LEAD_EMAIL_ENABLED", false),
    notification: {
      enabled: readBooleanEnv("LEAD_EMAIL_NOTIFICATION_ENABLED", false),
    },
    confirmation: {
      enabled: readBooleanEnv("LEAD_EMAIL_CONFIRMATION_ENABLED", false),
    },
    endpoint: readEnv("LEAD_EMAIL_ENDPOINT", "https://email.example.com/send-lead"),
    provider: readEnv("LEAD_EMAIL_PROVIDER", "placeholder"),
    from: readEnv("LEAD_EMAIL_FROM", "notifications@example.com"),
    to: readEnv("LEAD_NOTIFICATION_TO", "team@example.com"),
    brevo: {
      apiKey: readEnv("BREVO_API_KEY"),
    },
  },
} as const;

export function hasConfiguredLeadValue(value: string) {
  return !PLACEHOLDER_VALUES.has(value.trim());
}

export function hasConfiguredLeadBrevo() {
  return (
    hasConfiguredLeadValue(LEAD_SERVER_CONFIG.email.brevo.apiKey)
    && hasConfiguredLeadValue(LEAD_SERVER_CONFIG.email.from)
    && hasConfiguredLeadValue(LEAD_SERVER_CONFIG.email.to)
  );
}
