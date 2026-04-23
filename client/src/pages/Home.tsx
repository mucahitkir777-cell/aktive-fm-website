/*
 * Aktive Facility Management Startseite
 * Design: Architektonischer Minimalismus
 * Conversion-Architektur: Hero → Trust → Leistungen → USPs → Prozess → Testimonials → CTA
 * Bilder: KI-generierte Premium-Bilder von CDN
 */

import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TestimonialsSection from "@/components/TestimonialsSection";
import { fetchPublicCmsPage } from "@/lib/cms";
import { trackCtaClick, trackLocationInterest, trackPhoneClick, trackServiceInterest, trackWhatsAppClick } from "@/lib/analytics";
import { applyPageSeo, resolveSeoValue } from "@/lib/seo";
import { leadRegions } from "@/data/leadTargets";
import { companyConfig } from "@/config/company";
import { getDefaultCmsPageContent, type CmsHomeContent } from "@shared/cms";
import {
  ArrowRight,
  CheckCircle,
  Phone,
  MapPin,
  Star,
  Shield,
  Clock,
  Award,
  Users,
  ChevronRight,
  Building2,
  Sparkles,
  Layers,
  Wind,
  Wrench,
  Home as HomeIcon,
  MessageCircle,
} from "lucide-react";

// CDN Image URLs
const IMAGES = {
  heroMain: "https://d2xsxph8kpxj0f.cloudfront.net/310519663547187307/43Rukg9YxBYUx2aiERC352/hero-main-MhWUtu2g4B65dQbQqy2gAG.webp",
  heroOffice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663547187307/43Rukg9YxBYUx2aiERC352/hero-office-VNZtTnE2YeTnTnK8cq3QYi.webp",
  serviceGlass: "https://d2xsxph8kpxj0f.cloudfront.net/310519663547187307/43Rukg9YxBYUx2aiERC352/service-glass-RSr9dJatK4isuPRMPxyn8n.webp",
  serviceOffice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663547187307/43Rukg9YxBYUx2aiERC352/service-office-YPatmHc5sFH6C2yr9bLqK8.webp",
  aboutTeam: "https://d2xsxph8kpxj0f.cloudfront.net/310519663547187307/43Rukg9YxBYUx2aiERC352/about-team-TkNpxcp8EkwwruinupRxfN.webp",
};

const services = [
  {
    icon: Building2,
    title: "Büroreinigung",
    desc: "Saubere Arbeitsplätze, Besprechungsräume und Sanitärbereiche im festen Intervall.",
    href: "/buero-reinigung-frankfurt",
  },
  {
    icon: Sparkles,
    title: "Unterhaltsreinigung",
    desc: "Laufende Reinigung nach Leistungsverzeichnis und abgestimmten Einsatztagen.",
    href: "/leistungen",
  },
  {
    icon: Wind,
    title: "Glasreinigung",
    desc: "Fenster, Glasflächen und Eingangsbereiche streifenfrei und sauber gepflegt.",
    href: "/glasreinigung-frankfurt",
  },
  {
    icon: Layers,
    title: "Treppenhaus & Außen",
    desc: "Treppenhäuser, Eingänge und Außenbereiche ordentlich und gepflegt gehalten.",
    href: "/leistungen",
  },
  {
    icon: Wrench,
    title: "Grundreinigung",
    desc: "Intensive Reinigung bei starkem Verschmutzungsgrad, vor Übergaben oder nach Umbauten.",
    href: "/leistungen",
  },
  {
    icon: HomeIcon,
    title: "Sonderreinigung",
    desc: "Spezielle Leistungen für besondere Anforderungen, Materialien oder Situationen.",
    href: "/leistungen",
  },
];

const primaryRegionIds = ["neu_isenburg", "frankfurt_am_main", "hanau", "kreis_offenbach"] as const;

const prioritizedRegionalLinks = [
  { label: "Gebäudereinigung Frankfurt", href: "/gebaeudereinigung-frankfurt" },
  { label: "Büroreinigung Frankfurt", href: "/buero-reinigung-frankfurt" },
  { label: "Glasreinigung Frankfurt", href: "/glasreinigung-frankfurt" },
  { label: "Praxisreinigung Frankfurt", href: "/praxisreinigung-frankfurt" },
  { label: "Bauendreinigung Frankfurt", href: "/bauendreinigung-frankfurt" },
  { label: "Gebäudereinigung Neu-Isenburg", href: "/gebaeudereinigung-neu-isenburg" },
  { label: "Gebäudereinigung Kreis Offenbach", href: "/gebaeudereinigung-kreis-offenbach" },
];

