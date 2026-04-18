/*
 * Aktive Facility Management Datenschutz-Seite
 * Design: Architektonischer Minimalismus
 */

import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { companyConfig } from "@/config/company";
import { applyPageSeo } from "@/lib/seo";

export default function Datenschutz() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    applyPageSeo({
      title: `Datenschutz | ${companyConfig.brand.legalName}`,
      description: `Datenschutzhinweise der ${companyConfig.brand.legalName} zur Verarbeitung personenbezogener Daten auf dieser Website.`,
    });
  }, []);

  return (
    <div className="min-h-screen pc-bg-section">
      <Navigation />

      <section className="pc-page-hero">
        <div className="container">
          <div className="max-w-2xl">
            <span className="block w-12 h-0.5 pc-bg-accent mb-6" />
            <h1 className="text-4xl font-bold pc-text-primary mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Datenschutzerklärung
            </h1>
            <p className="pc-text-secondary" style={{ fontFamily: "Inter, sans-serif" }}>
              Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO
            </p>
          </div>
        </div>
      </section>

      <section className="pc-section">
        <div className="container">
          <div className="max-w-3xl">
            <div className="bg-white rounded-xl p-8 lg:p-10 border pc-border shadow-sm space-y-8 pc-text-secondary text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              <div>
                <h2 className="text-lg font-bold pc-text-primary mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  1. Verantwortliche Stelle
                </h2>
                <p className="mb-3">Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
                <div className="pc-bg-section rounded-lg p-4 space-y-1">
                  <p className="font-semibold pc-text-primary">{companyConfig.brand.legalName}</p>
                  {companyConfig.address.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p>Telefon: {companyConfig.contact.phoneDisplay}</p>
                  <p>E-Mail: {companyConfig.contact.email}</p>
                </div>
              </div>

              <div className="border-t pc-border pt-6">
                <h2 className="text-lg font-bold pc-text-primary mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  2. Zugriffsdaten und Hosting
                </h2>
                <p>
                  Beim Aufruf der Website werden technisch erforderliche Daten (z. B. IP-Adresse, Datum/Uhrzeit, aufgerufene URL,
                  Browserinformationen) in Server-Log-Dateien verarbeitet, um den Betrieb, die Sicherheit und die Fehleranalyse sicherzustellen.
                </p>
              </div>

              <div className="border-t pc-border pt-6">
                <h2 className="text-lg font-bold pc-text-primary mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  3. Kontaktformular und Anfragen
                </h2>
                <p className="mb-3">
                  Wenn Sie uns über das Kontaktformular eine Anfrage senden, verarbeiten wir die von Ihnen übermittelten Angaben
                  (z. B. Name, Kontaktangaben, Nachricht, optionale Objekt- und Leistungsdaten) zur Bearbeitung Ihrer Anfrage.
                </p>
                <p>
                  Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Kommunikation) bzw. Art. 6 Abs. 1 lit. f DSGVO
                  (berechtigtes Interesse an effizienter Bearbeitung von Anfragen).
                </p>
              </div>

              <div className="border-t pc-border pt-6">
                <h2 className="text-lg font-bold pc-text-primary mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  4. Cookies, Consent und Tracking
                </h2>
                <p className="mb-3">
                  Diese Website verwendet ein Consent-Banner. Nicht technisch erforderliche Analyse- oder Marketing-Verarbeitungen werden
                  erst nach Ihrer Einwilligung aktiviert.
                </p>
                <p>
                  Je nach Konfiguration der Website können Analyse- oder Tag-Management-Dienste eingebunden werden. Ohne Einwilligung
                  bleiben diese deaktiviert.
                </p>
              </div>

              <div className="border-t pc-border pt-6">
                <h2 className="text-lg font-bold pc-text-primary mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  5. Speicherdauer
                </h2>
                <p>
                  Personenbezogene Daten werden nur so lange gespeichert, wie dies für die jeweiligen Zwecke erforderlich ist oder
                  gesetzliche Aufbewahrungspflichten bestehen. Danach werden Daten gelöscht oder anonymisiert.
                </p>
              </div>

              <div className="border-t pc-border pt-6">
                <h2 className="text-lg font-bold pc-text-primary mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  6. Ihre Rechte
                </h2>
                <p className="mb-3">Sie haben insbesondere folgende Rechte:</p>
                <ul className="space-y-2 ml-4">
                  {[
                    "Auskunft (Art. 15 DSGVO)",
                    "Berichtigung (Art. 16 DSGVO)",
                    "Löschung (Art. 17 DSGVO)",
                    "Einschränkung der Verarbeitung (Art. 18 DSGVO)",
                    "Datenübertragbarkeit (Art. 20 DSGVO)",
                    "Widerspruch gegen bestimmte Verarbeitungen (Art. 21 DSGVO)",
                    "Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft",
                  ].map((right) => (
                    <li key={right} className="flex items-start gap-2">
                      <span className="pc-text-brand mt-1">•</span>
                      <span>{right}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  Außerdem haben Sie ein Beschwerderecht bei einer zuständigen Datenschutz-Aufsichtsbehörde.
                </p>
              </div>

              <div className="border-t pc-border pt-6">
                <h2 className="text-lg font-bold pc-text-primary mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  7. Kontakt zu Datenschutzanfragen
                </h2>
                <p>
                  Für Anfragen zum Datenschutz kontaktieren Sie uns unter {" "}
                  <a href={companyConfig.contact.emailHref} className="pc-text-brand hover:underline">
                    {companyConfig.contact.email}
                  </a>
                  .
                </p>
                <p className="mt-3 text-xs pc-text-muted">
                  Stand: {new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

