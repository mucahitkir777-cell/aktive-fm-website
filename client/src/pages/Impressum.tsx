/*
 * ProClean Impressum-Seite
 * Design: Architektonischer Minimalismus
 */

import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { companyConfig } from "@/config/company";

export default function Impressum() {
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
              Impressum
            </h1>
            <p className="text-white/60" style={{ fontFamily: "Inter, sans-serif" }}>
              Angaben gemäß § 5 TMG
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pc-section">
        <div className="container">
          <div className="max-w-3xl">
            <div className="bg-white rounded-xl p-8 lg:p-10 border border-gray-100 shadow-sm space-y-8">

              <div>
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  Angaben gemäß § 5 TMG
                </h2>
                <div className="text-[#6B7A8D] text-sm leading-relaxed space-y-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  <p className="font-semibold text-[#1A2332]">{companyConfig.brand.legalName}</p>
                  {companyConfig.address.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p>{companyConfig.address.country}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  Kontakt
                </h2>
                <div className="text-[#6B7A8D] text-sm leading-relaxed space-y-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  <p>Telefon: {companyConfig.contact.phoneDisplay}</p>
                  <p>E-Mail: {companyConfig.contact.email}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  Vertreten durch
                </h2>
                <div className="text-[#6B7A8D] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  <p>Geschäftsführer: {companyConfig.legal.managingDirector}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  Registereintrag
                </h2>
                <div className="text-[#6B7A8D] text-sm leading-relaxed space-y-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  <p>Eintragung im Handelsregister</p>
                  <p>Registergericht: {companyConfig.legal.registerCourt}</p>
                  <p>Registernummer: {companyConfig.legal.registerNumber}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  Umsatzsteuer-ID
                </h2>
                <div className="text-[#6B7A8D] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
                  <p>{companyConfig.legal.vatId}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  Berufsbezeichnung und berufsrechtliche Regelungen
                </h2>
                <div className="text-[#6B7A8D] text-sm leading-relaxed space-y-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  <p>Berufsbezeichnung: {companyConfig.legal.profession}</p>
                  <p>Zuständige Kammer: {companyConfig.legal.chamber}</p>
                  <p>Verliehen in: {companyConfig.address.country}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  Haftung für Inhalte
                </h2>
                <p className="text-[#6B7A8D] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>
                <p className="text-[#6B7A8D] text-sm leading-relaxed mt-3" style={{ fontFamily: "Inter, sans-serif" }}>
                  Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  Haftung für Links
                </h2>
                <p className="text-[#6B7A8D] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  Urheberrecht
                </h2>
                <p className="text-[#6B7A8D] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  Hinweis zu beteiligten Unternehmen
                </h2>
                <p className="text-[#6B7A8D] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  {companyConfig.legal.providerNote}
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