const usps = [
  {
    icon: Shield,
    title: "Vollständig versichert",
    desc: "Haftpflichtversichert und mit klaren Zuständigkeiten im laufenden Einsatz.",
  },
  {
    icon: Users,
    title: "Festes Reinigungsteam",
    desc: "Wiederkehrende Ansprechpartner und eingearbeitete Teams für Ihr Objekt.",
  },
  {
    icon: Clock,
    title: "Pünktlich & zuverlässig",
    desc: "Verbindliche Einsatzzeiten und saubere Abstimmung mit Ihrem Betriebsablauf.",
  },
  {
    icon: Award,
    title: "Geprüfte Qualität",
    desc: "Kontrollen, Rückmeldeschleifen und direkte Erreichbarkeit statt anonymer Übergaben.",
  },
];

const processSteps = [
  {
    num: "01",
    title: "Anfrage senden",
    desc: "Sie nennen Objekt, Standort und gewünschten Rhythmus. Wir melden uns kurzfristig zurück.",
    imageUrl: IMAGES.aboutTeam,
    imageAlt: "Persoenliche Erstberatung zur Reinigungsanfrage",
    imagePosition: "center",
  },
  {
    num: "02",
    title: "Objekt abstimmen",
    desc: "Bei Bedarf sehen wir uns die Flächen vor Ort an und klären Aufwand, sensible Bereiche und Zeiten.",
    imageUrl: IMAGES.heroOffice,
    imageAlt: "Vor-Ort-Termin zur Besichtigung des Objekts",
    imagePosition: "center",
  },
  {
    num: "03",
    title: "Angebot erhalten",
    desc: "Sie bekommen ein nachvollziehbares Angebot mit klaren Leistungen, Intervallen und Kosten.",
    imageUrl: IMAGES.heroMain,
    imageAlt: "Planung und Erstellung eines individuellen Reinigungsangebots",
    imagePosition: "center",
  },
  {
    num: "04",
    title: "Einsatz starten",
    desc: "Nach Freigabe beginnt Ihr fest eingeplantes Reinigungsteam zum vereinbarten Termin.",
    imageUrl: IMAGES.serviceGlass,
    imageAlt: "Professionelle Reinigung im Einsatz",
    imagePosition: "center",
  },
];

const testimonials = [
  {
    name: "Michael K.",
    company: "Geschäftsführer, IT-Unternehmen",
    text: `Seit zwei Jahren arbeiten wir mit ${companyConfig.brand.name} zusammen. Das Team ist immer pünktlich, gründlich und diskret. Unsere Büroräume waren noch nie so sauber.`,
    stars: 5,
  },
  {
    name: "Sandra M.",
    company: "Facility Managerin, Immobilienverwaltung",
    text: "Endlich ein Reinigungsunternehmen, das hält, was es verspricht. Feste Ansprechpartner, transparente Abrechnung und konstant hohe Qualität.",
    stars: 5,
  },
  {
    name: "Thomas B.",
    company: "Inhaber, Arztpraxis",
    text: `Für unsere Praxis ist Hygiene keine Option, sondern Pflicht. ${companyConfig.brand.name} erfüllt unsere hohen Anforderungen zuverlässig und professionell.`,
    stars: 5,
  },
];

const sectors = [
  {
    label: "Büro & Verwaltung",
    icon: Building2,
    imageUrl: IMAGES.heroOffice,
    imageAlt: "Bueroreinigung fuer Verwaltung und Office-Flaechen",
    imagePosition: "center",
  },
  {
    label: "Arzt & Praxis",
    icon: Shield,
    imageUrl: IMAGES.serviceOffice,
    imageAlt: "Reinigung fuer Arztpraxis und medizinische Bereiche",
    imagePosition: "center",
  },
  {
    label: "Hotel & Gastronomie",
    icon: Star,
    imageUrl: IMAGES.heroMain,
    imageAlt: "Reinigung fuer Hotel und Gastronomie",
    imagePosition: "center",
  },
  {
    label: "Industrie & Logistik",
    icon: Layers,
    imageUrl: IMAGES.serviceGlass,
    imageAlt: "Reinigung fuer Industrie und Logistikflaechen",
    imagePosition: "center",
  },
  {
    label: "Bildung & Kitas",
    icon: Users,
    imageUrl: IMAGES.aboutTeam,
    imageAlt: "Reinigung fuer Bildungseinrichtungen und Kitas",
    imagePosition: "center",
  },
  {
    label: "Handel & Retail",
    icon: Award,
    imageUrl: IMAGES.heroOffice,
    imageAlt: "Reinigung fuer Handel und Retail-Flaechen",
    imagePosition: "right center",
  },
];

const trustSectionQuotes = [
  "Saubere Ausführung, verlässliche Termine und schnelle Abstimmung.",
  "Professioneller Ablauf und konstante Qualität im laufenden Einsatz.",
  "Freundliche Kommunikation, klare Angebote und überzeugende Ergebnisse.",
  "Branchenprofil mit aktuellen Unternehmensdaten und öffentlicher Bewertung.",
  "Plattformprofil mit zusammengefassten Bewertungen und Unternehmensangaben.",
];

