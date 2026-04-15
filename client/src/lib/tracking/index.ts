import { canSendExternalAnalytics } from "@/lib/consent";
import { sendGa4Event } from "@/lib/ga4";
import { queueReportingEvent } from "@/lib/reporting";
import { TRACKING_CONFIG, hasConfiguredValue } from "@/lib/tracking/config";
import type { DeviceClass, TrackingEvent, TrackingEventName, TrackingPayload, UtmParameters } from "@/lib/tracking/types";

const UTM_KEYS: Array<keyof UtmParameters> = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "msclkid",
  "fbclid",
];

function createId(prefix: string) {
  const randomId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return `${prefix}_${randomId}`;
}

function safeSessionStorageGet(key: string) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSessionStorageSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* Storage can be unavailable in privacy modes. */
  }
}

function safeLocalStorageGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalStorageSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Storage can be unavailable in privacy modes. */
  }
}

export function getDeviceClass(): DeviceClass {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  const ua = navigator.userAgent.toLowerCase();
  const isTabletUa = /ipad|tablet|kindle|silk/.test(ua);
  const isMobileUa = /android|iphone|ipod|mobile/.test(ua) && !isTabletUa;

  if (width < 768 || isMobileUa) return "mobile";
  if (width < 1024 || isTabletUa) return "tablet";
  return "desktop";
}

export function captureUtmParameters(): UtmParameters {
  if (typeof window === "undefined") return {};

  const query = new URLSearchParams(window.location.search);
  const utm = UTM_KEYS.reduce<UtmParameters>((acc, key) => {
    const value = query.get(key);
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {});

  if (Object.keys(utm).length === 0) {
    return getStoredUtmParameters();
  }

  const serialized = JSON.stringify(utm);
  const { firstTouchUtmKey, lastTouchUtmKey } = TRACKING_CONFIG.storage;

  if (!safeLocalStorageGet(firstTouchUtmKey)) {
    safeLocalStorageSet(firstTouchUtmKey, serialized);
  }

  safeSessionStorageSet(lastTouchUtmKey, serialized);
  safeLocalStorageSet(lastTouchUtmKey, serialized);

  return utm;
}

export function getStoredUtmParameters(): UtmParameters {
  if (typeof window === "undefined") return {};

  const { lastTouchUtmKey, firstTouchUtmKey } = TRACKING_CONFIG.storage;
  const stored = safeSessionStorageGet(lastTouchUtmKey) ?? safeLocalStorageGet(lastTouchUtmKey) ?? safeLocalStorageGet(firstTouchUtmKey);

  if (!stored) return {};

  try {
    return JSON.parse(stored) as UtmParameters;
  } catch {
    return {};
  }
}

export function getTrackingSessionId() {
  if (typeof window === "undefined") return "server";

  const key = TRACKING_CONFIG.storage.sessionIdKey;
  const existing = safeSessionStorageGet(key);
  if (existing) return existing;

  const sessionId = createId("session");
  safeSessionStorageSet(key, sessionId);
  return sessionId;
}

export function buildTrackingEvent(eventName: TrackingEventName, payload: TrackingPayload = {}): TrackingEvent {
  const pagePath = typeof window !== "undefined" ? window.location.pathname : "";

  return {
    ...payload,
    event_id: createId("event"),
    event_name: eventName,
    timestamp: new Date().toISOString(),
    page_path: pagePath,
    page_url: typeof window !== "undefined" ? window.location.href : "",
    page_title: typeof document !== "undefined" ? document.title : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
    session_id: getTrackingSessionId(),
    device_class: getDeviceClass(),
    utm: getStoredUtmParameters(),
  };
}

export function trackEvent(eventName: TrackingEventName, payload: TrackingPayload = {}) {
  captureUtmParameters();
  const event = buildTrackingEvent(eventName, payload);
  queueReportingEvent(event);
  dispatchToExternalDestinations(event);
  return event;
}

function dispatchToExternalDestinations(event: TrackingEvent) {
  if (typeof window === "undefined" || !canSendExternalAnalytics()) return;

  const win = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
    umami?: {
      track: (name: string, data?: Record<string, unknown>) => void;
    };
  };

  if (
    TRACKING_CONFIG.destinations.gtm.enabled &&
    hasConfiguredValue(TRACKING_CONFIG.destinations.gtm.containerId)
  ) {
    win.dataLayer = win.dataLayer ?? [];
    win.dataLayer.push({ event: event.event_name, ...event });
  }

  if (
    TRACKING_CONFIG.destinations.ga4.enabled &&
    hasConfiguredValue(TRACKING_CONFIG.destinations.ga4.measurementId)
  ) {
    sendGa4Event(event);
  }

  if (
    TRACKING_CONFIG.destinations.umami.enabled &&
    hasConfiguredValue(TRACKING_CONFIG.destinations.umami.websiteId)
  ) {
    win.umami?.track(event.event_name, event);
  }
}

export function trackCallClick(payload: TrackingPayload = {}) {
  return trackEvent("call_click", payload);
}

export function trackWhatsAppClick(payload: TrackingPayload = {}) {
  return trackEvent("whatsapp_click", payload);
}

export function trackCtaClick(payload: TrackingPayload = {}) {
  return trackEvent("cta_click", payload);
}

export function trackFormStart(payload: TrackingPayload = {}) {
  return trackEvent("form_start", payload);
}

export function trackFormSubmitEvent(payload: TrackingPayload = {}) {
  return trackEvent("form_submit", payload);
}

export function trackServiceInterest(serviceType: string, payload: TrackingPayload = {}) {
  return trackEvent("service_interest", {
    service_type: serviceType,
    ...payload,
  });
}

export function trackLocationInterest(location: string, payload: TrackingPayload = {}) {
  return trackEvent("location_interest", {
    location,
    ...payload,
  });
}
