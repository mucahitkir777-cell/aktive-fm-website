/*
 * ProClean Footer Component
 * Design: Architektonischer Minimalismus
 * Dark navy background, clean layout, legal links
 */

import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { trackPhoneClick } from "@/lib/analytics";
import { companyConfig, getCopyrightLine } from "@/config/company";

export default function Footer() {
  return (
    <footer className="bg-[#0F2137] text-white">
      {/* Main Footer */}
      <div className="container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-[#1D6FA4] rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>
                  {companyConfig.brand.initials}
                </span>
              </div>
              <span className="font-bold text-lg text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                {companyConfig.brand.name}
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              {companyConfig.brand.footerText}
            </p>
            <div className="flex items-center gap-1.5 text-white/40 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
              <span>Mitglied im</span>
              <span className="text-white/60 font-medium">{companyConfig.brand.membershipLabel}</span>
            </div>
          </div>

          {/* Leistungen */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider" style={{ fontFamily: "Syne, sans-serif" }}>
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
                    <span className="text-white/60 text-sm hover:text-white transition-colors duration-200" style={{ fontFamily: "Inter, sans-serif" }}>
                      {item}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Unternehmen */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider" style={{ fontFamily: "Syne, sans-serif" }}>
              Unternehmen
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Über uns", href: "/ueber-uns" },
                { label: "FAQ", href: "/faq" },
                { label: "Kontakt", href: "/kontakt" },
                { label: "Impressum", href: "/impressum" },
                { label: "Datenschutz", href: "/datenschutz" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className="text-white/60 text-sm hover:text-white transition-colors duration-200" style={{ fontFamily: "Inter, sans-serif" }}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider" style={{ fontFamily: "Syne, sans-serif" }}>
              Kontakt
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-[#1D6FA4] mt-0.5 shrink-0" />
                <div>
                  <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("footer")} className="text-white/80 text-sm hover:text-white transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                    {companyConfig.contact.phoneDisplay}
                  </a>
                  <p className="text-white/40 text-xs mt-0.5">{companyConfig.openingHours.phoneAvailability}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-[#1D6FA4] mt-0.5 shrink-0" />
                <a href={companyConfig.contact.emailHref} className="text-white/80 text-sm hover:text-white transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                  {companyConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-[#1D6FA4] mt-0.5 shrink-0" />
                <div className="text-white/60 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                  {companyConfig.address.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={15} className="text-[#1D6FA4] mt-0.5 shrink-0" />
                <div className="text-white/60 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                  {companyConfig.openingHours.footerLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
            {getCopyrightLine()}
          </p>
          <div className="flex items-center gap-5">
            <Link href="/impressum">
              <span className="text-white/40 text-xs hover:text-white/70 transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                Impressum
              </span>
            </Link>
            <Link href="/datenschutz">
              <span className="text-white/40 text-xs hover:text-white/70 transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                Datenschutz
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
