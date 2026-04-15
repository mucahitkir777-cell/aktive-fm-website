/*
 * ProClean Datenschutz-Seite
 * Design: Architektonischer Minimalismus
 */

import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { companyConfig } from "@/config/company";

export default function Datenschutz() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navigation />

      {/* Page Hero */}
      <section className="bg-[#0F2137] pt-28 pb-16">
        <div className="container">
          <div className="max-w-2xl">
            <span className="block w-10 h-0.5 bg-[#1D6FA4] mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              Datenschutzerklärung
            </h1>
            <p className="text-white/60" style={{ fontFamily: "Inter, sans-serif" }}>
              Informationen zur Verarbeitung Ihrer personenbezogenen Daten gemäß DSGVO
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pc-section">
        <div className="container">
          <div className="max-w-3xl">
            <div className="bg-white rounded-xl p-8 lg:p-10 border border-gray-100 shadow-sm space-y-8 text-[#6B7A8D] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>

              <div>
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  1. Datenschutz auf einen Blick
                </h2>
                <h3 className="font-semibold text-[#1A2332] mb-2">Allgemeine Hinweise</h3>
                <p>
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  2. Verantwortliche Stelle
                </h2>
                <p className="mb-3">
                  Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
                </p>
                <div className="bg-[#F7F8FA] rounded-lg p-4 space-y-1">
                  <p className="font-semibold text-[#1A2332]">{companyConfig.brand.legalName}</p>
                  <p>{companyConfig.address.singleLine}</p>
                  <p>Telefon: {companyConfig.contact.phoneDisplay}</p>
                  <p>E-Mail: {companyConfig.contact.email}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  3. Datenerfassung auf dieser Website
                </h2>
                <h3 className="font-semibold text-[#1A2332] mb-2">Kontaktformular</h3>
                <p className="mb-4">
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                </p>
                <p className="mb-4">
                  Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO).
                </p>
                <h3 className="font-semibold text-[#1A2332] mb-2">Server-Log-Dateien</h3>
                <p>
                  Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  4. Ihre Rechte
                </h2>
                <p className="mb-3">Sie haben jederzeit das Recht:</p>
                <ul className="space-y-2 ml-4">
                  {[
                    "Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten zu erhalten (Art. 15 DSGVO)",
                    "Die Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO)",
                    "Die Löschung Ihrer bei uns gespeicherten Daten zu verlangen (Art. 17 DSGVO)",
                    "Die Einschränkung der Datenverarbeitung zu verlangen (Art. 18 DSGVO)",
                    "Der Verarbeitung Ihrer Daten zu widersprechen (Art. 21 DSGVO)",
                    "Ihre Daten in einem maschinenlesbaren Format zu erhalten (Art. 20 DSGVO)",
                  ].map((right) => (
                    <li key={right} className="flex items-start gap-2">
                      <span className="text-[#1D6FA4] mt-1">•</span>
                      <span>{right}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  Außerdem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  5. Speicherdauer
                </h2>
                <p>
                  Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  6. Cookies
                </h2>
                <p>
                  Diese Website verwendet keine Tracking-Cookies oder Analyse-Tools von Drittanbietern. Es werden ausschließlich technisch notwendige Cookies verwendet, die für den Betrieb der Website erforderlich sind.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  7. Kontakt zum Datenschutzbeauftragten
                </h2>
                <p>
                  Bei Fragen zum Datenschutz wenden Sie sich bitte an: {companyConfig.contact.email}
                </p>
                <p className="mt-3 text-xs text-[#9CA3AF]">
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
