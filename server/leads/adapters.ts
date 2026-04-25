import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { LeadProviderResult, LeadSubmissionPayload } from "@shared/lead";
import { LEAD_SERVER_CONFIG, hasConfiguredLeadValue } from "./config";
import { deliverLeadNotification, deliverLeadConfirmation } from "./email";
import { createLead } from "./repository";

export interface StoredLead {
  leadId: string;
  receivedAt: string;
  payload: LeadSubmissionPayload;
}

export interface ProcessLeadResult {
  leadId: string;
  providerResults: LeadProviderResult[];
}

async function postJson(provider: "webhook" | "crm" | "email", endpoint: string, payload: StoredLead): Promise<LeadProviderResult> {
  if (!hasConfiguredLeadValue(endpoint)) {
    return {
      provider,
      status: "skipped",
      message: `${provider} endpoint is not configured.`,
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        return {
          provider,
          status: "error",
          message: `${provider} responded with ${response.status}.`,
        };
      }

      return {
        provider,
        status: "success",
        message: `${provider} accepted the lead.`,
      };
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        provider,
        status: "error",
        message: `${provider} request timed out (10s).`,
      };
    }
    return {
      provider,
      status: "error",
      message: error instanceof Error ? error.message : `${provider} request failed.`,
    };
  }
}

async function persistToLocalInbox(storedLead: StoredLead): Promise<LeadProviderResult> {
  if (!LEAD_SERVER_CONFIG.inbox.enabled) {
    return {
      provider: "local_inbox",
      status: "skipped",
      message: "Local lead inbox is disabled.",
    };
  }

  try {
    const filePath = LEAD_SERVER_CONFIG.inbox.filePath;
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.appendFile(filePath, `${JSON.stringify(storedLead)}\n`, "utf8");

    return {
      provider: "local_inbox",
      status: "success",
      message: "Lead stored in local inbox.",
    };
  } catch (error) {
    return {
      provider: "local_inbox",
      status: "error",
      message: error instanceof Error ? error.message : "Local lead inbox write failed.",
    };
  }
}

function queueLeadEmailDelivery(storedLead: StoredLead): LeadProviderResult[] {
  const queuedResults: LeadProviderResult[] = [];

  if (LEAD_SERVER_CONFIG.email.enabled && LEAD_SERVER_CONFIG.email.notification.enabled) {
    queuedResults.push({
      provider: "email",
      status: "queued",
      message: "Lead notification email queued.",
    });

    void deliverLeadNotification(storedLead).catch((error) => {
      console.error(
        `[lead-email] [${new Date().toISOString()}] [notification] [${storedLead.leadId}] FAILED - ${
          error instanceof Error ? error.message : "Unexpected email notification error."
        }`,
      );
    });
  }

  if (LEAD_SERVER_CONFIG.email.enabled && LEAD_SERVER_CONFIG.email.confirmation.enabled) {
    queuedResults.push({
      provider: "email_confirmation",
      status: "queued",
      message: "Lead confirmation email queued.",
    });

    void deliverLeadConfirmation(storedLead).catch((error) => {
      console.error(
        `[lead-email] [${new Date().toISOString()}] [confirmation] [${storedLead.leadId}] FAILED - ${
          error instanceof Error ? error.message : "Unexpected email confirmation error."
        }`,
      );
    });
  }

  if (!queuedResults.length) {
    queuedResults.push({
      provider: "email",
      status: "skipped",
      message: "Lead email delivery is disabled.",
    });
  }

  return queuedResults;
}

export async function processLeadSubmission(payload: LeadSubmissionPayload): Promise<ProcessLeadResult> {
  const storedLead: StoredLead = {
    leadId: `lead_${randomUUID()}`,
    receivedAt: new Date().toISOString(),
    payload,
  };

  let savedLead: any;
  let databaseResult: LeadProviderResult;

  try {
    savedLead = await createLead(storedLead);
    databaseResult = {
      provider: "database",
      status: "success",
      message: `Lead stored in PostgreSQL with status ${savedLead.status}.`,
    };
  } catch (error) {
    databaseResult = {
      provider: "database",
      status: "error",
      message: error instanceof Error ? error.message : "Database storage failed.",
    };
  }

  const providerResults: LeadProviderResult[] = [
    databaseResult,
    await persistToLocalInbox(storedLead),
  ];

  if (LEAD_SERVER_CONFIG.webhook.enabled) {
    providerResults.push(await postJson("webhook", LEAD_SERVER_CONFIG.webhook.endpoint, storedLead));
  }

  if (LEAD_SERVER_CONFIG.crm.enabled) {
    providerResults.push(await postJson("crm", LEAD_SERVER_CONFIG.crm.endpoint, storedLead));
  }

  providerResults.push(...queueLeadEmailDelivery(storedLead));

  // Note: We always return results now, success is determined by database status in the endpoint

  return {
    leadId: storedLead.leadId,
    providerResults,
  };
}

