export type DeviceClass = "mobile" | "tablet" | "desktop";

export type TrackingEventName =
  | "page_view"
  | "call_click"
  | "whatsapp_click"
  | "cta_click"
  | "form_start"
  | "form_submit"
  | "form_success"
  | "form_error"
  | "service_interest"
  | "location_interest"
  | "scroll_depth";

export interface UtmParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  msclkid?: string;
  fbclid?: string;
}

export interface TrackingContext {
  event_id: string;
  event_name: TrackingEventName;
  timestamp: string;
  page_path: string;
  page_url: string;
  page_title: string;
  referrer: string;
  session_id: string;
  device_class: DeviceClass;
  utm: UtmParameters;
}

export interface TrackingPayload {
  button_location?: string;
  cta_id?: string;
  cta_text?: string;
  cta_location?: string;
  destination_url?: string;
  form_id?: string;
  form_type?: string;
  service_type?: string;
  service_id?: string;
  location?: string;
  region?: string;
  scroll_percentage?: number;
  [key: string]: unknown;
}

export type TrackingEvent = TrackingContext & TrackingPayload;
