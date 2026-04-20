import type { LeadSubmissionPayload, LeadSubmissionResult } from "@shared/lead";
import { LEAD_SUBMISSION_CONFIG } from "@/lib/leads/config";

export interface LeadTransportAdapter {
  name: "internal_api";
  submit: (payload: LeadSubmissionPayload) => Promise<LeadSubmissionResult>;
}

export const internalApiLeadAdapter: LeadTransportAdapter = {
  name: "internal_api",
  async submit(payload) {
    const response = await fetch(LEAD_SUBMISSION_CONFIG.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => null)) as LeadSubmissionResult | null;

    // Wenn HTTP-Status nicht ok, oder Body sagt success: false → Error
    if (!response.ok || (result && result.success === false)) {
      return {
        success: false,
        message: result?.message ?? "Die Anfrage konnte nicht verarbeitet werden.",
        fieldErrors: result?.fieldErrors,
        providerResults: result?.providerResults,
      };
    }

    // Nur bei HTTP 200+ und success !== false → Success annehmen
    return (
      result ?? {
        success: true,
        message: "Ihre Anfrage wurde verarbeitet.",
      }
    );
  },
};