const trustSectionCertifications = [
  {
    id: "hwk",
    title: "Handwerkskammer Frankfurt Rhein-Main",
    text: "Eingetragenes Unternehmen der Handwerkskammer Frankfurt Rhein-Main",
    imageSrc: "/assets/handwerkskammer-frankfurt-rhein-main.jpg",
    imageAlt: "Handwerkskammer Frankfurt Rhein-Main",
  },
  {
    id: "bg-bau",
    title: "BG Bau",
    text: "Mitglied der Berufsgenossenschaft der Bauwirtschaft (BG BAU)",
    imageSrc: "/assets/bg-bau.png",
    imageAlt: "BG Bau",
  },
];

const HOME_CMS_CACHE_KEY = "proclean:cms:home:v1";

function mergeCmsSection<T extends Record<string, string>>(defaults: T, content: unknown): T {
  if (!content || typeof content !== "object") {
    return defaults;
  }

  const provided = content as Record<string, unknown>;
  return Object.keys(defaults).reduce((result, key) => {
    const value = provided[key];
    return {
      ...result,
      [key]: typeof value === "string" ? value : defaults[key as keyof T],
    };
  }, {} as T);
}

function mergeCmsHomeContent(content: unknown): CmsHomeContent {
  const defaults = getDefaultCmsPageContent("home");
  if (!content || typeof content !== "object") {
    return defaults;
  }

  return {
    hero: mergeCmsSection(defaults.hero, (content as Record<string, unknown>).hero),
    services: mergeCmsSection(defaults.services, (content as Record<string, unknown>).services),
    usps: mergeCmsSection(defaults.usps, (content as Record<string, unknown>).usps),
    reviews: mergeCmsSection(defaults.reviews, (content as Record<string, unknown>).reviews),
    finalCta: mergeCmsSection(defaults.finalCta, (content as Record<string, unknown>).finalCta),
    seo: mergeCmsSection(defaults.seo, (content as Record<string, unknown>).seo),
  };
}

function getCachedHomeContent(): CmsHomeContent | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(HOME_CMS_CACHE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return mergeCmsHomeContent(JSON.parse(raw));
  } catch {
    return null;
  }
}

