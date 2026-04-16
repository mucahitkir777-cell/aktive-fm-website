/*
 * ProClean Region-Seite
 * Kuratierte Lead-Seiten für priorisierte Rhein-Main-Regionen.
 */

import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, CheckCircle, MapPin, MessageCircle, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import QuickContactForm from "@/components/QuickContactForm";
import { getLeadRegionBySlug, getLeadServiceById, leadRegions, leadServices, type LeadRegion, type LeadService } from "@/data/leadTargets";
import { trackCtaClick, trackLocationInterest, trackPhoneClick, trackServiceInterest, trackWhatsAppClick } from "@/lib/analytics";
import { companyConfig } from "@/config/company";

type RegionalServicePageRoute = (typeof companyConfig.regionalServiceRoutes)[number];

interface RegionalPageContext {
  region: LeadRegion;
  service?: LeadService;
  serviceRoute?: RegionalServicePageRoute;
}

function getSlugFromLocation(location: string) {
  return location.replace("/gebaeudereinigung-", "");
}

function getRegionById(regionId: string) {
  return leadRegions.find((region) => region.id === regionId);
}

function resolveRegionalPage(location: string): RegionalPageContext | undefined {
  const serviceRoute = companyConfig.regionalServiceRoutes.find((route) => route.route === location);
  if (serviceRoute) {
    const region = getRegionById(serviceRoute.regionId);
    const service = getLeadServiceById(serviceRoute.serviceId);

    if (region && service) {
      return { region, service, serviceRoute };
    }
  }

  const region = leadRegions.find((item) => item.route === location) ?? getLeadRegionBySlug(getSlugFromLocation(location));
  return region ? { region } : undefined;
}

function setMeta(selector: string, attribute: "content" | "href", value: string) {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute(attribute, value);
  }
}

function applyRegionalSeo(title: string, description: string, path: string) {
  const canonicalUrl = `${companyConfig.brand.siteUrl}${path}`;

  document.title = title;
  setMeta('meta[name="description"]', "content", description);
  setMeta('link[rel="canonical"]', "href", canonicalUrl);
  setMeta('meta[property="og:url"]', "content", canonicalUrl);
  setMeta('meta[property="og:title"]', "content", title);
  setMeta('meta[property="og:description"]', "content", description);
  setMeta('meta[name="twitter:title"]', "content", title);
  setMeta('meta[name="twitter:description"]', "content", description);
}

