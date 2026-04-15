import type { LeadSubmissionPayload, LeadSubmissionResult } from "@shared/lead";
import { validateLeadSubmission } from "@shared/lead";
import { internalApiLeadAdapter } from "@/lib/leads/adapters";

export async function submitLead(payload: LeadSubmissionPayload): Promise<LeadSubmissionResult> {
  const validation = validateLeadSubmission(payload);

  if (!validation.success) {
    return {
      success: false,
      message: "Bitte prüfen Sie Ihre Angaben.",
      fieldErrors: validation.fieldErrors,
    };
  }

  try {
    return await internalApiLeadAdapter.submit(validation.data);
  } catch {
    return {
      success: false,
      message: "Die Anfrage konnte technisch nicht übermittelt werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.",
    };
  }
}

export type { LeadSubmissionPayload, LeadSubmissionResult };
