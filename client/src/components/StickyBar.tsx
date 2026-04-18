import { useEffect, useState } from "react";
import { MessageCircle, Phone, Send } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getDefaultCmsPageContent, normalizeCmsPageContent, type CmsGlobalContent } from "@shared/cms";
import { companyConfig } from "@/config/company";
import { trackCtaClick, trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";
import { fetchPublicCmsPage } from "@/lib/cms";

const MOBILE_BAR_BASE_HEIGHT = 72;

export default function StickyBar() {
  const [location] = useLocation();
  const [cmsContent, setCmsContent] = useState<CmsGlobalContent>(() => getDefaultCmsPageContent("global"));
  const resolvedCmsContent = normalizeCmsPageContent("global", cmsContent);

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

  if (location.startsWith("/admin")) {
    return null;
  }

  const phoneHref = resolvedCmsContent.footerContact.phoneHref || companyConfig.contact.phoneHref;
  const phoneDisplay = resolvedCmsContent.footerContact.phoneDisplay || companyConfig.contact.phoneDisplay;
  const requestHref = resolvedCmsContent.navigation.ctaHref || "/kontakt";
  const requestLabel = resolvedCmsContent.navigation.ctaLabel || "Angebot anfragen";

  const handlePhoneClick = () => {
    trackPhoneClick("sticky_bar", {
      button_text: phoneDisplay,
      destination_url: phoneHref,
    });
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick("sticky_bar", {
      button_text: "WhatsApp",
      destination_url: companyConfig.contact.whatsappHref,
    });
  };

  const handleRequestClick = () => {
    trackCtaClick({
      cta_id: "sticky_bar_request",
      cta_text: requestLabel,
      cta_location: "sticky_bar",
      destination_url: requestHref,
    });
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 hidden md:block">
        <div className="rounded-2xl border pc-border bg-white/96 p-2 shadow-[0_24px_36px_-30px_rgba(15,33,55,0.55)] backdrop-blur">
          <div className="flex flex-col gap-1.5">
            <a
              href={phoneHref}
              onClick={handlePhoneClick}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold pc-text-brand transition-colors hover:bg-[var(--pc-bg-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc-primary)]"
              aria-label={`Telefonisch kontaktieren: ${phoneDisplay}`}
            >
              <Phone size={16} />
              <span>Anrufen</span>
            </a>
            <a
              href={companyConfig.contact.whatsappHref}
              onClick={handleWhatsAppClick}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold pc-text-accent transition-colors hover:bg-[var(--pc-bg-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc-accent)]"
              aria-label="Kontakt per WhatsApp"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>
            <Link
              href={requestHref}
              onClick={handleRequestClick}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold pc-text-primary transition-colors hover:bg-[var(--pc-bg-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc-primary)]"
              aria-label={`${requestLabel} öffnen`}
            >
              <Send size={16} />
              <span>{requestLabel}</span>
            </Link>
          </div>
        </div>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t pc-border bg-white/98 shadow-[0_-12px_28px_-24px_rgba(15,33,55,0.8)] backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="grid grid-cols-3">
          <a
            href={phoneHref}
            onClick={handlePhoneClick}
            className="inline-flex min-h-[72px] flex-col items-center justify-center gap-1 border-r pc-border px-2 py-2 pc-text-brand transition-colors hover:bg-[var(--pc-bg-soft)] active:bg-[var(--pc-bg-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc-primary)]"
            aria-label={`Telefonisch kontaktieren: ${phoneDisplay}`}
          >
            <Phone size={20} />
            <span className="text-xs font-semibold">Anrufen</span>
          </a>
          <a
            href={companyConfig.contact.whatsappHref}
            onClick={handleWhatsAppClick}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[72px] flex-col items-center justify-center gap-1 border-r pc-border px-2 py-2 pc-text-accent transition-colors hover:bg-[var(--pc-bg-soft)] active:bg-[var(--pc-bg-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc-accent)]"
            aria-label="Kontakt per WhatsApp"
          >
            <MessageCircle size={20} />
            <span className="text-xs font-semibold">WhatsApp</span>
          </a>
          <Link
            href={requestHref}
            onClick={handleRequestClick}
            className="inline-flex min-h-[72px] flex-col items-center justify-center gap-1 px-2 py-2 pc-text-primary transition-colors hover:bg-[var(--pc-bg-soft)] active:bg-[var(--pc-bg-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc-primary)]"
            aria-label={`${requestLabel} öffnen`}
          >
            <Send size={20} />
            <span className="text-xs font-semibold">Anfrage</span>
          </Link>
        </div>
      </div>

      <div
        className="md:hidden"
        style={{ height: `calc(${MOBILE_BAR_BASE_HEIGHT}px + env(safe-area-inset-bottom, 0px))` }}
        aria-hidden="true"
      />
    </>
  );
}