export default function Region() {
  const [location] = useLocation();
  const pageContext = resolveRegionalPage(location);
  const region = pageContext?.region;
  const selectedService = pageContext?.service;
  const serviceRoute = pageContext?.serviceRoute;

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!region) return;

    const pageType = serviceRoute ? "regional_service_page" : "region_page";
    const seoTitle = serviceRoute?.seoTitle ?? region.seoTitle;
    const seoDescription = serviceRoute?.seoDescription ?? region.seoDescription;

    applyRegionalSeo(seoTitle, seoDescription, location);
    trackLocationInterest(region.label, {
      source: pageType,
      region_id: region.id,
      page_path: location,
      service_id: selectedService?.id,
      service_type: selectedService?.label,
    });

    if (selectedService) {
      trackServiceInterest(selectedService.label, {
        source: pageType,
        location: region.label,
        region_id: region.id,
        service_id: selectedService.id,
        page_path: location,
      });
    }
  }, [location, region, selectedService, serviceRoute]);

  if (!region) {
    return (
      <div className="min-h-screen pc-bg-section">
        <Navigation />
        <section className="pc-section text-center">
          <div className="container">
            <h1 className="text-3xl font-bold pc-text-primary mb-4">Region nicht gefunden</h1>
            <Link href="/kontakt">
              <span className="pc-btn-primary">
                Anfrage stellen
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const pageType = serviceRoute ? "regional_service_page" : "region_page";
  const pageH1 = serviceRoute?.h1 ?? `Gebäudereinigung in ${region.label}`;
  const pageIntro =
    serviceRoute?.intro ??
    `${region.description} Wir planen Reinigung verlässlich nach Objekt, Intervall und gewünschter Leistung.`;
  const serviceHeadline = selectedService ? `${selectedService.label} und passende Zusatzleistungen` : `Leistungen für ${region.shortLabel}`;
  const otherRegions = leadRegions.filter((item) => item.id !== region.id);

  const getRegionalServiceRoute = (serviceId: string) =>
    companyConfig.regionalServiceRoutes.find((route) => route.regionId === region.id && route.serviceId === serviceId);

  const handleCtaClick = (ctaId: string, ctaText: string, ctaLocation: string, destinationUrl: string, serviceType?: string) => {
    trackCtaClick({
      cta_id: ctaId,
      cta_text: ctaText,
      cta_location: ctaLocation,
      destination_url: destinationUrl,
      location: region.label,
      region_id: region.id,
      service_id: selectedService?.id,
      service_type: serviceType ?? selectedService?.label,
      page_type: pageType,
      page_path: location,
    });
  };

  const handleServiceClick = (service: LeadService, destinationUrl: string) => {
    trackServiceInterest(service.label, {
      location: region.label,
      region_id: region.id,
      service_id: service.id,
      source: "region_page_services",
      page_path: location,
    });
    handleCtaClick(`region_${region.id}_${service.id}`, service.label, "region_page_services", destinationUrl, service.label);
  };

  const handleRegionLinkClick = (targetRegion: LeadRegion) => {
    trackLocationInterest(targetRegion.label, {
      source: "region_internal_link",
      region_id: targetRegion.id,
      clicked_from_region: region.label,
      clicked_from_path: location,
    });
    handleCtaClick(`region_link_${targetRegion.id}`, targetRegion.label, "region_internal_links", targetRegion.route);
  };

  const renderContactCtas = (ctaLocation: string, tone: "dark" | "light" = "light") => {
    const secondaryClass = tone === "dark" ? "pc-btn-white" : "pc-btn-outline";
    const buttonClass = "w-full sm:w-auto justify-center min-h-12";

    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={companyConfig.contact.phoneHref}
          onClick={() =>
            trackPhoneClick(ctaLocation, {
              location: region.label,
              region_id: region.id,
              service_id: selectedService?.id,
              service_type: selectedService?.label,
              page_path: location,
            })
          }
          className={`pc-btn-primary ${buttonClass}`}
        >
          <Phone size={16} />
          Anrufen
        </a>
        <a
          href={companyConfig.contact.whatsappHref}
          onClick={() =>
            trackWhatsAppClick(ctaLocation, {
              location: region.label,
              region_id: region.id,
              service_id: selectedService?.id,
              service_type: selectedService?.label,
              page_path: location,
            })
          }
          className={`${secondaryClass} ${buttonClass}`}
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
        <Link href="/kontakt">
          <span
            onClick={() => handleCtaClick(`${ctaLocation}_offer`, "Angebot", ctaLocation, "/kontakt")}
            className={`${secondaryClass} ${buttonClass}`}
          >
            <ArrowRight size={16} />
            Angebot
          </span>
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen pc-bg-section">
      <Navigation />

      <section className="pc-page-hero">
        <div className="container">
          <div className="max-w-2xl">
            <span className="block w-12 h-0.5 pc-bg-accent mb-6" />
            <h1 className="text-4xl lg:text-5xl font-bold pc-text-primary mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              {pageH1}
            </h1>
            <p className="pc-text-secondary text-lg leading-relaxed mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
              {pageIntro}
            </p>
            {renderContactCtas("region_hero")}
          </div>
        </div>
      </section>

      <section className="pc-section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            <div className="lg:col-span-2 space-y-10 pc-fade-up">
              <div>
                <span className="pc-accent-line" />
                <h2 className="pc-section-title mb-4">{serviceHeadline}</h2>
                <p className="pc-text-secondary leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  {region.proofPoint} Jede Anfrage wird nach Region und Leistung ausgewertet, damit wir Bedarf und Nachfrage sauber priorisieren können.
                </p>
              </div>

              {selectedService && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["Regelmäßige Reinigung nach Plan", "Klare Abstimmung nach Objekt", "Feste regionale Zuordnung", "Transparente Anfrage mit Leistung"].map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <CheckCircle size={18} className="pc-text-brand shrink-0 mt-0.5" />
                      <span className="pc-text-secondary text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {leadServices.map((service) => {
                  const regionalServiceRoute = getRegionalServiceRoute(service.id);
                  const serviceHref = regionalServiceRoute?.route ?? "/leistungen";

                  return (
                    <Link key={service.id} href={serviceHref}>
                      <span
                        onClick={() => handleServiceClick(service, serviceHref)}
                        className="bg-white rounded-lg p-5 border border-gray-100 hover:border-[#1E3A8A] hover:shadow-md transition-all duration-300 block h-full"
                      >
                        <h3 className="font-bold pc-text-primary mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                          {service.label}
                        </h3>
                        <p className="pc-text-secondary text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                          {service.description}
                        </p>
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold pc-text-primary mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  Direkt für {region.shortLabel} anfragen
                </h3>
                <p className="pc-text-secondary text-sm leading-relaxed mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                  Wählen Sie den schnellsten Kontaktweg. Region und Leistung werden im Tracking-Kontext mitgeführt.
                </p>
                {renderContactCtas("region_mid_cta")}
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold pc-text-primary mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  Regionale Abstimmung
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {region.nearbyAreas.map((area) => (
                    <div key={area} className="flex items-center gap-2 pc-text-secondary text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                      <MapPin size={14} className="pc-text-brand" />
                      {area}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-white rounded-lg p-6 border border-gray-100">
                  <h3 className="font-bold pc-text-primary mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                    Weitere Regionen
                  </h3>
                  <div className="space-y-3">
                    {otherRegions.map((targetRegion) => (
                      <Link key={targetRegion.id} href={targetRegion.route}>
                        <span
                          onClick={() => handleRegionLinkClick(targetRegion)}
                          className="flex items-center justify-between gap-3 pc-text-brand hover:text-[#1A3277] text-sm font-semibold"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {targetRegion.label}
                          <ArrowRight size={14} />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-100">
                  <h3 className="font-bold pc-text-primary mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                    Leistungen verbinden
                  </h3>
                  <div className="space-y-3">
                    <Link href="/leistungen">
                      <span
                        onClick={() => handleCtaClick("region_link_services", "Leistungen", "region_internal_links", "/leistungen")}
                        className="flex items-center justify-between gap-3 pc-text-brand hover:text-[#1A3277] text-sm font-semibold"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Alle Leistungen
                        <ArrowRight size={14} />
                      </span>
                    </Link>
                    {companyConfig.regionalServiceRoutes.map((route) => (
                      <Link key={route.id} href={route.route}>
                        <span
                          onClick={() => handleCtaClick(`region_link_${route.id}`, route.h1, "region_internal_links", route.route)}
                          className="flex items-center justify-between gap-3 pc-text-brand hover:text-[#1A3277] text-sm font-semibold"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {route.h1}
                          <ArrowRight size={14} />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-1 pc-fade-up">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="text-lg font-bold pc-text-primary mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  Anfrage für {region.shortLabel}
                </h3>
                <p className="pc-text-secondary text-sm leading-relaxed mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                  {region.responseNote}
                </p>
                <QuickContactForm
                  formId={`region_${region.id}_${selectedService?.id ?? "general"}_quick_contact`}
                  formType={serviceRoute ? "regional_service_contact" : "region_contact"}
                  serviceType={selectedService?.label}
                  location={region.label}
                  source={serviceRoute ? "regional_service_page_sidebar" : "region_page_sidebar"}
                  pageType={serviceRoute ? "regional_service_page" : "region_page"}
                  showLeadFields
                  defaultRegionId={region.id}
                  defaultServiceId={selectedService?.id}
                />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="pc-bg-soft py-16 border-y pc-border">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold pc-text-primary mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Reinigung in {region.label} planen
          </h2>
          <p className="pc-text-secondary mb-8 max-w-lg mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
            Teilen Sie uns Region, Objekt und gewünschte Leistung mit. Wir melden uns mit einem passenden Vorschlag.
          </p>
          <div className="max-w-2xl mx-auto">{renderContactCtas("region_final_cta")}</div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
