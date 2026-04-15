/*
 * ProClean Cookie Consent Banner
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
      <div className="container max-w-6xl mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Content */}
          <div className="flex-1">
            <h3 className="font-bold text-[#0F2137] mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
              Wir respektieren Ihre Privatsphäre
            </h3>
            <p className="text-sm text-[#6B7A8D] leading-relaxed mb-4 lg:mb-0" style={{ fontFamily: "Inter, sans-serif" }}>
              Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und unsere Website zu optimieren. Sie können Ihre Präferenzen jederzeit anpassen. Weitere Informationen finden Sie in unserer{" "}
              <a href="/datenschutz" className="text-[#1D6FA4] hover:underline font-semibold">
                Datenschutzerklärung
              </a>
              .
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={handleRejectAll}
              className="px-4 py-2.5 text-sm font-medium text-[#6B7A8D] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Ablehnen
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2.5 text-sm font-medium text-white bg-[#1D6FA4] rounded-lg hover:bg-[#165a8a] transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Alle akzeptieren
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={handleRejectAll}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Expandable Details (optional) */}
        <details className="mt-4 pt-4 border-t border-gray-200">
          <summary className="cursor-pointer text-sm font-semibold text-[#0F2137] hover:text-[#1D6FA4]" style={{ fontFamily: "Syne, sans-serif" }}>
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
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-[#6B7A8D]" style={{ fontFamily: "Inter, sans-serif" }}>
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
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-[#6B7A8D]" style={{ fontFamily: "Inter, sans-serif" }}>
                <strong>Marketing-Cookies</strong> – Personalisierte Inhalte und Anzeigen
              </span>
            </label>
            <button
              onClick={handleSavePreferences}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-[#0F2137] rounded-lg hover:bg-[#1a3a52] transition-colors w-full"
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
