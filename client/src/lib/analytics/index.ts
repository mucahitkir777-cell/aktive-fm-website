import {
  captureUtmParameters,
  trackCallClick,
  trackCtaClick as trackCtaClickEvent,
  trackEvent,
  trackFormStart as trackFormStartEvent,
  trackFormSubmitEvent,
  trackLocationInterest,
  trackServiceInterest,
  trackWhatsAppClick as trackWhatsAppClickEvent,
} from "@/lib/tracking";
import { initGa4 } from "@/lib/ga4";
import type { TrackingEventName, TrackingPayload } from "@/lib/tracking/types";

let initialized = false;

function getCurrentPage() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.pathname || "/";
}

function normalizePath(path: string) {
  if (!path) {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

function buildCtaPayload(
  type: "phone" | "whatsapp" | "request" | "contact" | "offer" | "generic" | "form",
  payload: TrackingPayload = {},
) {
  const section =
    (typeof payload.section === "string" && payload.section)
    || (typeof payload.cta_location === "string" && payload.cta_location)
    || (typeof payload.button_location === "string" && payload.button_location)
    || "";

  const label =
    (typeof payload.label === "string" && payload.label)
    || (typeof payload.cta_text === "string" && payload.cta_text)
    || (typeof payload.button_text === "string" && payload.button_text)
    || "";

  const destination =
    (typeof payload.destination === "string" && payload.destination)
    || (typeof payload.destination_url === "string" && payload.destination_url)
    || "";

  const page = normalizePath(
    (typeof payload.page === "string" && payload.page)
      || (typeof payload.page_path === "string" && payload.page_path)
      || getCurrentPage(),
  );

  return {
    ...payload,
    cta_type: payload.cta_type ?? type,
    page,
    section: payload.section ?? (section ? section : undefined),
    label: payload.label ?? (label ? label : undefined),
    destination: payload.destination ?? (destination ? destination : undefined),
    cta_location: payload.cta_location ?? (section ? section : undefined),
    button_location: payload.button_location ?? (section ? section : undefined),
    cta_text: payload.cta_text ?? (label ? label : undefined),
    destination_url: payload.destination_url ?? (destination ? destination : undefined),
  } satisfies TrackingPayload;
}

export function initAnalytics() {
  if (initialized) return;
  initialized = true;

  captureUtmParameters();
  initGa4();

  if (typeof window !== "undefined") {
    window.addEventListener("proclean:consent-updated", () => {
      initGa4();
    });
  }
}

export function trackPageView(payload: TrackingPayload = {}) {
  return trackEvent("page_view", payload);
}

export function trackGA4Event(eventName: TrackingEventName, params: TrackingPayload = {}) {
  return trackEvent(eventName, params);
}

export function trackPhoneClick(location = "unknown", payload: TrackingPayload = {}) {
  return trackCallClick(
    buildCtaPayload("phone", {
      ...payload,
      button_location: location,
      section: payload.section ?? location,
    }),
  );
}

export function trackWhatsAppClick(location = "unknown", payload: TrackingPayload = {}) {
  return trackWhatsAppClickEvent(
    buildCtaPayload("whatsapp", {
      ...payload,
      button_location: location,
      section: payload.section ?? location,
    }),
  );
}

export function trackCtaClick(payload: TrackingPayload = {}) {
  const ctaType =
    (typeof payload.cta_type === "string" && payload.cta_type)
    || ((typeof payload.cta_id === "string" && payload.cta_id.includes("offer")) ? "offer" : "generic");

  return trackCtaClickEvent(buildCtaPayload(ctaType as "offer" | "generic", payload));
}

export function trackFormSubmit(formType = "contact", serviceType?: string, payload: TrackingPayload = {}) {
  return trackFormSubmitEvent({
    ...buildCtaPayload("form", payload),
    form_type: formType,
    service_type: serviceType,
  });
}

export function trackFormSuccess(payload: TrackingPayload = {}) {
  return trackEvent("form_success", buildCtaPayload("form", payload));
}

export function trackFormError(payload: TrackingPayload = {}) {
  return trackEvent("form_error", buildCtaPayload("form", payload));
}

export function trackFormStart(payload: TrackingPayload = {}) {
  return trackFormStartEvent(buildCtaPayload("form", payload));
}

export { trackServiceInterest, trackLocationInterest };

export function trackScrollDepth(percentage: number) {
  return trackEvent("scroll_depth", {
    scroll_percentage: percentage,
  });
}

export function initScrollDepthTracking() {
  if (typeof window === "undefined") return;

  const trackingPoints = [25, 50, 75, 100];
  const tracked = new Set<number>();

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const scrolled = (window.scrollY / scrollHeight) * 100;

    trackingPoints.forEach((point) => {
      if (scrolled >= point && !tracked.has(point)) {
        tracked.add(point);
        trackScrollDepth(point);
      }
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}
