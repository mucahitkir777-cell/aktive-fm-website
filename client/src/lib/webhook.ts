/*
 * Compatibility wrapper for older imports.
 * New lead submissions should use client/src/lib/leads/submit.ts directly.
 */

import type { LeadSubmissionPayload, LeadSubmissionResult } from "@shared/lead";
import { submitLead } from "@/lib/leads/submit";

export type FormSubmissionData = LeadSubmissionPayload;

export async function submitFormToWebhook(data: LeadSubmissionPayload): Promise<LeadSubmissionResult> {
  return submitLead(data);
}

export function formatForCRM(data: LeadSubmissionPayload) {
  const [firstName, ...lastNameParts] = data.name.split(" ");

  return {
    hubspot: {
      properties: {
        firstname: firstName,
        lastname: lastNameParts.join(" "),
        email: data.email,
        phone: data.phone,
        company: data.company ?? "",
        city: data.regionLabel ?? data.location ?? "",
        lifecyclestage: "lead",
        hs_lead_status: "NEW",
        custom_service_type: data.serviceLabel ?? data.serviceType ?? "",
        custom_cleaning_interval: data.cleaningInterval ?? "",
        custom_object_size: data.objectSize ?? "",
        notes: data.message ?? `Website-Anfrage vom ${new Date().toLocaleDateString("de-DE")}`,
      },
    },
    pipedrive: {
      name: data.name,
      email: [{ value: data.email, primary: true }],
      phone: [{ value: data.phone, primary: true }],
      org_id: null,
      custom_fields: {
        cleaning_service: data.serviceLabel ?? data.serviceType ?? "",
        cleaning_interval: data.cleaningInterval ?? "",
        object_size: data.objectSize ?? "",
        source_channel: data.source,
      },
      notes: data.message ?? `Website-Anfrage vom ${new Date().toLocaleDateString("de-DE")}`,
    },
  };
}
