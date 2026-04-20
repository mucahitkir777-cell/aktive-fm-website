import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FAQPageStructuredData from "@/components/FAQPageStructuredData";
import { ChevronDown, ArrowRight, Phone, MessageCircle } from "lucide-react";
import { trackCtaClick, trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";
import { companyConfig } from "@/config/company";
import { fetchPublicCmsPage } from "@/lib/cms";
import { applyPageSeo, resolveSeoValue } from "@/lib/seo";
import { getDefaultCmsPageContent, normalizeCmsPageContent, type CmsFaqContent } from "@shared/cms";

type FaqItemType = { q: string; a: string };
type FaqCategory = { category: string; items: FaqItemType[] };

const DEFAULT_FAQS: FaqCategory[] = [
  {
    category: "Allgemeines",
    items: [
      {
        q: "Für welche Objekte arbeiten Sie?",
        a: "Wir reinigen vor allem Büros, Praxen, Kanzleien, Treppenhäuser, Gewerbeflächen und weitere gewerblich genutzte Objekte im Rhein-Main-Gebiet.",
      },
      {
        q: "In welchen Regionen sind Sie im Einsatz?",
        a: "Unser Schwerpunkt liegt in Neu-Isenburg, im Kreis Offenbach, in Frankfurt am Main und in Hanau.",
      },
      {
        q: "Wie schnell erhalte ich eine Rückmeldung?",
        a: "In der Regel melden wir uns innerhalb von 24 Stunden zurück und besprechen die nächsten Schritte direkt mit Ihnen.",
      },
    ],
  },
  {
    category: "Angebot & Start",
    items: [
      {
        q: "Wie läuft eine Anfrage ab?",
        a: "Nach Ihrer Anfrage stimmen wir die Anforderungen kurz mit Ihnen ab, besichtigen das Objekt bei Bedarf und erstellen ein transparentes Angebot.",
      },
      {
        q: "Wann kann die Reinigung starten?",
        a: "Das hängt von Objekt, Umfang und gewünschtem Intervall ab. Nach Abstimmung planen wir den Starttermin verbindlich mit Ihnen ein.",
      },
    ],
  },
  {
    category: "Leistungen & Ablauf",
    items: [
      {
        q: "Zu welchen Zeiten kann gereinigt werden?",
        a: "Je nach Objekt reinigen wir vor Arbeitsbeginn, tagsüber in abgestimmten Bereichen oder nach Betriebsschluss.",
      },
      {
        q: "Arbeiten Sie mit festen Teams?",
        a: "Ja, wenn möglich betreuen feste Reinigungsteams Ihr Objekt. Das verbessert Abstimmung, Sicherheit und gleichbleibende Qualität.",
      },
    ],
  },
  {
    category: "Qualität & Vertrauen",
    items: [
      {
        q: "Wie sichern Sie die Qualität?",
        a: "Durch eingearbeitete Teams, klare Leistungsverzeichnisse, direkte Ansprechpartner und regelmäßige Kontrollen.",
      },
      {
        q: "Arbeiten Sie mit Subunternehmern?",
        a: "Nein. Wir setzen auf eigene, festangestellte Mitarbeiter und direkte Verantwortung im Objekt.",
      },
    ],
  },
  {
    category: "Vertrag & Kosten",
    items: [
      {
        q: "Gibt es versteckte Kosten?",
        a: "Nein. Unsere Angebote sind nachvollziehbar aufgebaut und enthalten die abgestimmten Leistungen transparent.",
      },
    ],
  },
];

function parseFaqText(faqText: string): FaqCategory[] {
  const lines = faqText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return DEFAULT_FAQS;
  }

  const grouped = new Map<string, FaqItemType[]>();

  for (const line of lines) {
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length < 3) {
      return DEFAULT_FAQS;
    }

    const [category, question, ...answerParts] = parts;
    const answer = answerParts.join(" | ").trim();
    if (!category || !question || !answer) {
      return DEFAULT_FAQS;
    }

    const current = grouped.get(category) ?? [];
    current.push({ q: question, a: answer });
    grouped.set(category, current);
  }

  const categories = Array.from(grouped.entries()).map(([category, items]) => ({ category, items }));
  return categories.length > 0 ? categories : DEFAULT_FAQS;
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b pc-border last:border-0">
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

  const faqCategories = useMemo(
    () => parseFaqText(resolvedCmsContent.questions.faqText),
    [resolvedCmsContent.questions.faqText],
  );

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
      title: resolveSeoValue(resolvedCmsContent.seo.seoTitle, companyConfig.seo.title),
      description: resolveSeoValue(resolvedCmsContent.seo.seoDescription, companyConfig.seo.description),
    });
  }, [
    resolvedCmsContent.seo.seoDescription,
    resolvedCmsContent.seo.seoTitle,
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pc-bg-section">
      <FAQPageStructuredData faqCategories={faqCategories} pagePath="/faq" />
      <Navigation />

      <section className="pc-page-hero">
        <div className="container">
          <div className="max-w-2xl">
            <span className="block w-12 h-0.5 pc-bg-accent mb-6" />
            <h1 className="text-4xl lg:text-5xl font-bold pc-text-primary mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              {resolvedCmsContent.hero.title}
            </h1>
            <p className="pc-text-secondary text-lg leading-relaxed mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
              {resolvedCmsContent.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/kontakt">
                <span onClick={() => trackCtaClick({ cta_id: "faq_hero_contact", cta_text: resolvedCmsContent.hero.buttonText, cta_location: "faq_hero", destination_url: "/kontakt" })} className="pc-btn-primary">
                  {resolvedCmsContent.hero.buttonText}
                  <ArrowRight size={16} />
                </span>
              </Link>
              <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("faq_hero")} className="pc-btn-white">
                <Phone size={16} />
                Jetzt anrufen
              </a>
              <a
                href={companyConfig.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("faq_hero")}
                className="pc-btn-whatsapp"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
            <p className="mt-4 text-sm pc-text-secondary" style={{ fontFamily: "Inter, sans-serif" }}>
              Antwort in der Regel innerhalb von {companyConfig.metrics.responseTime}.
            </p>
          </div>
        </div>
      </section>

      <section className="pc-section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="mb-10">
              <h2 className="text-2xl font-bold pc-text-primary mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.questions.title}
              </h2>
              <p className="pc-text-secondary" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.questions.subtitle}
              </p>
            </div>

            {faqCategories.map((category) => (
              <div key={category.category} className="mb-10">
                <h2 className="text-lg font-bold pc-text-primary mb-4 pb-3 border-b-2 border-[var(--color-accent)] inline-block" style={{ fontFamily: "Inter, sans-serif" }}>
                  {category.category}
                </h2>
                <div className="bg-white rounded-xl border pc-border shadow-sm px-6">
                  {category.items.map((item) => (
                    <FAQItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}

            <div className="pc-bg-soft border pc-border rounded-xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold pc-text-primary mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.finalCta.title}
              </h3>
              <p className="pc-text-secondary mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.finalCta.body}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/kontakt">
                  <span onClick={() => trackCtaClick({ cta_id: "faq_contact", cta_text: resolvedCmsContent.finalCta.primaryButtonText, cta_location: "faq_final_cta", destination_url: "/kontakt" })} className="pc-btn-primary">
                    {resolvedCmsContent.finalCta.primaryButtonText}
                    <ArrowRight size={16} />
                  </span>
                </Link>
                <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("faq_final_cta")} className="pc-btn-white">
                  <Phone size={16} />
                  {companyConfig.contact.phoneDisplay}
                </a>
                <a
                  href={companyConfig.contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick("faq_final_cta")}
                  className="pc-btn-whatsapp"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <MessageCircle size={16} />
                  WhatsApp
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
