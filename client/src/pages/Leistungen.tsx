/*
 * Aktive Facility Management Leistungen-Seite
 * Design: Architektonischer Minimalismus
 */

import { Link } from "wouter";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ServiceStructuredData from "@/components/ServiceStructuredData";
import { trackCtaClick, trackPhoneClick, trackServiceInterest } from "@/lib/analytics";
import { companyConfig } from "@/config/company";
import { fetchPublicCmsPage } from "@/lib/cms";
import { applyPageSeo, resolveSeoValue } from "@/lib/seo";
import { getDefaultCmsPageContent, type CmsServicesContent } from "@shared/cms";
import {
  ArrowRight,
  CheckCircle,
  Phone,
  MessageCircle,
  Building2,
  Sparkles,
  Wind,
  Layers,
  Wrench,
  Home as HomeIcon,
} from "lucide-react";

const IMAGES = {
  serviceGlass: "https://d2xsxph8kpxj0f.cloudfront.net/310519663547187307/43Rukg9YxBYUx2aiERC352/service-glass-RSr9dJatK4isuPRMPxyn8n.webp",
  serviceOffice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663547187307/43Rukg9YxBYUx2aiERC352/service-office-YPatmHc5sFH6C2yr9bLqK8.webp",
  heroOffice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663547187307/43Rukg9YxBYUx2aiERC352/hero-office-VNZtTnE2YeTnTnK8cq3QYi.webp",
};

const services = [
  {
    icon: Building2,
    title: "Büroreinigung",
    slug: "buero",
    shortDesc: "Regelmäßige Reinigung für Arbeitsplätze und Besprechungsbereiche.",
    fullDesc: "Wir reinigen Büroflächen so, dass Arbeitsplätze, Besprechungsräume, Küchen und Sanitärbereiche dauerhaft gepflegt bleiben. Die Einsätze werden passend zu Ihrem Betriebsablauf geplant und mit festen Ansprechpartnern abgestimmt.",
    features: [
      "Reinigung im abgestimmten Intervall",
      "Einsätze vor, während oder nach dem Betrieb möglich",
      "Feste Teams für wiederkehrende Objekte",
      "Saubere Pflege von Arbeits-, Küchen- und Sanitärbereichen",
      "Regelmäßige Qualitätskontrollen",
    ],
    image: IMAGES.heroOffice,
  },
  {
    icon: Sparkles,
    title: "Unterhaltsreinigung",
    slug: "unterhalts",
    shortDesc: "Laufende Reinigung nach klarem Leistungsverzeichnis.",
    fullDesc: "Die Unterhaltsreinigung bildet die verlässliche Basis für saubere Immobilien im Alltag. Wir definieren gemeinsam mit Ihnen Leistungen, Intervalle und Zuständigkeiten und setzen diese planbar im laufenden Betrieb um.",
    features: [
      "Individuelle Reinigungsintervalle",
      "Leistungen nach abgestimmtem Reinigungsplan",
      "Verlässliche Vertretung bei Ausfällen",
      "Nachvollziehbare Abrechnung",
      "Direkter Ansprechpartner",
    ],
    image: IMAGES.serviceOffice,
  },
  {
    icon: Wind,
    title: "Glasreinigung",
    slug: "glas",
    shortDesc: "Streifenfreie Reinigung von Fenstern und Glasflächen.",
    fullDesc: "Saubere Glasflächen prägen den ersten Eindruck Ihres Standorts. Wir reinigen Fenster, Schaufenster, Eingangsbereiche und Innenverglasungen gründlich, streifenfrei und passend zu den Gegebenheiten Ihres Objekts.",
    features: [
      "Innen- und Außenreinigung",
      "Fenster, Eingänge und Glasfronten",
      "Schaufenster und Schaufronten",
      "Glastrennwände und Innenverglasung",
      "Abgestimmte Intervalle für dauerhaft gepflegte Glasflächen",
    ],
    image: IMAGES.serviceGlass,
  },
  {
    icon: Layers,
    title: "Treppenhaus & Außenanlagen",
    slug: "treppenhaus",
    shortDesc: "Pflege von Treppenhäusern, Eingängen und Außenflächen.",
    fullDesc: "Treppenhäuser, Eingangsbereiche und Außenflächen werden im Alltag stark beansprucht. Wir sorgen dafür, dass diese Zonen sauber, ordentlich und für Mitarbeiter, Besucher oder Bewohner jederzeit gepflegt wirken.",
    features: [
      "Treppenhäuser und Flure",
      "Eingangsbereiche und Foyers",
      "Aufzüge und Aufzugskabinen",
      "Außenflächen und Zuwegungen",
      "Müllbereiche und Allgemeinflächen",
    ],
    image: IMAGES.heroOffice,
  },
  {
    icon: Wrench,
    title: "Grundreinigung",
    slug: "grund",
    shortDesc: "Intensive Reinigung für stark beanspruchte Flächen.",
    fullDesc: "Wenn laufende Reinigung nicht mehr ausreicht, übernimmt die Grundreinigung die gründliche Aufarbeitung von Böden, Oberflächen und schwer erreichbaren Bereichen. Sie eignet sich besonders bei hoher Beanspruchung, vor Übergaben oder nach Umbauten.",
    features: [
      "Intensive Bodenreinigung und Pflege",
      "Entfernung hartnäckiger Verschmutzungen",
      "Aufarbeitung stark beanspruchter Bereiche",
      "Geeignet vor Übergaben oder nach Umbauten",
      "Maschinelle Verfahren nach Bedarf",
    ],
    image: IMAGES.serviceOffice,
  },
  {
    icon: HomeIcon,
    title: "Sonderreinigung",
    slug: "sonder",
    shortDesc: "Spezielle Leistungen für besondere Anforderungen.",
    fullDesc: "Nicht jede Reinigungsaufgabe lässt sich mit Standardleistungen abdecken. Für besondere Anforderungen planen wir Sonderreinigungen individuell nach Objekt, Anlass und gewünschtem Ergebnis.",
    features: [
      "Baureinigung nach Umbau oder Renovierung",
      "Zusatzleistungen für besondere Anlässe",
      "Reinigung hygienisch sensibler Bereiche",
      "Individuelle Sonderaufträge nach Abstimmung",
      "Konzepte passend zum Objekt",
    ],
    image: IMAGES.serviceGlass,
  },
];

