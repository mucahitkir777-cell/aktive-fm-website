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
    desc: "Regelmäßige Reinigung von Büros, Konferenzräumen und Gemeinschaftsflächen – zuverlässig und diskret.",
    href: "/leistungen",
  },
  {
    icon: Sparkles,
    title: "Unterhaltsreinigung",
    desc: "Kontinuierliche Pflege Ihrer Immobilie nach festem Reinigungsplan – damit Sauberkeit kein Zufall ist.",
    href: "/leistungen",
  },
  {
    icon: Wind,
    title: "Glasreinigung",
    desc: "Streifenfreie Reinigung von Fenstern, Glasfassaden und Glastrennwänden – innen und außen.",
    href: "/leistungen",
  },
  {
    icon: Layers,
    title: "Treppenhaus & Außen",
    desc: "Professionelle Pflege von Treppenhäusern, Eingangsbereichen und Außenanlagen.",
    href: "/leistungen",
  },
  {
    icon: Wrench,
    title: "Grundreinigung",
    desc: "Intensive Tiefenreinigung für besonders beanspruchte Bereiche – gründlich und nachhaltig.",
    href: "/leistungen",
  },
  {
    icon: HomeIcon,
    title: "Sonderreinigung",
    desc: "Maßgeschneiderte Reinigungslösungen für spezielle Anforderungen und Sondersituationen.",
    href: "/leistungen",
  },
];

const usps = [
  {
    icon: Shield,
    title: "Vollständig versichert",
    desc: "Alle Mitarbeiter und Einsätze sind umfassend haftpflichtversichert. Sie tragen kein Risiko.",
  },
  {
    icon: Users,
    title: "Festes Reinigungsteam",
    desc: "Sie erhalten immer dasselbe geschulte Team – für gleichbleibende Qualität und Vertrauen.",
  },
  {
    icon: Clock,
    title: "Pünktlich & zuverlässig",
    desc: "Wir halten Termine und Absprachen ein. Keine Überraschungen, keine Ausfälle ohne Ersatz.",
  },
  {
    icon: Award,
    title: "Geprüfte Qualität",
    desc: "Regelmäßige Qualitätskontrollen und direkte Ansprechpartner – für Ihr dauerhaftes Wohlbefinden.",
  },
];

