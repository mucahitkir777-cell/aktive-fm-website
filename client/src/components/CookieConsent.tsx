/*
 * Aktive Facility Management Cookie Consent Banner
 * DSGVO-konform
 * Speichert Nutzer-Präferenzen in localStorage
 */

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  getConsentPreferences,
  saveConsentPreferences,
  type ConsentPreferences,
} from "@/lib/consent";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState<Omit<ConsentPreferences, "timestamp">>({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if consent was already given
    const stored = getConsentPreferences();
    if (!stored) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const prefs = { analytics: true, marketing: true };
    setPreferences(prefs);
    saveConsentPreferences(prefs);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const prefs = { analytics: false, marketing: false };
    setPreferences(prefs);
    saveConsentPreferences(prefs);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    saveConsentPreferences(preferences);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t pc-border shadow-[0_-10px_36px_-28px_rgba(15,33,55,0.75)]">
      <div className="container max-w-6xl mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Content */}
          <div className="flex-1">
            <h3 className="font-bold pc-text-primary mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
              Wir respektieren Ihre Privatsphäre
            </h3>
            <p className="text-sm pc-text-secondary leading-relaxed mb-4 lg:mb-0" style={{ fontFamily: "Inter, sans-serif" }}>
              Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und unsere Website zu optimieren. Sie können Ihre Präferenzen jederzeit anpassen. Weitere Informationen finden Sie in unserer{" "}
              <a href="/datenschutz" className="pc-text-brand hover:underline font-semibold">
                Datenschutzerklärung
              </a>
              .
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={handleRejectAll}
              className="px-4 py-2.5 text-sm font-medium pc-text-secondary border pc-border rounded-lg hover:bg-[var(--color-bg-section)] transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Ablehnen
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2.5 text-sm font-medium text-white pc-bg-brand rounded-lg hover:bg-[var(--pc-primary-hover)] transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Alle akzeptieren
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={handleRejectAll}
            className="absolute top-4 right-4 pc-text-muted hover:pc-text-secondary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Expandable Details (optional) */}
        <details className="mt-4 pt-4 border-t pc-border">
          <summary className="cursor-pointer text-sm font-semibold pc-text-primary hover:text-[var(--pc-primary)]" style={{ fontFamily: "Inter, sans-serif" }}>
            Detaillierte Einstellungen
          </summary>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    analytics: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded pc-border"
              />
              <span className="text-sm pc-text-secondary" style={{ fontFamily: "Inter, sans-serif" }}>
                <strong>Analyse-Cookies</strong> – Helfen uns, die Website zu verbessern
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    marketing: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded pc-border"
              />
              <span className="text-sm pc-text-secondary" style={{ fontFamily: "Inter, sans-serif" }}>
                <strong>Marketing-Cookies</strong> – Personalisierte Inhalte und Anzeigen
              </span>
            </label>
            <button
              onClick={handleSavePreferences}
              className="mt-4 px-4 py-2 text-sm font-medium text-white pc-bg-brand rounded-lg hover:bg-[var(--pc-primary-hover)] transition-colors w-full"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Einstellungen speichern
            </button>
          </div>
        </details>
      </div>
    </div>
  );
}

