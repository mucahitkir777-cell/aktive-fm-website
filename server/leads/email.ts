import nodemailer from "nodemailer";
import type { LeadProviderResult, LeadSubmissionPayload } from "@shared/lead";
import { LEAD_SERVER_CONFIG, hasConfiguredLeadSmtp, hasConfiguredLeadValue } from "./config";

interface StoredLeadEmailInput {
  leadId: string;
  receivedAt: string;
  payload: LeadSubmissionPayload;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: LEAD_SERVER_CONFIG.email.smtp.host,
    port: LEAD_SERVER_CONFIG.email.smtp.port,
    secure: LEAD_SERVER_CONFIG.email.smtp.secure,
    auth: {
      user: LEAD_SERVER_CONFIG.email.smtp.user,
      pass: LEAD_SERVER_CONFIG.email.smtp.password,
    },
  });

  return transporter;
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
    "Nachricht:",
    payload.message?.trim() || "Keine Nachricht angegeben.",
    "",
    "Hinweis: Der Lead ist im Adminbereich unter /admin/leads verfügbar.",
    `Lead-ID: ${input.leadId}`,
  ].join("\n");
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
    "Falls Sie weitere Fragen haben, können Sie uns gerne kontaktieren.",
    "",
    "Viele Grüße",
    "Ihr Team von aktive-FM",
    "",
    `(Lead-ID: ${input.leadId})`,
  ].filter((line) => line !== "").join("\n");
}

async function sendLeadNotificationEmail(input: StoredLeadEmailInput): Promise<LeadProviderResult> {
  if (!hasConfiguredLeadSmtp()) {
    return {
      provider: "email",
      status: "skipped",
      message: "SMTP notification is not configured.",
    };
  }

  try {
    const mailTransporter = getTransporter();
    await mailTransporter.sendMail({
      from: LEAD_SERVER_CONFIG.email.smtp.from,
      to: LEAD_SERVER_CONFIG.email.smtp.to,
      subject: `Neuer Lead: ${input.payload.name}`,
      text: buildNotificationText(input),
    });

    return {
      provider: "email",
      status: "success",
      message: "Lead notification email sent.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "SMTP email send failed.";
    console.error("[lead-email]", message);

    return {
      provider: "email",
      status: "error",
      message,
    };
  }
}

async function sendLeadConfirmationEmailToLead(input: StoredLeadEmailInput): Promise<LeadProviderResult> {
  if (!hasConfiguredLeadSmtp()) {
    return {
      provider: "email_confirmation",
      status: "skipped",
      message: "SMTP confirmation is not configured.",
    };
  }

  try {
    const mailTransporter = getTransporter();
    await mailTransporter.sendMail({
      from: LEAD_SERVER_CONFIG.email.smtp.from,
      to: input.payload.email,
      subject: "Bestätigung Ihrer Anfrage – aktive-FM",
      text: buildConfirmationText(input),
    });

    return {
      provider: "email_confirmation",
      status: "success",
      message: "Confirmation email sent to lead.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "SMTP confirmation email send failed.";
    console.error("[lead-email-confirmation]", message);

    return {
      provider: "email_confirmation",
      status: "error",
      message,
    };
  }
}

async function postLeadNotificationEndpoint(input: StoredLeadEmailInput): Promise<LeadProviderResult> {
  if (!hasConfiguredLeadValue(LEAD_SERVER_CONFIG.email.endpoint)) {
    return {
      provider: "email",
      status: "skipped",
      message: "Email endpoint is not configured.",
    };
  }

  try {
    const response = await fetch(LEAD_SERVER_CONFIG.email.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      return {
        provider: "email",
        status: "error",
        message: `email responded with ${response.status}.`,
      };
    }

    return {
      provider: "email",
      status: "success",
      message: "Email endpoint accepted the lead.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email endpoint request failed.";
    console.error("[lead-email]", message);

    return {
      provider: "email",
      status: "error",
      message,
    };
  }
}

export async function deliverLeadNotification(input: StoredLeadEmailInput): Promise<LeadProviderResult> {
  if (!LEAD_SERVER_CONFIG.email.enabled) {
    return {
      provider: "email",
      status: "skipped",
      message: "Lead notification email is disabled globally.",
    };
  }

  if (!LEAD_SERVER_CONFIG.email.notification.enabled) {
    return {
      provider: "email",
      status: "skipped",
      message: "Lead team notification is disabled.",
    };
  }

  if (hasConfiguredLeadSmtp()) {
    return sendLeadNotificationEmail(input);
  }

  return postLeadNotificationEndpoint(input);
}

export async function deliverLeadConfirmation(input: StoredLeadEmailInput): Promise<LeadProviderResult> {
  if (!LEAD_SERVER_CONFIG.email.enabled) {
    return {
      provider: "email_confirmation",
      status: "skipped",
      message: "Lead confirmation email is disabled globally.",
    };
  }

  if (!LEAD_SERVER_CONFIG.email.confirmation.enabled) {
    return {
      provider: "email_confirmation",
      status: "skipped",
      message: "Lead confirmation email is disabled.",
    };
  }

  return sendLeadConfirmationEmailToLead(input);
}