function mergeCmsSection<T extends Record<string, string>>(defaults: T, content: unknown): T {
  if (!content || typeof content !== "object") {
    return defaults;
  }

  const provided = content as Record<string, unknown>;
  return Object.keys(defaults).reduce((result, key) => {
    const value = provided[key];
    return {
      ...result,
      [key]: typeof value === "string" ? (value as string) : defaults[key as keyof T],
    };
  }, {} as T);
}

function mergeCmsServicesContent(content: unknown): CmsServicesContent {
  const defaults = getDefaultCmsPageContent("leistungen");

  if (!content || typeof content !== "object") {
    return defaults;
  }

  return {
    hero: mergeCmsSection(defaults.hero, (content as Record<string, unknown>).hero),
    overview: mergeCmsSection(defaults.overview, (content as Record<string, unknown>).overview),
    benefits: mergeCmsSection(defaults.benefits, (content as Record<string, unknown>).benefits),
    finalCta: mergeCmsSection(defaults.finalCta, (content as Record<string, unknown>).finalCta),
    seo: mergeCmsSection(defaults.seo, (content as Record<string, unknown>).seo),
  };
}

export default function Leistungen() {
  const [cmsContent, setCmsContent] = useState<CmsServicesContent>(() => getDefaultCmsPageContent("leistungen"));
  const resolvedCmsContent = mergeCmsServicesContent(cmsContent);
  const heroImageUrl = resolvedCmsContent.hero.imageUrl || IMAGES.heroOffice;
  const detailImagePrimary = resolvedCmsContent.overview.imageUrl1;
  const detailImageSecondary = resolvedCmsContent.overview.imageUrl2;

  const handleServiceCtaClick = (ctaId: string, ctaText: string, ctaLocation: string, destinationUrl: string, serviceTitle?: string, serviceId?: string) => {
    if (serviceTitle) {
      trackServiceInterest(serviceTitle, {
        service_id: serviceId,
        cta_location: ctaLocation,
        destination_url: destinationUrl,
      });
    }

    trackCtaClick({
      cta_id: ctaId,
      cta_text: ctaText,
      cta_location: ctaLocation,
      destination_url: destinationUrl,
      service_type: serviceTitle,
      service_id: serviceId,
    });
  };

  useEffect(() => {
    let active = true;

    void fetchPublicCmsPage("leistungen")
      .then((page) => {
        if (page && active) {
          setCmsContent(mergeCmsServicesContent(page.content));
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const seoTitle = resolveSeoValue(resolvedCmsContent.seo.seoTitle, companyConfig.seo.title);
    const seoDescription = resolveSeoValue(resolvedCmsContent.seo.seoDescription, companyConfig.seo.description);

    applyPageSeo({
      title: seoTitle,
      description: seoDescription,
    });
  }, [
    resolvedCmsContent.seo.seoDescription,
    resolvedCmsContent.seo.seoTitle,
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".pc-fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen pc-bg-section">
      <ServiceStructuredData services={services} />
      <Navigation />

      {/* Page Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 border-b pc-border bg-gradient-to-b from-white to-[var(--color-bg-section)]">
        <div className="absolute inset-0">
          <img
            src={heroImageUrl}
            alt="Reinigungsleistungen"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/88 to-white/72" />
        </div>
        <div className="container">
          <div className="relative z-10 max-w-2xl">
            <span className="block w-12 h-0.5 pc-bg-accent mb-6" />
            <h1 className="text-4xl lg:text-5xl font-bold pc-text-primary mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              {resolvedCmsContent.hero.title}
            </h1>
            <p className="pc-text-secondary text-lg leading-relaxed mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
              {resolvedCmsContent.hero.subtitle}
            </p>

            {/* Hero CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/kontakt">
                <span onClick={() => handleServiceCtaClick("services_hero_offer", resolvedCmsContent.hero.buttonText, "services_hero", "/kontakt")} className="pc-btn-primary">
                  {resolvedCmsContent.hero.buttonText}
                  <ArrowRight size={16} />
                </span>
              </Link>
              <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("services_hero")} className="pc-btn-white">
                <Phone size={16} />
                Jetzt anrufen
              </a>
              <a
                href={companyConfig.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCtaClick({ cta_id: "services_hero_whatsapp", cta_text: "WhatsApp", cta_location: "services_hero", destination_url: companyConfig.contact.whatsappHref })}
                className="pc-btn-whatsapp"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
          <p className="mt-4 text-sm pc-text-secondary" style={{ fontFamily: "Inter, sans-serif" }}>
            Kostenlos & unverbindlich. Rückmeldung in der Regel innerhalb von {companyConfig.metrics.responseTime}.
          </p>
          </div>
        </div>
      </section>

      <section className="pc-section">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <div>
              <h2 className="pc-section-title">{resolvedCmsContent.overview.title}</h2>
              <p className="mt-4 pc-text-secondary text-base leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.overview.subtitle}
              </p>
            </div>

            <div className="rounded-3xl border pc-border bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-semibold pc-text-primary mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.benefits.title}
              </h3>
              <p className="pc-text-secondary leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.benefits.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="pc-section">
        <div className="container">
          <div className="space-y-16 lg:space-y-24">
            {services.map((service, i) => {
              const cmsServiceImageUrl =
                (i % 2 === 0 ? detailImagePrimary : detailImageSecondary) || detailImagePrimary || detailImageSecondary || service.image;

              return (
                <div
                  key={service.slug}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center pc-fade-up`}
                >
                  {/* Image */}
                  <div className={`relative ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="overflow-hidden rounded-lg shadow-lg">
                      <img
                        src={cmsServiceImageUrl}
                        alt={service.title}
                        className="w-full h-64 sm:h-72 lg:h-96 object-contain sm:object-cover bg-[var(--color-bg-soft)] sm:hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute -bottom-3 -left-3 pc-bg-brand text-white rounded-lg p-4 shadow-lg">
                      <service.icon size={22} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                    <h2 className="text-2xl lg:text-3xl font-bold pc-text-primary mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                      {service.title}
                    </h2>
                    <p className="pc-text-secondary leading-relaxed mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                      {service.fullDesc}
                    </p>

                    <ul className="space-y-2.5 mb-7">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <CheckCircle size={16} className="pc-text-brand mt-0.5 shrink-0" />
                          <span className="pc-text-primary text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href="/kontakt">
                        <span onClick={() => handleServiceCtaClick(`service_${service.slug}_offer`, "Angebot anfragen", "services_detail", "/kontakt", service.title, service.slug)} className="pc-btn-primary">
                          Angebot anfragen
                          <ArrowRight size={16} />
                        </span>
                      </Link>
                      <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("services_detail", { service_type: service.title, service_id: service.slug })} className="pc-btn-outline">
                        <Phone size={16} />
                        Anrufen
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA - Lead-Maschine */}
      <section className="pc-bg-soft py-16 lg:py-20 border-y pc-border">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold pc-text-primary mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
            {resolvedCmsContent.finalCta.title}
          </h2>
          <p className="pc-text-secondary mb-8 max-w-lg mx-auto text-lg" style={{ fontFamily: "Inter, sans-serif" }}>
            {resolvedCmsContent.finalCta.body}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/kontakt">
              <span onClick={() => handleServiceCtaClick("services_final_offer", resolvedCmsContent.finalCta.primaryButtonText, "services_final_cta", "/kontakt")} className="pc-btn-primary text-lg">
                {resolvedCmsContent.finalCta.primaryButtonText}
                <ArrowRight size={16} />
              </span>
            </Link>
            <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("services_final_cta")} className="pc-btn-white text-lg">
              <Phone size={16} />
              Jetzt anrufen
            </a>
            <a
              href={companyConfig.contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCtaClick({ cta_id: "services_final_whatsapp", cta_text: "WhatsApp", cta_location: "services_final_cta", destination_url: companyConfig.contact.whatsappHref })}
              className="pc-btn-whatsapp text-lg"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
          <p className="mt-4 pc-text-secondary text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Direkter Kontakt per Telefon, WhatsApp oder Anfrageformular.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}


