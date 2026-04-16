/*
 * ProClean Kontakt-Seite
 * Design: Architektonischer Minimalismus
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import QuickContactForm from "@/components/QuickContactForm";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import { trackCtaClick, trackLocationInterest, trackPhoneClick } from "@/lib/analytics";
import { leadRegions } from "@/data/leadTargets";
import { companyConfig } from "@/config/company";
import { fetchPublicCmsPage } from "@/lib/cms";
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
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navigation />

      {/* Page Hero */}
      <section className="bg-[#0F2137] pt-28 pb-16">
        <div className="container">
          <div className="max-w-2xl">
            <span className="block w-10 h-0.5 bg-[#1D6FA4] mb-6" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              {resolvedCmsContent.hero.title}
            </h1>
            <p className="text-white/60 text-lg leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              {resolvedCmsContent.hero.subtitle}
            </p>
            <div className="mt-8">
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
              <h2 className="text-xl font-bold text-[#0F2137] mb-6" style={{ fontFamily: "Syne, sans-serif" }}>
                {resolvedCmsContent.contactInfo.title}
              </h2>
              <p className="text-[#6B7A8D] text-sm leading-relaxed mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.contactInfo.subtitle}
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-[#1D6FA4]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#0F2137] text-sm mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
                      Telefon
                    </div>
                    <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("contact_page_info")} className="text-[#6B7A8D] text-sm hover:text-[#1D6FA4] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                      {companyConfig.contact.phoneDisplay}
                    </a>
                    <p className="text-[#6B7A8D] text-xs mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                      {companyConfig.openingHours.phoneAvailability}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-[#1D6FA4]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#0F2137] text-sm mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
                      E-Mail
                    </div>
                    <a href={companyConfig.contact.emailHref} className="text-[#6B7A8D] text-sm hover:text-[#1D6FA4] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                      {companyConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-[#1D6FA4]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#0F2137] text-sm mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
                      Adresse
                    </div>
                    <p className="text-[#6B7A8D] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
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
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-[#1D6FA4]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#0F2137] text-sm mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
                      Öffnungszeiten
                    </div>
                    <p className="text-[#6B7A8D] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
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
              <div className="mt-8 bg-white rounded-lg p-5 border border-gray-100">
                <h3 className="font-bold text-[#0F2137] text-sm mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
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
                      <CheckCircle size={14} className="text-[#1D6FA4] shrink-0" />
                      <span className="text-[#6B7A8D] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 bg-white rounded-lg p-5 border border-gray-100">
                <h3 className="font-bold text-[#0F2137] text-sm mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  Einsatzgebiete
                </h3>
                <div className="space-y-2">
                  {leadRegions.map((region) => (
                    <Link key={region.id} href={region.route}>
                      <span
                        onClick={() => handleRegionClick(region.label, region.route)}
                        className="flex items-center justify-between gap-3 py-2 text-[#6B7A8D] text-sm hover:text-[#1D6FA4] transition-colors"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin size={14} className="text-[#1D6FA4]" />
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
                <h2 className="text-3xl font-bold text-[#0F2137] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  {resolvedCmsContent.formSection.title}
                </h2>
                <p className="text-[#6B7A8D] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  {resolvedCmsContent.formSection.subtitle}
                </p>
              </div>
              <QuickContactForm formId="contact_page_quick_contact" formType="contact" source="contact_page" pageType="contact_page" showLeadFields />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