function setCachedHomeContent(content: CmsHomeContent) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(HOME_CMS_CACHE_KEY, JSON.stringify(content));
}

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement>(null);
  const [cmsContent, setCmsContent] = useState<CmsHomeContent>(() => getCachedHomeContent() ?? getDefaultCmsPageContent("home"));
  const [isHeroContentStable, setIsHeroContentStable] = useState<boolean>(() => getCachedHomeContent() !== null);
  const resolvedCmsContent = mergeCmsHomeContent(cmsContent);
  const trustLogoClasses: Record<string, string> = {
    google: "max-h-9 max-w-[148px]",
    trustpilot: "max-h-8 max-w-[164px]",
    provenexpert: "max-h-8 max-w-[156px]",
    "11880": "max-h-10 max-w-[176px]",
    trustlocal: "max-h-8 max-w-[164px]",
  };
  const trustLogoIntrinsicSizes: Record<string, { width: number; height: number }> = {
    google: { width: 160, height: 48 },
    trustpilot: { width: 160, height: 48 },
    provenexpert: { width: 2000, height: 550 },
    "11880": { width: 328, height: 162 },
    trustlocal: { width: 160, height: 48 },
  };
  const heroImageUrl = resolvedCmsContent.hero.imageUrl || IMAGES.heroMain;
  const uspsImageUrl = resolvedCmsContent.usps.imageUrl || IMAGES.heroOffice;
  const servicesFeatureImageUrl = resolvedCmsContent.services.imageUrl || IMAGES.serviceGlass;
  const finalCtaImageUrl = resolvedCmsContent.finalCta.imageUrl || IMAGES.aboutTeam;
  const homeReviewItems = [
    {
      id: "google",
      name: "Google",
      logoUrl: resolvedCmsContent.reviews.googleImageUrl,
      score: resolvedCmsContent.reviews.googleScore,
      label: resolvedCmsContent.reviews.googleLabel,
      href: "https://www.google.com/search?tbm=lcl&q=Aktive+Facility+Management+GmbH+Neu-Isenburg",
      quote: trustSectionQuotes[0],
    },
    {
      id: "trustpilot",
      name: "Trustpilot",
      logoUrl: resolvedCmsContent.reviews.trustpilotImageUrl,
      score: resolvedCmsContent.reviews.trustpilotScore,
      label: resolvedCmsContent.reviews.trustpilotLabel,
      href: "https://de.trustpilot.com/search?query=Aktive%20Facility%20Management%20GmbH",
      quote: trustSectionQuotes[1],
    },
    {
      id: "provenexpert",
      name: "ProvenExpert",
      logoUrl: resolvedCmsContent.reviews.provenexpertImageUrl,
      score: resolvedCmsContent.reviews.provenexpertScore,
      label: resolvedCmsContent.reviews.provenexpertLabel,
      href: "https://www.provenexpert.com/aktive-facility-management-gmbh/",
      quote: trustSectionQuotes[2],
    },
    {
      id: "11880",
      name: "11880.com",
      logoUrl: resolvedCmsContent.reviews.oneOneEightEightZeroImageUrl,
      score: resolvedCmsContent.reviews.oneOneEightEightZeroScore,
      label: resolvedCmsContent.reviews.oneOneEightEightZeroLabel,
      href: "https://www.11880.com/branchenbuch/dreieich/061331911B107212052/aktive-facility-management-gmbh.html",
      quote: trustSectionQuotes[3],
    },
    {
      id: "trustlocal",
      name: "Trustlocal",
      logoUrl: resolvedCmsContent.reviews.trustlocalImageUrl,
      score: resolvedCmsContent.reviews.trustlocalScore,
      label: resolvedCmsContent.reviews.trustlocalLabel,
      href: "https://trustlocal.de/hessen/neu-isenburg/reinigungsfirma/aktive-facility-management-gmbh/",
      quote: trustSectionQuotes[4],
    },
  ];
  const primaryRegions = leadRegions.filter((region) => primaryRegionIds.includes(region.id as (typeof primaryRegionIds)[number]));
  const secondaryRegions = leadRegions.filter((region) => !primaryRegionIds.includes(region.id as (typeof primaryRegionIds)[number]));
  const secondaryRegionLabels = secondaryRegions.map((region) => region.label).join(", ");

  const handleHomeCtaClick = (ctaId: string, ctaText: string, ctaLocation: string, destinationUrl: string, serviceType?: string) => {
    trackCtaClick({
      cta_id: ctaId,
      cta_text: ctaText,
      cta_location: ctaLocation,
      destination_url: destinationUrl,
      service_type: serviceType,
    });
  };

  const handleRegionClick = (regionLabel: string, destinationUrl: string, ctaLocation: string) => {
    trackLocationInterest(regionLabel, {
      cta_location: ctaLocation,
      destination_url: destinationUrl,
    });
    trackCtaClick({
      cta_id: `home_region_${regionLabel.toLowerCase().replace(/\s+/g, "_")}`,
      cta_text: regionLabel,
      cta_location: ctaLocation,
      destination_url: destinationUrl,
      location: regionLabel,
    });
  };

  useEffect(() => {
    let isActive = true;
    let cachedDuringFetch = false;

    void fetchPublicCmsPage("home")
      .then((page) => {
        if (page && isActive) {
          const normalizedContent = mergeCmsHomeContent(page.content);
          setCmsContent(normalizedContent);
          setCachedHomeContent(normalizedContent);
          cachedDuringFetch = true;
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (isActive) {
          if (!cachedDuringFetch) {
            setCachedHomeContent(mergeCmsHomeContent(cmsContent));
          }
          setIsHeroContentStable(true);
        }
      });

    return () => {
      isActive = false;
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(".pc-fade-up");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen pc-bg-section" ref={sectionsRef}>
      <Navigation />

      {/* ─── HERO ─── */}
      <section className="relative min-h-[92vh] sm:min-h-[78vh] lg:min-h-[84vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-y-0 left-1/2 w-[calc(100%-1.5rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200/70 shadow-[0_28px_68px_-42px_rgba(15,33,55,0.72)] sm:w-[calc(100%-2.5rem)] lg:w-[min(1540px,calc(100%-6rem))] lg:rounded-[2rem] xl:w-[min(1540px,calc(100%-10rem))] 2xl:w-[min(1540px,calc(100%-14rem))]">
          <img
            src={heroImageUrl}
            alt="Professionelle Gebäudereinigung"
            className="h-full w-full object-cover object-[70%_center] sm:object-center"
            loading="eager"
            fetchPriority="high"
            width={1540}
            height={860}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/78 via-white/56 to-white/28 sm:bg-gradient-to-r sm:from-white/84 sm:via-white/58 sm:to-white/24" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 pt-24 pb-24 sm:pt-20 sm:pb-10 lg:pb-10">
          <div className={`max-w-xl sm:max-w-2xl transition-opacity duration-150 ${isHeroContentStable ? "opacity-100" : "opacity-0"}`} aria-hidden={!isHeroContentStable}>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-0.5 pc-bg-brand" />
              <span className="pc-text-brand text-sm font-medium uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>
                Professionelle Gebäudereinigung
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold pc-text-primary leading-tight mb-6"
              style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}
            >
              {resolvedCmsContent.hero.title}<br />
              <span className="pc-text-brand">{resolvedCmsContent.hero.accentTitle}</span>
            </h1>

            <p className="pc-text-secondary text-lg leading-relaxed mb-8 max-w-lg" style={{ fontFamily: "Inter, sans-serif" }}>
              {resolvedCmsContent.hero.subtitle}
            </p>
            <p className="text-sm pc-text-secondary mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Kostenlos & unverbindlich. Rückmeldung innerhalb von {companyConfig.metrics.responseTime}.
            </p>

            <div className="mb-10 flex min-h-[192px] flex-col gap-3 sm:min-h-[56px] sm:flex-row">
              <Link href="/kontakt">
                <span
                  onClick={() => handleHomeCtaClick("home_hero_offer", resolvedCmsContent.hero.primaryButtonText, "home_hero", "/kontakt")}
                  className="pc-btn-primary inline-flex h-14 w-full items-center justify-center px-7 py-3.5 text-base sm:w-auto"
                >
                  {resolvedCmsContent.hero.primaryButtonText}
                  <ArrowRight size={18} />
                </span>
              </Link>
              <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("home_hero")} className="pc-btn-white inline-flex h-14 w-full items-center justify-center px-7 py-3.5 text-base sm:w-auto">
                <Phone size={18} />
                Jetzt anrufen
              </a>
              <a
                href={companyConfig.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("home_hero")}
                className="pc-btn-whatsapp inline-flex h-14 w-full items-center justify-center px-7 py-3.5 text-base sm:w-auto"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>
            <p className="text-xs pc-text-secondary mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
              Schnellkontakt: Telefon und WhatsApp direkt, oder Anfrage über Formular in unter 1 Minute.
            </p>

            {/* Hero Trust Badges */}
            <div className="flex flex-wrap gap-5">
              {[
                `Seit über ${companyConfig.metrics.yearsExperience} Jahren`,
                `${companyConfig.metrics.customers}+ zufriedene Kunden`,
                "Vollständig versichert",
                `Rückmeldung i. d. R. in ${companyConfig.metrics.responseTime}`,
              ].map((badge) => (
                <div key={badge} className="flex items-center gap-1.5">
                  <CheckCircle size={15} className="pc-text-brand" />
                  <span className="pc-text-secondary text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 pc-text-muted sm:flex">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-[var(--color-text-muted)]" />
        </div>
      </section>

      {/* ─── TRUST SEKTION ─── */}
      <section className="bg-white border-b pc-border py-12 lg:py-16">
        <div className="container">
          <div className="grid gap-10 lg:gap-12">
            <div>
              <div className="max-w-xl mb-8">
                <span className="pc-accent-line" />
                <h2 className="pc-section-title">{resolvedCmsContent.reviews.title}</h2>
                <p className="pc-section-subtitle">
                  {resolvedCmsContent.reviews.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {homeReviewItems.map((item) => {
                  const logoSize = trustLogoIntrinsicSizes[item.id] ?? { width: 160, height: 48 };
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-full min-h-[252px] flex-col rounded-xl border pc-border bg-white p-6 shadow-[0_16px_30px_-26px_rgba(15,33,55,0.4)] transition-shadow hover:shadow-[0_18px_32px_-24px_rgba(15,33,55,0.5)]"
                    >
                      <div className="flex h-14 items-center">
                        <img
                          src={item.logoUrl}
                          alt={item.name}
                          className={`h-auto w-auto object-contain ${trustLogoClasses[item.id] ?? "max-h-9 max-w-[152px]"}`}
                          loading="lazy"
                          decoding="async"
                          width={logoSize.width}
                          height={logoSize.height}
                        />
                      </div>

                      <div className="mt-5 flex items-center gap-1.5">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Star key={`${item.id}-${starIndex}`} size={16} className="fill-[#FFB800] text-[#FFB800]" />
                        ))}
                      </div>

                      <div className="mt-4">
                        <p className="text-2xl font-bold pc-text-primary" style={{ fontFamily: "Inter, sans-serif" }}>
                          {item.score}
                        </p>
                        <p className="mt-1 text-sm pc-text-secondary" style={{ fontFamily: "Inter, sans-serif" }}>
                          {item.label}
                        </p>
                      </div>

                      <p className="mt-auto border-t pc-border pt-4 text-sm leading-relaxed pc-text-secondary" style={{ fontFamily: "Inter, sans-serif" }}>
                        "{item.quote}"
                      </p>
                    </a>
                  );
                })}
              </div>

            </div>

            <div className="border-t pc-border pt-10">
              <div className="max-w-xl mb-8">
                <span className="pc-accent-line" />
                <h2 className="pc-section-title">Geprüft & abgesichert</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {trustSectionCertifications.map((certification) => (
                  <div key={certification.id} className="rounded-xl border pc-border bg-white p-6 shadow-[0_16px_30px_-26px_rgba(15,33,55,0.4)]">
                    <div className="mb-4 flex h-14 items-center">
                      <img
                        src={certification.imageSrc}
                        alt={certification.imageAlt}
                        className="h-10 w-auto object-contain"
                        loading="lazy"
                        width={140}
                        height={40}
                      />
                    </div>
                    <h3 className="mb-2 text-lg font-bold pc-text-primary" style={{ fontFamily: "Inter, sans-serif" }}>
                      {certification.title}
                    </h3>
                    <p className="pc-text-secondary text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                      {certification.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── REGIONEN ─── */}
      <section className="pc-section bg-white">
        <div className="container">
          <div className="max-w-xl mb-12 pc-fade-up">
            <span className="pc-accent-line" />
            <h2 className="pc-section-title">Reinigung in {companyConfig.regionMessaging.primaryLabel}</h2>
            <p className="pc-section-subtitle">
              {companyConfig.regionMessaging.coverageDescription} Mit planbaren Teams und kurzen Abstimmungswegen.
            </p>
            <p className="pc-text-secondary text-sm mt-3" style={{ fontFamily: "Inter, sans-serif" }}>
              Schwerpunkt auf Gebäudereinigung Frankfurt sowie Einsätzen in Neu-Isenburg und im Kreis Offenbach.
            </p>
          </div>

          <div className="mb-8 rounded-2xl border pc-border pc-bg-soft p-5 lg:p-6 pc-fade-up">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-bold pc-text-primary mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  Region wählen, Leistung wählen, Anfrage senden
                </h3>
                <p className="pc-text-secondary text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                  Starten Sie direkt mit Ihrer Anfrage. Wir stimmen Einsatzort und Leistung passend auf Ihr Objekt ab.
                </p>
              </div>
              <Link href="/kontakt">
                <span
                  onClick={() => handleHomeCtaClick("home_regions_request", "Anfrage starten", "home_regions", "/kontakt")}
                  className="pc-btn-primary"
                >
                  Anfrage starten
                  <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {primaryRegions.map((region, i) => (
              <Link key={region.id} href={region.route}>
                <span
                  onClick={() => handleRegionClick(region.label, region.route, "home_regions")}
                  className="pc-card pc-fade-up block h-full"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="w-11 h-11 pc-bg-soft rounded-lg flex items-center justify-center mb-4">
                    <MapPin size={20} className="pc-text-brand" />
                  </div>
                  <h3 className="text-lg font-bold pc-text-primary mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                    {region.label}
                  </h3>
                  <p className="pc-text-secondary text-sm leading-relaxed mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                    {region.description}
                  </p>
                  <span className="inline-flex items-center gap-1 pc-text-brand text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                    Region ansehen <ChevronRight size={14} />
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <details className="mt-6 rounded-xl border pc-border bg-white p-4 pc-fade-up">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-3 pc-text-primary font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>
              Weitere Regionen anzeigen
              <ChevronRight size={14} className="shrink-0" />
            </summary>
            <p className="mt-3 pc-text-secondary text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              Weitere Einsatzorte: {secondaryRegionLabels}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {secondaryRegions.map((region) => (
                <Link key={region.id} href={region.route}>
                  <span
                    onClick={() => handleRegionClick(region.label, region.route, "home_regions_more")}
                    className="inline-flex items-center gap-1 rounded-md border pc-border px-3 py-1.5 text-xs pc-text-secondary hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {region.label}
                    <ChevronRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* ─── LEISTUNGEN ─── */}
      <section className="pc-section pc-bg-section">
        <div className="container">
          <div className="max-w-xl mb-14 pc-fade-up">
            <span className="pc-accent-line" />
            <h2 className="pc-section-title">{resolvedCmsContent.services.title}</h2>
            <p className="pc-section-subtitle">
              {resolvedCmsContent.services.subtitle}
            </p>
            <p className="pc-text-secondary text-sm mt-3" style={{ fontFamily: "Inter, sans-serif" }}>
              Besonders gefragt: Büroreinigung Frankfurt, Glasreinigung Frankfurt, Praxisreinigung Frankfurt und Bauendreinigung Frankfurt.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <div
                key={service.title}
                className="pc-card pc-fade-up group"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-11 h-11 pc-bg-soft rounded-lg flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] transition-colors duration-300">
                  <service.icon size={20} className="pc-text-brand group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold pc-text-primary mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  {service.title}
                </h3>
                <p className="pc-text-secondary text-sm leading-relaxed mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  {service.desc}
                </p>
                <Link href={service.href}>
                  <span
                    onClick={() => {
                      trackServiceInterest(service.title, {
                        cta_location: "home_services",
                        destination_url: service.href,
                      });
                      handleHomeCtaClick("home_service_more", "Leistung ansehen", "home_services", service.href, service.title);
                    }}
                    className="inline-flex items-center gap-1 pc-text-brand text-sm font-medium hover:gap-2 transition-all duration-200"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Leistung ansehen <ChevronRight size={14} />
                  </span>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center pc-fade-up">
            <Link href="/leistungen">
              <span onClick={() => handleHomeCtaClick("home_all_services", resolvedCmsContent.services.buttonText, "home_services", "/leistungen")} className="pc-btn-outline">
                {resolvedCmsContent.services.buttonText}
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>

          <div className="mt-10 pc-fade-up">
            <div className="rounded-2xl border pc-border bg-white p-6 lg:p-7 shadow-sm">
              <h3 className="text-xl font-bold pc-text-primary mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                Beliebte Anfragen im Rhein-Main-Gebiet
              </h3>
              <p className="pc-text-secondary text-sm mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                Direkte Einstiege zu den wichtigsten regionalen Zielseiten rund um Frankfurt, Neu-Isenburg und Kreis Offenbach.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {prioritizedRegionalLinks.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span
                      onClick={() => handleHomeCtaClick("home_priority_regional", item.label, "home_priority_regional_links", item.href, item.label)}
                      className="flex items-center justify-between gap-3 rounded-lg border pc-border px-4 py-3 pc-text-primary hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors duration-200"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                      <ChevronRight size={14} className="shrink-0" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WARUM WIR ─── */}
      <section className="pc-section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative pc-fade-up order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <img
                  src={uspsImageUrl}
                  alt="Professionelle Büroreinigung"
                  className="w-full h-80 lg:h-[500px] object-cover"
                  loading="lazy"
                  width={900}
                  height={500}
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 pc-bg-accent pc-text-primary rounded-xl p-5 shadow-xl">
                <div className="text-3xl font-bold" style={{ fontFamily: "Inter, sans-serif" }}>{companyConfig.metrics.yearsExperience}+</div>
                <div className="pc-text-brand text-xs mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>Jahre Erfahrung</div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 pc-fade-up">
              <span className="pc-accent-line" />
              <h2 className="pc-section-title mb-4">
                {resolvedCmsContent.usps.title}
              </h2>
              <p className="pc-text-secondary leading-relaxed mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.usps.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {usps.map((usp) => (
                  <div key={usp.title} className="flex gap-3">
                    <div className="w-10 h-10 pc-bg-soft rounded-lg flex items-center justify-center shrink-0">
                      <usp.icon size={18} className="pc-text-brand" />
                    </div>
                    <div>
                      <h3 className="font-semibold pc-text-primary text-sm mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                        {usp.title}
                      </h3>
                      <p className="pc-text-secondary text-xs leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                        {usp.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/ueber-uns">
                  <span onClick={() => handleHomeCtaClick("home_about", "Mehr über uns", "home_why_us", "/ueber-uns")} className="pc-btn-primary">
                    Mehr über uns
                    <ArrowRight size={16} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROZESS ─── */}
      <section className="pc-section pc-bg-soft border-y pc-border">
        <div className="container">
          <div className="max-w-xl mb-14 pc-fade-up">
            <span className="block w-12 h-0.5 pc-bg-accent mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold pc-text-primary leading-tight" style={{ fontFamily: "Inter, sans-serif" }}>
              So einfach geht's
            </h2>
            <p className="pc-text-secondary text-lg leading-relaxed mt-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Vom Erstkontakt bis zum Starttermin in vier klaren Schritten.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {processSteps.map((step, i) => (
              <div key={step.num} className="relative pc-fade-up" style={{ transitionDelay: `${i * 100}ms` }}>
                {/* Connector line */}
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-[var(--color-border)] z-0" />
                )}
                <div className="relative z-10">
                  <div className="mb-5 overflow-hidden rounded-lg border pc-border bg-white shadow-[0_16px_30px_-26px_rgba(15,33,55,0.4)]">
                    <div className="aspect-[4/3]">
                      <img
                        src={step.imageUrl}
                        alt={step.imageAlt}
                        className="h-full w-full object-cover"
                        style={{ objectPosition: step.imagePosition }}
                        loading="lazy"
                        width={600}
                        height={450}
                      />
                    </div>
                  </div>
                  <div className="text-5xl font-bold text-[var(--color-placeholder)] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold pc-text-primary mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="pc-text-secondary text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EINSATZBEREICHE ─── */}
      <section className="pc-section pc-bg-section">
        <div className="container">
          <div className="max-w-xl mb-12 pc-fade-up">
            <span className="pc-accent-line" />
            <h2 className="pc-section-title">Unsere Einsatzbereiche</h2>
            <p className="pc-section-subtitle">
              Für jede Branche stimmen wir Reinigungsumfang, Zeiten und sensible Bereiche passend ab.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {sectors.map((sector, i) => (
              <div
                key={sector.label}
                className="bg-white rounded-lg border pc-border hover:border-[var(--color-primary)] hover:shadow-md transition-all duration-300 pc-fade-up overflow-hidden"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="aspect-[4/3]">
                  <img
                    src={sector.imageUrl}
                    alt={sector.imageAlt}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: sector.imagePosition }}
                    loading="lazy"
                    width={600}
                    height={450}
                  />
                </div>
                <div className="p-5 text-center">
                  <sector.icon size={24} className="pc-text-brand mx-auto mb-3" />
                  <span className="pc-text-primary text-xs font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                    {sector.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS & TRUST (Lead-Maschine) ─── */}
      <TestimonialsSection />

      {/* ─── ALT TESTIMONIALS ─── */}
      <section className="pc-section bg-white hidden">
        <div className="container">
          <div className="max-w-xl mb-14 pc-fade-up">
            <span className="pc-accent-line" />
            <h2 className="pc-section-title">Was unsere Kunden sagen</h2>
            <p className="pc-section-subtitle">
              Vertrauen entsteht durch Erfahrung – lesen Sie, was Unternehmen über die Zusammenarbeit mit uns berichten.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="pc-card pc-fade-up"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="pc-text-primary text-sm leading-relaxed mb-5 italic" style={{ fontFamily: "Inter, sans-serif" }}>
                  „{t.text}"
                </p>
                <div className="border-t pc-border pt-4">
                  <div className="font-semibold pc-text-primary text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                    {t.name}
                  </div>
                  <div className="pc-text-secondary text-xs mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                    {t.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BILD-SEKTION ─── */}
      <section className="relative h-80 lg:h-96 overflow-hidden">
        <img
          src={servicesFeatureImageUrl}
          alt="Glasreinigung an modernem Bürogebäude"
          className="w-full h-full object-cover"
          loading="lazy"
          width={1600}
          height={900}
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
          <div className="text-center pc-text-primary max-w-2xl px-4">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Glasflächen sauber im Blick
            </h2>
            <p className="pc-text-secondary mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              Für Fenster, Eingangsbereiche und Innenverglasungen mit klarem Qualitätsanspruch.
            </p>
            <Link href="/leistungen">
              <span
                onClick={() => {
                  trackServiceInterest("Glasreinigung", {
                    cta_location: "home_glass_section",
                    destination_url: "/leistungen",
                  });
                  handleHomeCtaClick("home_glass_service", "Glasreinigung ansehen", "home_glass_section", "/leistungen", "Glasreinigung");
                }}
                className="pc-btn-white"
              >
                Glasreinigung ansehen
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FINALER CTA ─── */}
      <section className="pc-section pc-bg-section">
        <div className="container">
          <div className="bg-white rounded-2xl overflow-hidden border pc-border shadow-[0_24px_48px_-34px_rgba(15,33,55,0.45)]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Content */}
              <div className="p-10 lg:p-14">
                <span className="block w-10 h-0.5 pc-bg-brand mb-6" />
                <h2 className="text-3xl lg:text-4xl font-bold pc-text-primary mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  {resolvedCmsContent.finalCta.title}
                </h2>
                <p className="pc-text-secondary leading-relaxed mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
                  {resolvedCmsContent.finalCta.body}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Link href="/kontakt">
                    <span
                      onClick={() => handleHomeCtaClick("home_final_offer", resolvedCmsContent.finalCta.primaryButtonText, "home_final_cta", "/kontakt")}
                      className="pc-btn-primary"
                    >
                      {resolvedCmsContent.finalCta.primaryButtonText}
                      <ArrowRight size={16} />
                    </span>
                  </Link>
                  <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("home_final_cta")} className="pc-btn-white">
                    <Phone size={16} />
                    Jetzt anrufen
                  </a>
                  <a
                    href={companyConfig.contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick("home_final_cta")}
                    className="pc-btn-whatsapp"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                </div>
                <p className="pc-text-secondary text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                  Keine versteckten Kosten. Persönliche Rückmeldung in der Regel innerhalb von {companyConfig.metrics.responseTime}.
                </p>

                <div className="flex flex-col gap-2">
                  {[
                    "Kostenloses Erstgespräch",
                    "Rückmeldung in der Regel innerhalb von 24 Stunden",
                    "Besichtigung bei Bedarf vor Ort",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle size={14} className="pc-text-brand" />
                      <span className="pc-text-secondary text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div className="hidden lg:block relative">
                <img
                  src={finalCtaImageUrl}
                  alt={`${companyConfig.brand.name} Team`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={600}
                  height={500}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}



