/*
 * Aktive Facility Management Navigation Component
 * Design: Architektonischer Minimalismus
 * - Transparent on hero, solid white on scroll
 * - Logo left, nav center, CTA right
 * - Mobile hamburger menu
 */

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Phone, X } from "lucide-react";
import { trackCtaClick, trackPhoneClick } from "@/lib/analytics";
import { companyConfig } from "@/config/company";
import { fetchPublicCmsPage } from "@/lib/cms";
import { getDefaultCmsPageContent, normalizeCmsPageContent, type CmsGlobalContent } from "@shared/cms";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [cmsContent, setCmsContent] = useState<CmsGlobalContent>(() => getDefaultCmsPageContent("global"));
  const [location] = useLocation();
  const isHome = location === "/";
  const resolvedCmsContent = normalizeCmsPageContent("global", cmsContent);
  const navLinks = useMemo(() => {
    const baseLinks = [
      {
        id: "home",
        href: resolvedCmsContent.navigation.homeHref,
        label: resolvedCmsContent.navigation.homeLabel,
        visible: resolvedCmsContent.navigation.homeVisible,
        sortOrder: resolvedCmsContent.navigation.homeSortOrder,
      },
      {
        id: "services",
        href: resolvedCmsContent.navigation.servicesHref,
        label: resolvedCmsContent.navigation.servicesLabel,
        visible: resolvedCmsContent.navigation.servicesVisible,
        sortOrder: resolvedCmsContent.navigation.servicesSortOrder,
      },
      {
        id: "about",
        href: resolvedCmsContent.navigation.aboutHref,
        label: resolvedCmsContent.navigation.aboutLabel,
        visible: resolvedCmsContent.navigation.aboutVisible,
        sortOrder: resolvedCmsContent.navigation.aboutSortOrder,
      },
      {
        id: "faq",
        href: resolvedCmsContent.navigation.faqHref,
        label: resolvedCmsContent.navigation.faqLabel,
        visible: resolvedCmsContent.navigation.faqVisible,
        sortOrder: resolvedCmsContent.navigation.faqSortOrder,
      },
      {
        id: "contact",
        href: resolvedCmsContent.navigation.contactHref,
        label: resolvedCmsContent.navigation.contactLabel,
        visible: resolvedCmsContent.navigation.contactVisible,
        sortOrder: resolvedCmsContent.navigation.contactSortOrder,
      },
    ];

    return baseLinks
      .map((link, index) => {
        const parsedSortOrder = Number(link.sortOrder);
        return {
          ...link,
          fallbackIndex: index,
          isVisible: typeof link.visible === "boolean" ? link.visible : true,
          resolvedSortOrder: Number.isFinite(parsedSortOrder) ? parsedSortOrder : 999,
        };
      })
      .filter((link) => link.isVisible)
      .sort((left, right) => {
        if (left.resolvedSortOrder === right.resolvedSortOrder) {
          return left.fallbackIndex - right.fallbackIndex;
        }
        return left.resolvedSortOrder - right.resolvedSortOrder;
      });
  }, [resolvedCmsContent]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

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

  const isTopState = isHome && !isScrolled && !isMobileOpen;

  const handlePhoneClick = (buttonLocation: string) => {
    trackPhoneClick(buttonLocation);
  };

  const handleRequestClick = (buttonLocation: string) => {
    trackCtaClick({
      cta_id: `${buttonLocation}_offer_request`,
      cta_text: resolvedCmsContent.navigation.ctaLabel,
      cta_location: buttonLocation,
      destination_url: resolvedCmsContent.navigation.ctaHref,
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTopState
          ? "bg-white/95 backdrop-blur-sm border-b pc-border"
          : "bg-white/98 backdrop-blur-sm shadow-[0_10px_35px_-24px_rgba(15,33,55,0.65)] border-b pc-border"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/">
            <div className="flex items-center gap-2 group">
              <div className="w-8 h-8 pc-bg-brand rounded-lg flex items-center justify-center shadow-[0_10px_22px_-14px_rgba(30,58,138,0.8)]">
                <span className="text-white font-bold text-sm" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  {companyConfig.brand.initials}
                </span>
              </div>
              <div>
                <span
                  className="font-bold text-lg leading-none transition-colors duration-300 pc-text-primary"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  {companyConfig.brand.name}
                </span>
                <span
                  className="block text-xs font-normal leading-none transition-colors duration-300 pc-text-muted"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {companyConfig.brand.descriptor}
                </span>
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.id} href={link.href}>
                <span
                  className={`pc-nav-link ${
                    location === link.href
                      ? "pc-text-brand pc-bg-soft"
                      : ""
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href={companyConfig.contact.phoneHref}
              onClick={() => handlePhoneClick("navigation_desktop")}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 pc-text-primary hover:text-[var(--color-primary)] rounded-lg px-3 py-2 hover:bg-[var(--color-bg-soft)]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Phone size={14} />
              <span>{companyConfig.contact.phoneDisplay}</span>
            </a>
            <Link href={resolvedCmsContent.navigation.ctaHref}>
              <span onClick={() => handleRequestClick("navigation_desktop")} className="pc-btn-primary text-sm px-5 py-2.5">
                {resolvedCmsContent.navigation.ctaLabel}
              </span>
            </Link>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors pc-text-primary hover:bg-[var(--color-bg-soft)]"
            aria-label="Menü öffnen"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="lg:hidden bg-white border-t pc-border shadow-[0_18px_34px_-26px_rgba(15,33,55,0.6)]">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.id} href={link.href}>
                <span
                  className={`block py-3 px-2 text-sm font-medium rounded transition-colors ${
                    location === link.href
                      ? "pc-text-brand pc-bg-soft"
                      : "pc-text-primary hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-soft)]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t pc-border flex flex-col gap-2">
              <a
                href={companyConfig.contact.phoneHref}
                onClick={() => handlePhoneClick("navigation_mobile")}
                className="flex items-center gap-2 py-2.5 px-2 text-sm font-medium pc-text-primary rounded-lg hover:bg-[var(--color-bg-soft)] transition-colors"
              >
                <Phone size={16} className="pc-text-brand" />
                {companyConfig.contact.phoneDisplay}
              </a>
              <Link href={resolvedCmsContent.navigation.ctaHref}>
                <span onClick={() => handleRequestClick("navigation_mobile")} className="pc-btn-primary w-full justify-center text-sm">
                  {resolvedCmsContent.navigation.ctaLabel}
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

