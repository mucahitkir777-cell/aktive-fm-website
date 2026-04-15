import { TRACKING_CONFIG } from "@/lib/tracking/config";

export type ConsentType = "analytics" | "marketing";

export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const CONSENT_STORAGE_KEY = "proclean_cookie_consent";
const CONSENT_EXPIRY_DAYS = 365;

export function getConsentPreferences(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const prefs = JSON.parse(stored) as ConsentPreferences;
    const ageInDays = (Date.now() - prefs.timestamp) / (1000 * 60 * 60 * 24);

    if (ageInDays > CONSENT_EXPIRY_DAYS) {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      return null;
    }

    return prefs;
  } catch {
    return null;
  }
}

export function saveConsentPreferences(prefs: Omit<ConsentPreferences, "timestamp">) {
  if (typeof window === "undefined") return;

  const toStore: ConsentPreferences = {
    ...prefs,
    timestamp: Date.now(),
  };

  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(toStore));
  updateGoogleConsent(prefs);
  window.dispatchEvent(new CustomEvent("proclean:consent-updated", { detail: prefs }));
}

export function hasConsent(type: ConsentType): boolean {
  const prefs = getConsentPreferences();
  return prefs ? prefs[type] : false;
}

export function canSendExternalAnalytics() {
  if (!TRACKING_CONFIG.consent.requireAnalyticsConsentForExternalDestinations) {
    return true;
  }

  return hasConsent("analytics");
}

export function updateGoogleConsent(prefs: Omit<ConsentPreferences, "timestamp">) {
  if (typeof window === "undefined") return;

  const win = window as Window & {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
  };

  win.gtag?.("consent", "update", {
    analytics_storage: prefs.analytics ? "granted" : "denied",
    ad_storage: prefs.marketing ? "granted" : "denied",
    ad_user_data: prefs.marketing ? "granted" : "denied",
    ad_personalization: prefs.marketing ? "granted" : "denied",
    marketing_storage: prefs.marketing ? "granted" : "denied",
  });
}
