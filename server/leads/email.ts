import type { LeadProviderResult, LeadSubmissionPayload } from "@shared/lead";
import SibApiV3Sdk from "sib-api-v3-sdk";
import { LEAD_SERVER_CONFIG, hasConfiguredLeadBrevo, hasConfiguredLeadValue } from "./config";

interface StoredLeadEmailInput {
  leadId: string;
  receivedAt: string;
  payload: LeadSubmissionPayload;
}

let transactionalEmailApi: InstanceType<typeof SibApiV3Sdk.TransactionalEmailsApi> | null = null;

/**
 * Strukturiertes Logging für E-Mail-Events
 * Gibt keine sensiblen Daten wie SMTP-Passwort aus
 */
function logEmailEvent(level: "info" | "warn" | "error", leadId: string, mailType: "notification" | "confirmation", status: string, details?: string) {
  const timestamp = new Date().toISOString();
  const message = `[lead-email] [${timestamp}] [${mailType}] [${leadId}] ${status}${details ? ` - ${details}` : ""}`;

  if (level === "error") {
    console.error(message);
  } else if (level === "warn") {
    console.warn(message);
  } else {
    console.info(message);
  }
}

function getTransactionalEmailApi() {
  if (transactionalEmailApi) {
    return transactionalEmailApi;
  }

  const apiClient = SibApiV3Sdk.ApiClient.instance;
  apiClient.authentications["api-key"].apiKey = LEAD_SERVER_CONFIG.email.brevo.apiKey;

  transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
  return transactionalEmailApi;
}

async function sendBrevoTransactionalEmail(input: {
  to: string;
  subject: string;
  textContent: string;
  htmlContent: string;
}) {
  const apiInstance = getTransactionalEmailApi();

  await apiInstance.sendTransacEmail({
    sender: {
      email: LEAD_SERVER_CONFIG.email.smtp.from,
      name: "Aktive FM",
    },
    to: [{ email: input.to }],
    subject: input.subject,
    textContent: input.textContent,
    htmlContent: input.htmlContent,
  });
}

