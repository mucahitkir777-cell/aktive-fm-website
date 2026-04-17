/*
 * Aktive Facility Management Kontakt-Seite
 * Design: Architektonischer Minimalismus
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import QuickContactForm from "@/components/QuickContactForm";
import { Phone, Mail, MapPin, Clock, CheckCircle, MessageCircle } from "lucide-react";
import { trackCtaClick, trackLocationInterest, trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";
import { leadRegions } from "@/data/leadTargets";
import { companyConfig } from "@/config/company";
import { fetchPublicCmsPage } from "@/lib/cms";
import { applyPageSeo, resolveSeoValue } from "@/lib/seo";
import { getDefaultCmsPageContent, type CmsContactContent } from "@shared/cms";

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

function mergeCmsContactContent(content: unknown): CmsContactContent {
  const defaults = getDefaultCmsPageContent("kontakt");

  if (!content || typeof content !== "object") {
    return defaults;
  }

  return {
    hero: mergeCmsSection(defaults.hero, (content as Record<string, unknown>).hero),
    contactInfo: mergeCmsSection(defaults.contactInfo, (content as Record<string, unknown>).contactInfo),
    formSection: mergeCmsSection(defaults.formSection, (content as Record<string, unknown>).formSection),
    seo: mergeCmsSection(defaults.seo, (content as Record<string, unknown>).seo),
  };
}

export default function Kontakt() {
  const handleRegionClick = (regionLabel: string, destinationUrl: string) => {
    trackLocationInterest(regionLabel, {
      cta_location: "contact_page_regions",
      destination_url: destinationUrl,
    });
    trackCtaClick({
      cta_id: `contact_region_${regionLabel.toLowerCase().replace(/\s+/g, "_")}`,
      cta_text: regionLabel,
      cta_location: "contact_page_regions",
      destination_url: destinationUrl,
      location: regionLabel,
    });
  };

  const [cmsContent, setCmsContent] = useState<CmsContactContent>(() => getDefaultCmsPageContent("kontakt"));
  const resolvedCmsContent = mergeCmsContactContent(cmsContent);

  useEffect(() => {
    let active = true;

    void fetchPublicCmsPage("kontakt")
      .then((page) => {
        if (page && active) {
          setCmsContent(mergeCmsContactContent(page.content));
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
  }, [resolvedCmsContent.seo.seoDescription, resolvedCmsContent.seo.seoTitle]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".pc-fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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
              {resolvedCmsContent.hero.title}
            </h1>
            <p className="pc-text-secondary text-lg leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              {resolvedCmsContent.hero.subtitle}
            </p>
            <p className="mt-3 text-sm pc-text-secondary" style={{ fontFamily: "Inter, sans-serif" }}>
              Schnellster Weg: anrufen, WhatsApp schreiben oder in unter 1 Minute anfragen.
            </p>
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#kontakt-form"
                  onClick={() => trackCtaClick({
                    cta_id: "contact_hero_cta",
                    cta_text: resolvedCmsContent.hero.buttonText,
                    cta_location: "contact_hero",
                    destination_url: "#kontakt-form",
                  })}
                  className="pc-btn-primary"
                >
                  {resolvedCmsContent.hero.buttonText}
                </a>
                <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("contact_hero")} className="pc-btn-white">
                  <Phone size={16} />
                  Jetzt anrufen
                </a>
                <a
                  href={companyConfig.contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick("contact_hero")}
                  className="inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3.5 rounded-[var(--pc-radius-md)] shadow-[var(--pc-shadow-soft)] bg-green-500 hover:bg-green-600 transition-all duration-300 hover:-translate-y-0.5"
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

      {/* Contact Section */}
      <section className="pc-section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            {/* Contact Info */}
            <div className="lg:col-span-1 pc-fade-up">
              <h2 className="text-xl font-bold pc-text-primary mb-6" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                {resolvedCmsContent.contactInfo.title}
              </h2>
              <p className="pc-text-secondary text-sm leading-relaxed mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.contactInfo.subtitle}
              </p>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("contact_page_quick_actions")} className="pc-btn-primary text-sm">
                    <Phone size={16} />
                    Sofort anrufen
                  </a>
                  <a
                    href={companyConfig.contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick("contact_page_quick_actions")}
                    className="inline-flex items-center justify-center gap-2 text-white font-semibold px-4 py-3 rounded-[var(--pc-radius-md)] shadow-[var(--pc-shadow-soft)] bg-green-500 hover:bg-green-600 transition-all duration-300"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <MessageCircle size={16} />
                    WhatsApp schreiben
                  </a>
                  <a
                    href="#kontakt-form"
                    onClick={() =>
                      trackCtaClick({
                        cta_id: "contact_quick_form",
                        cta_text: "Formular öffnen",
                        cta_location: "contact_page_quick_actions",
                        destination_url: "#kontakt-form",
                      })
                    }
                    className="pc-btn-outline text-sm sm:col-span-2"
                  >
                    Formular öffnen
                  </a>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 pc-bg-soft rounded-lg flex items-center justify-center shrink-0">
                    <Phone size={18} className="pc-text-brand" />
                  </div>
                  <div>
                    <div className="font-semibold pc-text-primary text-sm mb-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                      Telefon
                    </div>
                    <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("contact_page_info")} className="pc-text-secondary text-sm hover:text-[var(--color-primary)] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                      {companyConfig.contact.phoneDisplay}
                    </a>
                    <p className="pc-text-secondary text-xs mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                      {companyConfig.openingHours.phoneAvailability}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 pc-bg-soft rounded-lg flex items-center justify-center shrink-0">
                    <Mail size={18} className="pc-text-brand" />
                  </div>
                  <div>
                    <div className="font-semibold pc-text-primary text-sm mb-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                      E-Mail
                    </div>
                    <a href={companyConfig.contact.emailHref} className="pc-text-secondary text-sm hover:text-[var(--color-primary)] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                      {companyConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 pc-bg-soft rounded-lg flex items-center justify-center shrink-0">
                    <MapPin size={18} className="pc-text-brand" />
                  </div>
                  <div>
                    <div className="font-semibold pc-text-primary text-sm mb-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                      Adresse
                    </div>
                    <p className="pc-text-secondary text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                      {companyConfig.address.lines.map((line) => (
                        <span key={line}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 pc-bg-soft rounded-lg flex items-center justify-center shrink-0">
                    <Clock size={18} className="pc-text-brand" />
                  </div>
                  <div>
                    <div className="font-semibold pc-text-primary text-sm mb-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                      Öffnungszeiten
                    </div>
                    <p className="pc-text-secondary text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                      {companyConfig.openingHours.contactLines.map((line) => (
                        <span key={line}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Points */}
              <div className="mt-8 pc-form-shell">
                <h3 className="font-bold pc-text-primary text-sm mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  Ihr Angebot ist:
                </h3>
                <ul className="space-y-2">
                  {[
                    "Kostenlos & unverbindlich",
                    "Individuell auf Sie zugeschnitten",
                    "Transparent und ohne versteckte Kosten",
                    "Innerhalb von 24 Stunden",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle size={14} className="pc-text-brand shrink-0" />
                      <span className="pc-text-secondary text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pc-form-shell">
                <h3 className="font-bold pc-text-primary text-sm mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  Einsatzgebiete
                </h3>
                <p className="pc-text-secondary text-xs mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                  Schwerpunkt: {companyConfig.regionMessaging.primaryLabel} ({companyConfig.regionMessaging.coverageLabel})
                </p>
                <div className="space-y-2">
                  {leadRegions.map((region) => (
                    <Link key={region.id} href={region.route}>
                      <span
                        onClick={() => handleRegionClick(region.label, region.route)}
                        className="flex items-center justify-between gap-3 py-2 pc-text-secondary text-sm hover:text-[var(--color-primary)] transition-colors"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin size={14} className="pc-text-brand" />
                          {region.label}
                        </span>
                        <span className="text-xs">Ansehen</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div id="kontakt-form" className="lg:col-span-2 pc-fade-up">
              <div className="mb-8">
                <h2 className="text-3xl font-bold pc-text-primary mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  {resolvedCmsContent.formSection.title}
                </h2>
                <p className="pc-text-secondary text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  {resolvedCmsContent.formSection.subtitle}
                </p>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {["Wichtige Felder zuerst", "Kostenlos & unverbindlich", `Rückmeldung in ${companyConfig.metrics.responseTime}`].map((item) => (
                    <li key={item} className="flex items-center gap-2 rounded-md border border-[#DCE8FF] bg-[#F4F8FF] px-3 py-2 text-xs pc-text-primary" style={{ fontFamily: "Inter, sans-serif" }}>
                      <CheckCircle size={14} className="pc-text-brand shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pc-form-shell">
                <QuickContactForm formId="contact_page_quick_contact" formType="contact" source="contact_page" pageType="contact_page" showLeadFields />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

