import { TRACKING_CONFIG } from "@/lib/tracking/config";
import type { TrackingPayload, UtmParameters } from "@/lib/tracking/types";

export interface CrmLeadTrackingPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  serviceType?: string;
  location?: string;
  source: "website";
  pagePath: string;
  deviceClass?: string;
  utm?: UtmParameters;
  tracking?: TrackingPayload;
}

export const CRM_INTEGRATION_CONFIG = {
  enabled: TRACKING_CONFIG.destinations.crm.enabled,
  leadEndpoint: TRACKING_CONFIG.destinations.crm.leadEndpoint,
  provider: import.meta.env.VITE_CRM_PROVIDER ?? "placeholder",
} as const;

export function buildCrmLeadTrackingPayload(payload: Omit<CrmLeadTrackingPayload, "source">): CrmLeadTrackingPayload {
  return {
    source: "website",
    ...payload,
  };
}
