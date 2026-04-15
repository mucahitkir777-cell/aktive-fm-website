import { canSendExternalAnalytics, getConsentPreferences } from "@/lib/consent";
import { TRACKING_CONFIG, hasConfiguredValue } from "@/lib/tracking/config";
import type { TrackingEvent, TrackingPayload } from "@/lib/tracking/types";

const GA4_SCRIPT_ID = "proclean-ga4-script";

type GtagCommand = "js" | "config" | "event" | "consent";

type GtagFunction = (
  command: GtagCommand,
  target: string | Date,
  params?: Record<string, unknown>
) => void;

type Ga4Window = Window & {
  dataLayer?: unknown[];
  gtag?: GtagFunction;
};

const GA4_EVENT_NAMES: Record<string, string> = {
  page_view: "page_view",
  call_click: "call_click",
  whatsapp_click: "whatsapp_click",
  cta_click: "cta_click",
  form_start: "form_start",
  form_submit: "form_submit",
  form_success: "form_success",
  form_error: "form_error",
  service_interest: "service_interest",
  location_interest: "location_interest",
};

let initialized = false;
let scriptLoading = false;

function getGa4Window() {
  return window as Ga4Window;
}

function getMeasurementId() {
  return TRACKING_CONFIG.destinations.ga4.measurementId;
}

export function isGa4Configured() {
  return (
    TRACKING_CONFIG.destinations.ga4.enabled &&
    hasConfiguredValue(getMeasurementId())
  );
}

function ensureGtag() {
  const win = getGa4Window();
  win.dataLayer = win.dataLayer ?? [];

  if (!win.gtag) {
    win.gtag = function gtag(...args) {
      win.dataLayer?.push(args);
    } as GtagFunction;
  }

  return win.gtag;
}

function loadGa4Script() {
  if (!isGa4Configured() || scriptLoading || document.getElementById(GA4_SCRIPT_ID)) {
    return;
  }

  scriptLoading = true;
  const script = document.createElement("script");
  script.id = GA4_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(getMeasurementId())}`;
  script.onload = () => {
    scriptLoading = false;
  };
  script.onerror = () => {
    scriptLoading = false;
  };
  document.head.appendChild(script);
}

export function initGa4() {
  if (typeof window === "undefined" || !isGa4Configured()) return;

  const gtag = ensureGtag();

  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  if (!canSendExternalAnalytics()) return;

  const prefs = getConsentPreferences();
  if (prefs) {
    gtag("consent", "update", {
      analytics_storage: prefs.analytics ? "granted" : "denied",
      ad_storage: prefs.marketing ? "granted" : "denied",
      ad_user_data: prefs.marketing ? "granted" : "denied",
      ad_personalization: prefs.marketing ? "granted" : "denied",
    });
  }

  loadGa4Script();

  if (!initialized) {
    gtag("js", new Date());
    gtag("config", getMeasurementId(), {
      send_page_view: false,
      anonymize_ip: true,
      debug_mode: TRACKING_CONFIG.destinations.ga4.debug,
    });
    initialized = true;
  }
}

function flattenUtmParams(event: TrackingEvent): TrackingPayload {
  return {
    utm_source: event.utm?.utm_source,
    utm_medium: event.utm?.utm_medium,
    utm_campaign: event.utm?.utm_campaign,
    utm_term: event.utm?.utm_term,
    utm_content: event.utm?.utm_content,
  };
}

export function mapTrackingEventToGa4Params(event: TrackingEvent): Record<string, unknown> {
  return {
    page_path: event.page_path,
    page_location: event.page_url,
    page_title: event.page_title,
    page_type: event.page_type,
    region: event.region ?? event.location,
    location: event.location,
    service: event.service_type,
    service_type: event.service_type,
    service_id: event.service_id,
    device_type: event.device_type ?? event.device_class,
    cta_id: event.cta_id,
    cta_text: event.cta_text,
    cta_location: event.cta_location,
    button_location: event.button_location,
    form_id: event.form_id,
    form_type: event.form_type,
    lead_id: event.lead_id,
    error_message: event.error_message,
    debug_mode: TRACKING_CONFIG.destinations.ga4.debug,
    ...flattenUtmParams(event),
  };
}

export function sendGa4Event(event: TrackingEvent) {
  if (typeof window === "undefined" || !isGa4Configured() || !canSendExternalAnalytics()) {
    return;
  }

  initGa4();

  const ga4EventName = GA4_EVENT_NAMES[event.event_name] ?? event.event_name;
  const gtag = ensureGtag();
  gtag("event", ga4EventName, mapTrackingEventToGa4Params(event));

  if (TRACKING_CONFIG.debug || TRACKING_CONFIG.destinations.ga4.debug) {
    console.info("[ga4]", ga4EventName, mapTrackingEventToGa4Params(event));
  }
}
