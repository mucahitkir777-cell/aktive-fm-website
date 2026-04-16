/*
 * ProClean Sticky-Bar
 * Lead-Maschinen-Element: Permanent sichtbar auf Mobile
 * Enthält: Telefon, WhatsApp, Anfrage-Button
 */

import { Phone, MessageCircle, FileText } from "lucide-react";
import { Link } from "wouter";
import { trackCtaClick, trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";
import { companyConfig } from "@/config/company";

export default function StickyBar() {
  const handlePhoneClick = () => {
    trackPhoneClick('sticky_bar');
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('sticky_bar');
  };

  const handleRequestClick = () => {
    trackCtaClick({
      cta_id: "sticky_bar_request",
      cta_text: "Anfrage",
      cta_location: "sticky_bar",
      destination_url: "/kontakt",
    });
  };

  return (
    <>
      {/* Desktop Sticky Bar (oben rechts) */}
      <div className="hidden lg:fixed lg:top-24 lg:right-6 lg:z-40 lg:flex lg:flex-col lg:gap-3">
        {/* Telefon */}
        <a
          href={companyConfig.contact.phoneHref}
          onClick={handlePhoneClick}
          className="flex items-center justify-center w-14 h-14 pc-bg-brand text-white rounded-full shadow-lg hover:bg-[var(--pc-primary-hover)] hover:shadow-xl transition-all duration-200 hover:scale-110"
          title="Anrufen"
        >
          <Phone size={20} />
        </a>

        {/* WhatsApp */}
        <a
          href={companyConfig.contact.whatsappHref}
          onClick={handleWhatsAppClick}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:shadow-xl transition-all duration-200 hover:scale-110"
          title="WhatsApp"
        >
          <MessageCircle size={20} />
        </a>

        {/* Anfrage */}
        <Link href="/kontakt">
          <span onClick={handleRequestClick} className="flex items-center justify-center w-14 h-14 pc-bg-accent pc-text-primary rounded-full shadow-lg hover:bg-[var(--pc-primary)] hover:text-white hover:shadow-xl transition-all duration-200 hover:scale-110 cursor-pointer" title="Angebot anfordern">
            <FileText size={20} />
          </span>
        </Link>
      </div>

      {/* Mobile Sticky Bar (unten, horizontal) */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-white border-t pc-border shadow-[0_-10px_36px_-30px_rgba(15,33,55,0.8)]">
        <div className="flex items-center justify-around h-16">
          {/* Telefon */}
          <a
            href={companyConfig.contact.phoneHref}
            onClick={handlePhoneClick}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 pc-text-brand hover:bg-[var(--pc-bg-soft)] transition-colors"
          >
            <Phone size={20} />
            <span className="text-xs font-semibold">Anrufen</span>
          </a>

          {/* WhatsApp */}
          <a
            href={companyConfig.contact.whatsappHref}
            onClick={handleWhatsAppClick}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 text-green-500 hover:bg-green-50 transition-colors"
          >
            <MessageCircle size={20} />
            <span className="text-xs font-semibold">WhatsApp</span>
          </a>

          {/* Anfrage */}
          <Link href="/kontakt">
            <span onClick={handleRequestClick} className="flex-1 flex flex-col items-center justify-center gap-1 py-2 pc-text-brand hover:bg-[var(--pc-bg-soft)] transition-colors cursor-pointer">
              <FileText size={20} />
              <span className="text-xs font-semibold">Anfrage</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Spacer für Mobile (damit Content nicht von Sticky-Bar verdeckt wird) */}
      <div className="h-16 lg:hidden" />
    </>
  );
}

// Umami-Typen erweitern
declare global {
  interface Window {
    umami?: {
      track: (name: string, data?: Record<string, any>) => void;
    };
  }
}
