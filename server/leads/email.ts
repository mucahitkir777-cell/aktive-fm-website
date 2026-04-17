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
    "Hinweis: Der Lead ist im Adminbereich unter /admin/leads verfÃ¼gbar.",
    `Lead-ID: ${input.leadId}`,
  ].join("\n");
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
      message: "Lead notification email is disabled.",
    };
  }

  if (hasConfiguredLeadSmtp()) {
    return sendLeadNotificationEmail(input);
  }

  return postLeadNotificationEndpoint(input);
}

