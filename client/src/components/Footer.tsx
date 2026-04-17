/*
 * Aktive Facility Management Footer Component
 * Design: Architektonischer Minimalismus
 * Helle Surface, klare Struktur, rechtliche Links
 */

import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { trackPhoneClick } from "@/lib/analytics";
import { companyConfig, getCopyrightLine } from "@/config/company";
import { fetchPublicCmsPage } from "@/lib/cms";
import { getDefaultCmsPageContent, normalizeCmsPageContent, type CmsGlobalContent } from "@shared/cms";

function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function Footer() {
  const [cmsContent, setCmsContent] = useState<CmsGlobalContent>(() => getDefaultCmsPageContent("global"));
  const resolvedCmsContent = normalizeCmsPageContent("global", cmsContent);
  const footerAddressLines = useMemo(
    () => splitLines(resolvedCmsContent.footerContact.addressLines),
    [resolvedCmsContent.footerContact.addressLines],
  );
  const footerHoursLines = useMemo(
    () => splitLines(resolvedCmsContent.footerContact.hoursLines),
    [resolvedCmsContent.footerContact.hoursLines],
  );
  const footerCompanyLinks = [
    { label: resolvedCmsContent.navigation.aboutLabel, href: resolvedCmsContent.navigation.aboutHref },
    { label: resolvedCmsContent.navigation.faqLabel, href: resolvedCmsContent.navigation.faqHref },
    { label: resolvedCmsContent.navigation.contactLabel, href: resolvedCmsContent.navigation.contactHref },
    { label: resolvedCmsContent.legal.impressumLabel, href: resolvedCmsContent.legal.impressumHref },
    { label: resolvedCmsContent.legal.datenschutzLabel, href: resolvedCmsContent.legal.datenschutzHref },
  ];

  useEffect(() => {
    let active = true;

    void fetchPublicCmsPage("global")
      .then((page) => {
        if (page && active) {
          setCmsContent(normalizeCmsPageContent("global", page.content));
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  return (
    <footer className="bg-white text-[#1A2332] border-t pc-border">
      <div className="container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 pc-bg-brand rounded-lg flex items-center justify-center shadow-[0_10px_22px_-16px_rgba(30,58,138,0.9)]">
                <span className="text-white font-bold text-sm" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  {companyConfig.brand.initials}
                </span>
              </div>
              <span className="font-bold text-lg pc-text-primary" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                {companyConfig.brand.name}
              </span>
            </div>
            <p className="pc-text-secondary text-sm leading-relaxed mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              {resolvedCmsContent.footer.footerText}
            </p>
            <div className="flex items-center gap-1.5 pc-caption text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
              <span>Mitglied im</span>
              <span className="pc-text-secondary font-medium">{resolvedCmsContent.footer.membershipLabel}</span>
            </div>
          </div>

          <div>
            <h4 className="pc-text-primary font-semibold text-sm mb-5 uppercase tracking-wider" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Leistungen
            </h4>
            <ul className="space-y-2.5">
              {[
                "Büroreinigung",
                "Unterhaltsreinigung",
                "Glasreinigung",
                "Treppenhaus & Außen",
                "Sonderreinigung",
                "Grundreinigung",
              ].map((item) => (
                <li key={item}>
                  <Link href="/leistungen">
                    <span className="pc-text-secondary text-sm hover:text-[var(--pc-primary)] transition-colors duration-200" style={{ fontFamily: "Inter, sans-serif" }}>
                      {item}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="pc-text-primary font-semibold text-sm mb-5 uppercase tracking-wider" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Unternehmen
            </h4>
            <ul className="space-y-2.5">
              {footerCompanyLinks.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link href={item.href}>
                    <span className="pc-text-secondary text-sm hover:text-[var(--pc-primary)] transition-colors duration-200" style={{ fontFamily: "Inter, sans-serif" }}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="pc-text-primary font-semibold text-sm mb-5 uppercase tracking-wider" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Kontakt
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={15} className="pc-text-brand mt-0.5 shrink-0" />
                <div>
                  <div className="pc-text-primary text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                    {resolvedCmsContent.footerContact.phoneLabel}
                  </div>
                  <a
                    href={resolvedCmsContent.footerContact.phoneHref}
                    onClick={() => trackPhoneClick("footer")}
                    className="pc-text-secondary text-sm hover:text-[var(--pc-primary)] transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {resolvedCmsContent.footerContact.phoneDisplay}
                  </a>
                  <p className="pc-caption text-xs mt-0.5">{resolvedCmsContent.footerContact.phoneMeta}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="pc-text-brand mt-0.5 shrink-0" />
                <div>
                  <div className="pc-text-primary text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                    {resolvedCmsContent.footerContact.emailLabel}
                  </div>
                  <a
                    href={resolvedCmsContent.footerContact.emailHref}
                    className="pc-text-secondary text-sm hover:text-[var(--pc-primary)] transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {resolvedCmsContent.footerContact.emailDisplay}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="pc-text-brand mt-0.5 shrink-0" />
                <div className="pc-text-secondary text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                  <p className="pc-text-primary text-sm font-medium mb-1">{resolvedCmsContent.footerContact.addressLabel}</p>
                  {footerAddressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={15} className="pc-text-brand mt-0.5 shrink-0" />
                <div className="pc-text-secondary text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                  <p className="pc-text-primary text-sm font-medium mb-1">{resolvedCmsContent.footerContact.hoursLabel}</p>
                  {footerHoursLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t pc-border">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="pc-caption text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
            {getCopyrightLine()}
          </p>
          <div className="flex items-center gap-5">
            <Link href={resolvedCmsContent.legal.impressumHref}>
              <span className="pc-caption text-xs hover:text-[var(--pc-primary)] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.legal.impressumLabel}
              </span>
            </Link>
            <Link href={resolvedCmsContent.legal.datenschutzHref}>
              <span className="pc-caption text-xs hover:text-[var(--pc-primary)] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.legal.datenschutzLabel}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

