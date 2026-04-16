/*
 * ProClean FAQ-Seite
 * Design: Architektonischer Minimalismus
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ChevronDown, ArrowRight, Phone } from "lucide-react";
import { trackCtaClick, trackPhoneClick } from "@/lib/analytics";
import { companyConfig } from "@/config/company";
import { fetchPublicCmsPage } from "@/lib/cms";
import { applyPageSeo, resolveSeoValue } from "@/lib/seo";
import { getDefaultCmsPageContent, normalizeCmsPageContent, type CmsFaqContent } from "@shared/cms";

const faqs = [
  {
    category: "Allgemeines",
    items: [
      {
        q: "Für welche Objekte bieten Sie Ihre Reinigungsleistungen an?",
        a: "Wir reinigen gewerbliche Objekte aller Art: Büros, Praxen, Kanzleien, Hotels, Einzelhandel, Industrieanlagen, Schulen und weitere Einrichtungen. Sprechen Sie uns an – wir finden eine passende Lösung für Ihr Objekt.",
      },
      {
        q: "Wie schnell kann ich ein Angebot erhalten?",
        a: "Nach Ihrer Anfrage melden wir uns in der Regel innerhalb von 24 Stunden. Für ein genaues Angebot führen wir eine kostenlose Besichtigung Ihres Objekts durch – danach erhalten Sie ein transparentes, individuelles Angebot.",
      },
      {
        q: "Sind Ihre Mitarbeiter versichert?",
        a: "Ja, alle unsere Mitarbeiter sind vollständig sozialversichert und festangestellt. Unser Unternehmen verfügt über eine umfassende Betriebshaftpflichtversicherung, die alle Einsätze abdeckt.",
      },
      {
        q: "Arbeiten Sie mit Subunternehmern?",
        a: "Nein. Alle Reinigungsleistungen werden ausschließlich durch unser eigenes, festangestelltes Personal erbracht. Das garantiert gleichbleibende Qualität und Verlässlichkeit.",
      },
    ],
  },
  {
    category: "Leistungen & Ablauf",
    items: [
      {
        q: "Wie häufig wird gereinigt?",
        a: "Das hängt von Ihren Anforderungen und Ihrem Objekt ab. Wir bieten tägliche, wöchentliche oder individuelle Reinigungsintervalle an – ganz nach Ihrem Bedarf und Budget.",
      },
      {
        q: "Kann die Reinigung außerhalb unserer Geschäftszeiten stattfinden?",
        a: "Ja, das ist möglich und bei vielen unserer Kunden der Standard. Wir reinigen morgens vor Arbeitsbeginn, abends nach Feierabend oder am Wochenende – ganz wie es für Ihren Betrieb am besten passt.",
      },
      {
        q: "Was ist der Unterschied zwischen Unterhaltsreinigung und Grundreinigung?",
        a: "Die Unterhaltsreinigung ist die regelmäßige, kontinuierliche Reinigung nach festem Plan. Die Grundreinigung ist eine intensive Tiefenreinigung, die in größeren Abständen oder bei besonderem Bedarf (z.B. nach Renovierungen) durchgeführt wird.",
      },
      {
        q: "Bieten Sie auch Glasreinigung für Hochhäuser an?",
        a: "Ja, wir verfügen über zertifizierte Höhenarbeiter und das nötige Equipment für die Reinigung von Glasfassaden und schwer zugänglichen Bereichen.",
      },
    ],
  },
  {
    category: "Qualität & Vertrauen",
    items: [
      {
        q: "Wie stellen Sie gleichbleibende Qualität sicher?",
        a: "Durch feste Teams pro Objekt, regelmäßige Schulungen, dokumentierte Reinigungsprotokolle und persönliche Qualitätskontrollen durch unsere Objektleiter. Sie haben immer einen direkten Ansprechpartner.",
      },
      {
        q: "Was passiert, wenn ich mit der Reinigung nicht zufrieden bin?",
        a: "Sprechen Sie uns direkt an – wir reagieren schnell und unkompliziert. Ihr Feedback ist für uns wichtig, und wir lösen Probleme ohne bürokratischen Aufwand.",
      },
      {
        q: "Welche Reinigungsmittel verwenden Sie?",
        a: "Wir setzen auf umweltfreundliche, zertifizierte Reinigungsmittel, die wirksam und gleichzeitig schonend für Menschen und Oberflächen sind. Auf Wunsch können wir auch spezielle Produkte einsetzen.",
      },
      {
        q: "Kann ich mein Reinigungsteam kennenlernen?",
        a: "Selbstverständlich. Wir stellen Ihnen Ihr festes Team vor – damit Sie wissen, wer in Ihrem Objekt arbeitet. Vertrauen beginnt mit Transparenz.",
      },
    ],
  },
  {
    category: "Vertrag & Kosten",
    items: [
      {
        q: "Wie lange sind die Vertragslaufzeiten?",
        a: "Wir bieten flexible Vertragslaufzeiten an. Sprechen Sie uns an – wir finden eine Lösung, die zu Ihrem Unternehmen passt.",
      },
      {
        q: "Gibt es versteckte Kosten?",
        a: "Nein. Unser Angebot ist transparent und vollständig. Was wir anbieten, das berechnen wir – nicht mehr und nicht weniger.",
      },
      {
        q: "Ist das Angebot wirklich kostenlos?",
        a: "Ja, die Besichtigung, Beratung und Angebotserstellung sind vollständig kostenlos und unverbindlich.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="font-medium pc-text-primary text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`pc-text-brand shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-5 pr-8">
          <p className="pc-text-secondary text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
            {a}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [cmsContent, setCmsContent] = useState<CmsFaqContent>(() => getDefaultCmsPageContent("faq"));
  const resolvedCmsContent = normalizeCmsPageContent("faq", cmsContent);

  useEffect(() => {
    let active = true;

    void fetchPublicCmsPage("faq")
      .then((page) => {
        if (page && active) {
          setCmsContent(normalizeCmsPageContent("faq", page.content));
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    applyPageSeo({
      title: resolveSeoValue(
        resolvedCmsContent.seo.seoTitle,
        resolveSeoValue(resolvedCmsContent.finalCta.seoTitle, companyConfig.seo.title),
      ),
      description: resolveSeoValue(
        resolvedCmsContent.seo.seoDescription,
        resolveSeoValue(resolvedCmsContent.finalCta.seoDescription, companyConfig.seo.description),
      ),
    });
  }, [
    resolvedCmsContent.finalCta.seoDescription,
    resolvedCmsContent.finalCta.seoTitle,
    resolvedCmsContent.seo.seoDescription,
    resolvedCmsContent.seo.seoTitle,
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pc-bg-section">
      <Navigation />

      {/* Page Hero */}
      <section className="pc-page-hero">
        <div className="container">
          <div className="max-w-2xl">
            <span className="block w-12 h-0.5 pc-bg-accent mb-6" />
            <h1 className="text-4xl lg:text-5xl font-bold pc-text-primary mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Häufige Fragen
            </h1>
            <p className="pc-text-secondary text-lg leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              Hier finden Sie Antworten auf die häufigsten Fragen zu unseren Leistungen, Abläufen und Konditionen.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pc-section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {faqs.map((category) => (
              <div key={category.category} className="mb-10">
                <h2 className="text-lg font-bold pc-text-primary mb-4 pb-3 border-b-2 border-[#38BDF8] inline-block" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  {category.category}
                </h2>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6">
                  {category.items.map((item) => (
                    <FAQItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}

            {/* Still have questions */}
            <div className="pc-bg-soft border pc-border rounded-xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold pc-text-primary mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Noch Fragen?
              </h3>
              <p className="pc-text-secondary mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                Wir helfen Ihnen gerne persönlich weiter – per Telefon oder über unser Kontaktformular.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/kontakt">
                  <span onClick={() => trackCtaClick({ cta_id: "faq_contact", cta_text: "Kontakt aufnehmen", cta_location: "faq_final_cta", destination_url: "/kontakt" })} className="pc-btn-primary">
                    Kontakt aufnehmen
                    <ArrowRight size={16} />
                  </span>
                </Link>
                <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("faq_final_cta")} className="pc-btn-white">
                  <Phone size={16} />
                  {companyConfig.contact.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
