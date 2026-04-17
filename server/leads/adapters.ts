import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { LeadProviderResult, LeadSubmissionPayload } from "@shared/lead";
import { LEAD_SERVER_CONFIG, hasConfiguredLeadValue } from "./config";
import { deliverLeadNotification } from "./email";
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
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
  } catch (error) {
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

export async function processLeadSubmission(payload: LeadSubmissionPayload): Promise<ProcessLeadResult> {
  const storedLead: StoredLead = {
    leadId: `lead_${randomUUID()}`,
    receivedAt: new Date().toISOString(),
    payload,
  };

  const savedLead = await createLead(storedLead);

  const providerResults: LeadProviderResult[] = [
    {
      provider: "database",
      status: "success",
      message: `Lead stored in PostgreSQL with status ${savedLead.status}.`,
    },
    await persistToLocalInbox(storedLead),
  ];

  if (LEAD_SERVER_CONFIG.webhook.enabled) {
    providerResults.push(await postJson("webhook", LEAD_SERVER_CONFIG.webhook.endpoint, storedLead));
  }

  if (LEAD_SERVER_CONFIG.crm.enabled) {
    providerResults.push(await postJson("crm", LEAD_SERVER_CONFIG.crm.endpoint, storedLead));
  }

  if (LEAD_SERVER_CONFIG.email.enabled) {
    providerResults.push(await deliverLeadNotification(storedLead));
  }

  const hasSuccessfulProcessing = providerResults.some((result) => result.status === "success");

  if (!hasSuccessfulProcessing) {
    throw new Error("No lead provider accepted the submission.");
  }

  return {
    leadId: storedLead.leadId,
    providerResults,
  };
}

