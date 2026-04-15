import {
  captureUtmParameters,
  trackCallClick,
  trackCtaClick,
  trackEvent,
  trackFormStart,
  trackFormSubmitEvent,
  trackLocationInterest,
  trackServiceInterest,
  trackWhatsAppClick as trackWhatsAppClickEvent,
} from "@/lib/tracking";
import { initGa4 } from "@/lib/ga4";
import type { TrackingEventName, TrackingPayload } from "@/lib/tracking/types";

let initialized = false;

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
  return trackCallClick({
    button_location: location,
    ...payload,
  });
}

export function trackWhatsAppClick(location = "unknown", payload: TrackingPayload = {}) {
  return trackWhatsAppClickEvent({
    button_location: location,
    ...payload,
  });
}

export function trackFormSubmit(formType = "contact", serviceType?: string, payload: TrackingPayload = {}) {
  return trackFormSubmitEvent({
    form_type: formType,
    service_type: serviceType,
    ...payload,
  });
}

export function trackFormSuccess(payload: TrackingPayload = {}) {
  return trackEvent("form_success", payload);
}

export function trackFormError(payload: TrackingPayload = {}) {
  return trackEvent("form_error", payload);
}

export { trackCtaClick, trackFormStart, trackServiceInterest, trackLocationInterest };

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
