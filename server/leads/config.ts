import path from "path";

const PLACEHOLDER_VALUES = new Set([
  "",
  "https://hooks.example.com/proclean-leads",
  "https://crm.example.com/leads",
  "https://email.example.com/send-lead",
  "smtp.example.com",
  "notifications@example.com",
  "team@example.com",
]);

function readEnv(name: string, fallback = "") {
  return String(process.env[name] ?? fallback);
}

function readBooleanEnv(name: string, fallback = false) {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return String(value).toLowerCase() === "true";
}

function readNumberEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

const smtpPort = readNumberEnv("LEAD_SMTP_PORT", 587);
const smtpSecure = smtpPort === 465 || (smtpPort !== 587 && readBooleanEnv("LEAD_SMTP_SECURE", false));

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
    smtp: {
      host: readEnv("LEAD_SMTP_HOST", "smtp.example.com"),
      port: smtpPort,
      secure: smtpSecure,
      user: readEnv("LEAD_SMTP_USER"),
      password: readEnv("LEAD_SMTP_PASSWORD"),
      from: readEnv("LEAD_EMAIL_FROM", "notifications@example.com"),
      to: readEnv("LEAD_NOTIFICATION_TO", "team@example.com"),
    },
  },
} as const;

export function hasConfiguredLeadValue(value: string) {
  return !PLACEHOLDER_VALUES.has(value.trim());
}

export function hasConfiguredLeadSmtp() {
  return (
    hasConfiguredLeadValue(LEAD_SERVER_CONFIG.email.smtp.host)
    && hasConfiguredLeadValue(LEAD_SERVER_CONFIG.email.smtp.from)
    && hasConfiguredLeadValue(LEAD_SERVER_CONFIG.email.smtp.to)
    && Boolean(LEAD_SERVER_CONFIG.email.smtp.user.trim())
    && Boolean(LEAD_SERVER_CONFIG.email.smtp.password.trim())
  );
}