function buildNotificationText(input: StoredLeadEmailInput) {
  const { payload } = input;

  return [
    "Neuer Lead eingegangen",
    "",
    `Name: ${payload.name}`,
    `E-Mail: ${payload.email}`,
    `Telefon: ${payload.phone}`,
    `Zeitstempel: ${input.receivedAt}`,
    "",
    payload.regionLabel ? `Region: ${payload.regionLabel}` : "",
    payload.serviceLabel ? `Leistung: ${payload.serviceLabel}` : "",
    "",
    "Nachricht:",
    payload.message?.trim() || "Keine Nachricht angegeben.",
    "",
    "Hinweis: Der Lead ist im Adminbereich unter /admin/leads verfügbar.",
    `Lead-ID: ${input.leadId}`,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function buildNotificationHtml(input: StoredLeadEmailInput) {
  const { payload } = input;
  const receivedDate = new Date(input.receivedAt).toLocaleString("de-DE");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
    .field-group { margin-bottom: 16px; }
    .label { font-weight: bold; color: #667eea; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .value { color: #333; margin-top: 4px; word-break: break-word; }
    .message-box { background: #ffffff; border-left: 4px solid #667eea; padding: 12px; margin-top: 12px; }
    .admin-link { background: #667eea; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 16px; }
    .footer { background: #f0f0f0; padding: 12px; text-align: center; font-size: 12px; color: #666; border-radius: 4px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Neuer Lead eingegangen</h1>
    </div>
    <div class="content">
      <div class="field-group">
        <div class="label">Name</div>
        <div class="value">${payload.name}</div>
      </div>
      <div class="field-group">
        <div class="label">E-Mail</div>
        <div class="value"><a href="mailto:${payload.email}">${payload.email}</a></div>
      </div>
      <div class="field-group">
        <div class="label">Telefon</div>
        <div class="value"><a href="tel:${payload.phone}">${payload.phone}</a></div>
      </div>
      ${payload.regionLabel ? `<div class="field-group"><div class="label">Region</div><div class="value">${payload.regionLabel}</div></div>` : ""}
      ${payload.serviceLabel ? `<div class="field-group"><div class="label">Leistung</div><div class="value">${payload.serviceLabel}</div></div>` : ""}
      <div class="field-group">
        <div class="label">Zeitpunkt</div>
        <div class="value">${receivedDate}</div>
      </div>
      ${
        payload.message
          ? `<div class="field-group"><div class="label">Nachricht</div><div class="message-box">${payload.message}</div></div>`
          : ""
      }
      <a href="https://www.aktive-fm.de/admin/leads" class="admin-link">Lead im Admin öffnen</a>
      <div class="footer">
        Lead-ID: <strong>${input.leadId}</strong>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function buildConfirmationText(input: StoredLeadEmailInput) {
  const { payload } = input;

  return [
    `Hallo ${payload.name},`,
    "",
    "vielen Dank für Ihre Anfrage! Wir haben Ihre Nachricht erhalten und werden uns in Kürze mit Ihnen in Verbindung setzen.",
    "",
    "Ihre Anfrage:",
    `- Name: ${payload.name}`,
    `- Telefon: ${payload.phone}`,
    `- E-Mail: ${payload.email}`,
    payload.message ? `- Nachricht: ${payload.message.trim()}` : "",
    "",
    "Falls Sie weitere Fragen haben, können Sie uns gerne kontaktieren:",
    "E-Mail: info@aktive-fm.de",
    "Telefon: +49 (0) 621 123 456",
    "",
    "Viele Grüße",
    "Ihr Team von aktive-FM",
    "",
    `(Lead-ID: ${input.leadId})`,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function buildConfirmationHtml(input: StoredLeadEmailInput) {
  const { payload } = input;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
    .greeting { font-size: 16px; margin-bottom: 16px; }
    .summary-box { background: #ffffff; border-left: 4px solid #667eea; padding: 16px; margin: 20px 0; }
    .summary-label { font-size: 12px; font-weight: bold; color: #667eea; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .summary-item { margin-bottom: 8px; }
    .summary-item-label { font-weight: bold; color: #555; }
    .contact-box { background: #f0f0f0; padding: 16px; border-radius: 4px; margin: 20px 0; }
    .contact-label { font-size: 12px; font-weight: bold; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .contact-item { margin-bottom: 8px; }
    .contact-item a { color: #667eea; text-decoration: none; }
    .footer { background: #f0f0f0; padding: 12px; text-align: center; font-size: 12px; color: #666; border-radius: 4px; margin-top: 16px; }
    .signature { margin-top: 20px; }
    .signature-name { font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Bestätigung Ihrer Anfrage</h1>
    </div>
    <div class="content">
      <div class="greeting">
        Hallo ${payload.name},<br>
        <br>
        vielen Dank für Ihre Anfrage! Wir haben Ihre Nachricht erhalten und werden uns in Kürze mit Ihnen in Verbindung setzen.
      </div>

      <div class="summary-box">
        <div class="summary-label">Ihre Anfrage</div>
        <div class="summary-item">
          <span class="summary-item-label">Name:</span> ${payload.name}
        </div>
        <div class="summary-item">
          <span class="summary-item-label">Telefon:</span> ${payload.phone}
        </div>
        <div class="summary-item">
          <span class="summary-item-label">E-Mail:</span> ${payload.email}
        </div>
        ${
          payload.message
            ? `<div class="summary-item"><span class="summary-item-label">Nachricht:</span><br>${payload.message}</div>`
            : ""
        }
      </div>

      <div class="contact-box">
        <div class="contact-label">Kontaktieren Sie uns</div>
        <div class="contact-item">
          <strong>E-Mail:</strong> <a href="mailto:info@aktive-fm.de">info@aktive-fm.de</a>
        </div>
        <div class="contact-item">
          <strong>Telefon:</strong> <a href="tel:+49621123456">+49 (0) 621 123 456</a>
        </div>
        <div class="contact-item">
          <strong>Web:</strong> <a href="https://www.aktive-fm.de">www.aktive-fm.de</a>
        </div>
      </div>

      <div class="signature">
        <p>Viele Grüße<br>
        <span class="signature-name">Ihr Team von aktive-FM</span></p>
      </div>

      <div class="footer">
        Lead-ID: <strong>${input.leadId}</strong>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

async function sendLeadNotificationEmail(input: StoredLeadEmailInput): Promise<LeadProviderResult> {
  if (!hasConfiguredLeadBrevo()) {
    logEmailEvent("info", input.leadId, "notification", "SKIPPED", "Brevo API not configured");
    return {
      provider: "email",
      status: "skipped",
      message: "Brevo notification is not configured.",
    };
  }

  try {
    await sendBrevoTransactionalEmail({
      to: LEAD_SERVER_CONFIG.email.smtp.to,
      subject: `Neuer Lead: ${input.payload.name}`,
      textContent: buildNotificationText(input),
      htmlContent: buildNotificationHtml(input),
    });

    logEmailEvent("info", input.leadId, "notification", "SENT");
    return {
      provider: "email",
      status: "success",
      message: "Lead notification email sent.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Brevo email send failed.";
    logEmailEvent("error", input.leadId, "notification", "FAILED", message);

    return {
      provider: "email",
      status: "error",
      message,
    };
  }
}

async function sendLeadConfirmationEmailToLead(input: StoredLeadEmailInput): Promise<LeadProviderResult> {
  if (!hasConfiguredLeadBrevo()) {
    logEmailEvent("info", input.leadId, "confirmation", "SKIPPED", "Brevo API not configured");
    return {
      provider: "email_confirmation",
      status: "skipped",
      message: "Brevo confirmation is not configured.",
    };
  }

  try {
    await sendBrevoTransactionalEmail({
      to: input.payload.email,
      subject: "Bestätigung Ihrer Anfrage – aktive-FM",
      textContent: buildConfirmationText(input),
      htmlContent: buildConfirmationHtml(input),
    });

    logEmailEvent("info", input.leadId, "confirmation", "SENT");
    return {
      provider: "email_confirmation",
      status: "success",
      message: "Confirmation email sent to lead.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Brevo confirmation email send failed.";
    logEmailEvent("error", input.leadId, "confirmation", "FAILED", message);

    return {
      provider: "email_confirmation",
      status: "error",
      message,
    };
  }
}

async function postLeadNotificationEndpoint(input: StoredLeadEmailInput): Promise<LeadProviderResult> {
  if (!hasConfiguredLeadValue(LEAD_SERVER_CONFIG.email.endpoint)) {
    logEmailEvent("info", input.leadId, "notification", "SKIPPED", "Email endpoint not configured");
    return {
      provider: "email",
      status: "skipped",
      message: "Email endpoint is not configured.",
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(LEAD_SERVER_CONFIG.email.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
        signal: controller.signal,
      });

      if (!response.ok) {
        const message = `email responded with ${response.status}.`;
        logEmailEvent("warn", input.leadId, "notification", "FAILED", message);
        return {
          provider: "email",
          status: "error",
          message,
        };
      }

      logEmailEvent("info", input.leadId, "notification", "SENT via endpoint");
      return {
        provider: "email",
        status: "success",
        message: "Email endpoint accepted the lead.",
      };
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      const message = "Email endpoint request timed out (10s).";
      logEmailEvent("error", input.leadId, "notification", "FAILED", message);
      return {
        provider: "email",
        status: "error",
        message,
      };
    }
    const message = error instanceof Error ? error.message : "Email endpoint request failed.";
    logEmailEvent("error", input.leadId, "notification", "FAILED", message);

    return {
      provider: "email",
      status: "error",
      message,
    };
  }
}

export async function deliverLeadNotification(input: StoredLeadEmailInput): Promise<LeadProviderResult> {
  if (!LEAD_SERVER_CONFIG.email.enabled) {
    logEmailEvent("info", input.leadId, "notification", "DISABLED", "Email feature disabled globally");
    return {
      provider: "email",
      status: "skipped",
      message: "Lead notification email is disabled globally.",
    };
  }

  if (!LEAD_SERVER_CONFIG.email.notification.enabled) {
    logEmailEvent("info", input.leadId, "notification", "DISABLED", "Notification feature disabled");
    return {
      provider: "email",
      status: "skipped",
      message: "Lead team notification is disabled.",
    };
  }

  if (hasConfiguredLeadBrevo()) {
    return sendLeadNotificationEmail(input);
  }

  return postLeadNotificationEndpoint(input);
}

export async function deliverLeadConfirmation(input: StoredLeadEmailInput): Promise<LeadProviderResult> {
  if (!LEAD_SERVER_CONFIG.email.enabled) {
    logEmailEvent("info", input.leadId, "confirmation", "DISABLED", "Email feature disabled globally");
    return {
      provider: "email_confirmation",
      status: "skipped",
      message: "Lead confirmation email is disabled globally.",
    };
  }

  if (!LEAD_SERVER_CONFIG.email.confirmation.enabled) {
    logEmailEvent("info", input.leadId, "confirmation", "DISABLED", "Confirmation feature disabled");
    return {
      provider: "email_confirmation",
      status: "skipped",
      message: "Lead confirmation email is disabled.",
    };
  }

  return sendLeadConfirmationEmailToLead(input);
}