const processSteps = [
  {
    num: "01",
    title: "Anfrage stellen",
    desc: "Kontaktieren Sie uns per Telefon, E-Mail oder über unser Formular. Wir melden uns innerhalb von 24 Stunden.",
  },
  {
    num: "02",
    title: "Vor-Ort-Besichtigung",
    desc: "Wir besichtigen Ihr Objekt kostenlos und unverbindlich – um Ihren Bedarf genau zu verstehen.",
  },
  {
    num: "03",
    title: "Individuelles Angebot",
    desc: "Sie erhalten ein transparentes, maßgeschneidertes Angebot ohne versteckte Kosten.",
  },
  {
    num: "04",
    title: "Reinigung starten",
    desc: "Nach Ihrer Freigabe beginnen wir termingerecht – zuverlässig, diskret und professionell.",
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
  { label: "Büro & Verwaltung", icon: Building2 },
  { label: "Arzt & Praxis", icon: Shield },
  { label: "Hotel & Gastronomie", icon: Star },
  { label: "Industrie & Logistik", icon: Layers },
  { label: "Bildung & Kitas", icon: Users },
  { label: "Handel & Retail", icon: Award },
];

// Counter animation hook
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(value);
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl lg:text-4xl font-bold pc-text-primary" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
        {count}{suffix}
      </div>
      <div className="text-sm pc-text-secondary mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
        {label}
      </div>
    </div>
  );
}

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
    finalCta: mergeCmsSection(defaults.finalCta, (content as Record<string, unknown>).finalCta),
    seo: mergeCmsSection(defaults.seo, (content as Record<string, unknown>).seo),
  };
}

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement>(null);
  const [cmsContent, setCmsContent] = useState<CmsHomeContent>(() => getDefaultCmsPageContent("home"));
  const resolvedCmsContent = mergeCmsHomeContent(cmsContent);
  const heroImageUrl = resolvedCmsContent.hero.imageUrl || IMAGES.heroMain;
  const uspsImageUrl = resolvedCmsContent.usps.imageUrl || IMAGES.heroOffice;
  const servicesFeatureImageUrl = resolvedCmsContent.services.imageUrl || IMAGES.serviceGlass;
  const finalCtaImageUrl = resolvedCmsContent.finalCta.imageUrl || IMAGES.aboutTeam;

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

    void fetchPublicCmsPage("home")
      .then((page) => {
        if (page && isActive) {
          setCmsContent(mergeCmsHomeContent(page.content));
        }
      })
      .catch(() => undefined);

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const seoTitle = resolveSeoValue(
      resolvedCmsContent.seo.seoTitle,
      resolveSeoValue(resolvedCmsContent.finalCta.seoTitle, companyConfig.seo.title),
    );
    const seoDescription = resolveSeoValue(
      resolvedCmsContent.seo.seoDescription,
      resolveSeoValue(resolvedCmsContent.finalCta.seoDescription, companyConfig.seo.description),
    );

    applyPageSeo({
      title: seoTitle,
      description: seoDescription,
    });
  }, [
    resolvedCmsContent.finalCta.seoDescription,
    resolvedCmsContent.finalCta.seoTitle,
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
    <div className="min-h-screen pc-bg-section" ref={sectionsRef}>
      <Navigation />

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImageUrl}
            alt="Professionelle Gebäudereinigung"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/82 to-white/55" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 pt-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-0.5 pc-bg-brand" />
              <span className="pc-text-brand text-sm font-medium uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>
                Professionelle Gebäudereinigung
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold pc-text-primary leading-tight mb-6"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "-0.02em" }}
            >
              {resolvedCmsContent.hero.title}<br />
              <span className="pc-text-brand">{resolvedCmsContent.hero.accentTitle}</span>
            </h1>

            <p className="text-[#4F5F76] text-lg leading-relaxed mb-8 max-w-lg" style={{ fontFamily: "Inter, sans-serif" }}>
              {resolvedCmsContent.hero.subtitle}
            </p>
            <p className="text-sm pc-text-secondary mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Kostenlos & unverbindlich. Rückmeldung in der Regel innerhalb von {companyConfig.metrics.responseTime}.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/kontakt">
                <span
                  onClick={() => handleHomeCtaClick("home_hero_offer", resolvedCmsContent.hero.primaryButtonText, "home_hero", "/kontakt")}
                  className="pc-btn-primary text-base px-7 py-3.5"
                >
                  {resolvedCmsContent.hero.primaryButtonText}
                  <ArrowRight size={18} />
                </span>
              </Link>
              <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("home_hero")} className="pc-btn-white text-base px-7 py-3.5">
                <Phone size={18} />
                Jetzt anrufen
              </a>
              <a
                href={companyConfig.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("home_hero")}
                className="pc-btn-outline text-base px-7 py-3.5"
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
                  <span className="text-[#334155] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#94A3B8]">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#94A3B8]" />
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-gray-100">
            <StatCounter value={companyConfig.metrics.yearsExperience} suffix="+" label="Jahre Erfahrung" />
            <StatCounter value={companyConfig.metrics.customers} suffix="+" label="Zufriedene Kunden" />
            <StatCounter value={companyConfig.metrics.staff} suffix="+" label="Fachkräfte im Team" />
            <StatCounter value={companyConfig.metrics.satisfactionPercent} suffix="%" label="Kundenzufriedenheit" />
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {leadRegions.map((region, i) => (
              <Link key={region.id} href={region.route}>
                <span
                  onClick={() => handleRegionClick(region.label, region.route, "home_regions")}
                  className="pc-card pc-fade-up block h-full"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <MapPin size={20} className="pc-text-brand" />
                  </div>
                  <h3 className="text-lg font-bold pc-text-primary mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <div
                key={service.title}
                className="pc-card pc-fade-up group"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[var(--pc-primary)] transition-colors duration-300">
                  <service.icon size={20} className="pc-text-brand group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold pc-text-primary mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
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
                      handleHomeCtaClick("home_service_more", "Mehr erfahren", "home_services", service.href, service.title);
                    }}
                    className="inline-flex items-center gap-1 pc-text-brand text-sm font-medium hover:gap-2 transition-all duration-200"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Mehr erfahren <ChevronRight size={14} />
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
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 pc-bg-accent pc-text-primary rounded-xl p-5 shadow-xl">
                <div className="text-3xl font-bold" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{companyConfig.metrics.yearsExperience}+</div>
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
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <usp.icon size={18} className="pc-text-brand" />
                    </div>
                    <div>
                      <h4 className="font-semibold pc-text-primary text-sm mb-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                        {usp.title}
                      </h4>
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
            <h2 className="text-3xl lg:text-4xl font-bold pc-text-primary leading-tight" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              So einfach geht's
            </h2>
            <p className="pc-text-secondary text-lg leading-relaxed mt-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Von der ersten Anfrage bis zum ersten Reinigungstermin – unkompliziert und transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {processSteps.map((step, i) => (
              <div key={step.num} className="relative pc-fade-up" style={{ transitionDelay: `${i * 100}ms` }}>
                {/* Connector line */}
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-[#D9E4F8] z-0" />
                )}
                <div className="relative z-10">
                  <div className="text-5xl font-bold text-[#9DB2D8] mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold pc-text-primary mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
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
              Wir reinigen für Unternehmen aus verschiedensten Branchen – mit dem jeweils passenden Konzept.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {sectors.map((sector, i) => (
              <div
                key={sector.label}
                className="bg-white rounded-lg p-5 text-center border border-gray-100 hover:border-[#1E3A8A] hover:shadow-md transition-all duration-300 pc-fade-up"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <sector.icon size={24} className="pc-text-brand mx-auto mb-3" />
                <span className="pc-text-primary text-xs font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                  {sector.label}
                </span>
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
                <p className="text-[#1A2332] text-sm leading-relaxed mb-5 italic" style={{ fontFamily: "Inter, sans-serif" }}>
                  „{t.text}"
                </p>
                <div className="border-t border-gray-100 pt-4">
                  <div className="font-semibold pc-text-primary text-sm" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
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
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
          <div className="text-center pc-text-primary max-w-2xl px-4">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Glasreinigung auf höchstem Niveau
            </h2>
            <p className="text-[#44546B] mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              Von der Innenverglasung bis zur Glasfassade – streifenfrei, sicher und professionell.
            </p>
            <Link href="/leistungen">
              <span
                onClick={() => {
                  trackServiceInterest("Glasreinigung", {
                    cta_location: "home_glass_section",
                    destination_url: "/leistungen",
                  });
                  handleHomeCtaClick("home_glass_service", "Zur Glasreinigung", "home_glass_section", "/leistungen", "Glasreinigung");
                }}
                className="pc-btn-white"
              >
                Zur Glasreinigung
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
                <h2 className="text-3xl lg:text-4xl font-bold pc-text-primary mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
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
                    className="pc-btn-outline"
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
                    "Kostenlos & unverbindlich",
                    "Antwort innerhalb von 24 Stunden",
                    "Persönliche Beratung vor Ort",
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
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

