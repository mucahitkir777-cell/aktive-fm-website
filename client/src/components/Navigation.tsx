/*
 * Aktive Facility Management Navigation Component
 * Design: Architektonischer Minimalismus
 * - Transparent on hero, solid white on scroll
 * - Logo left, nav center, CTA right
 * - Mobile hamburger menu
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Phone, X } from "lucide-react";
import { trackCtaClick, trackPhoneClick } from "@/lib/analytics";
import { companyConfig } from "@/config/company";
import { fetchPublicCmsPage } from "@/lib/cms";
import { getDefaultCmsPageContent, normalizeCmsPageContent, type CmsGlobalContent, type CmsNavigationItem } from "@shared/cms";

function isExternalHref(href: string) {
  return /^(?:[a-z][a-z\d+\-.]*:|\/\/)/i.test(href);
}

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [cmsContent, setCmsContent] = useState<CmsGlobalContent>(() => getDefaultCmsPageContent("global"));
  const [isPreviewResizeMode, setIsPreviewResizeMode] = useState(false);
  const [logoHeightPx, setLogoHeightPx] = useState<number | null>(null);
  const [logoOffset, setLogoOffset] = useState({ x: 0, y: 0 });
  const [location] = useLocation();
  const logoRef = useRef<HTMLImageElement | null>(null);
  const logoFrameRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{ startY: number; startHeight: number } | null>(null);
  const moveDragStateRef = useRef<{ startX: number; startY: number; startOffsetX: number; startOffsetY: number } | null>(null);
  const isHome = location === "/";
  const resolvedCmsContent = normalizeCmsPageContent("global", cmsContent);
  const navLinks = useMemo(() => {
    const baseLinks: CmsNavigationItem[] = Array.isArray(resolvedCmsContent.navigation.items)
      ? resolvedCmsContent.navigation.items
      : [];

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
    const query = new URLSearchParams(window.location.search);
    setIsPreviewResizeMode(query.get("previewLogoResize") === "1");
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
  const ctaHref = resolvedCmsContent.navigation.ctaHref;
  const ctaIsExternal = isExternalHref(ctaHref);

  const stopResizeDrag = () => {
    dragStateRef.current = null;
    window.removeEventListener("pointermove", handleResizeDrag);
    window.removeEventListener("pointerup", stopResizeDrag);
  };

  const clampLogoOffset = (nextX: number, nextY: number) => {
    const frame = logoFrameRef.current?.getBoundingClientRect();
    const logo = logoRef.current?.getBoundingClientRect();
    if (!frame || !logo) {
      return { x: nextX, y: nextY };
    }

    const minX = Math.min(0, frame.width - logo.width);
    const maxX = 0;
    const minY = Math.min(0, frame.height - logo.height);
    const maxY = 0;

    return {
      x: Math.max(minX, Math.min(maxX, nextX)),
      y: Math.max(minY, Math.min(maxY, nextY)),
    };
  };

  function handleResizeDrag(event: PointerEvent) {
    if (!dragStateRef.current) {
      return;
    }

    const deltaY = event.clientY - dragStateRef.current.startY;
    const nextHeight = Math.max(44, Math.min(140, Math.round(dragStateRef.current.startHeight + deltaY)));
    setLogoHeightPx(nextHeight);
  }

  const handleResizeDragStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!isPreviewResizeMode) {
      return;
    }

    event.preventDefault();
    const currentHeight = logoRef.current?.getBoundingClientRect().height ?? 72;
    dragStateRef.current = {
      startY: event.clientY,
      startHeight: currentHeight,
    };

    window.addEventListener("pointermove", handleResizeDrag);
    window.addEventListener("pointerup", stopResizeDrag);
  };

  const stopMoveDrag = () => {
    moveDragStateRef.current = null;
    window.removeEventListener("pointermove", handleMoveDrag);
    window.removeEventListener("pointerup", stopMoveDrag);
  };

  function handleMoveDrag(event: PointerEvent) {
    if (!moveDragStateRef.current) {
      return;
    }

    const deltaX = event.clientX - moveDragStateRef.current.startX;
    const deltaY = event.clientY - moveDragStateRef.current.startY;
    const next = clampLogoOffset(
      moveDragStateRef.current.startOffsetX + deltaX,
      moveDragStateRef.current.startOffsetY + deltaY,
    );
    setLogoOffset(next);
  }

  const handleMoveDragStart = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!isPreviewResizeMode) {
      return;
    }

    event.preventDefault();
    moveDragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startOffsetX: logoOffset.x,
      startOffsetY: logoOffset.y,
    };

    window.addEventListener("pointermove", handleMoveDrag);
    window.addEventListener("pointerup", stopMoveDrag);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handleResizeDrag);
      window.removeEventListener("pointerup", stopResizeDrag);
      window.removeEventListener("pointermove", handleMoveDrag);
      window.removeEventListener("pointerup", stopMoveDrag);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTopState
          ? "bg-white border-b border-slate-200 shadow-[0_8px_24px_-24px_rgba(15,33,55,0.45)]"
          : "bg-white shadow-[0_12px_28px_-22px_rgba(15,33,55,0.65)] border-b border-slate-200"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/">
            <div
              ref={logoFrameRef}
              className={`relative flex items-center group ${isPreviewResizeMode ? "h-full w-[240px] sm:w-[280px] lg:w-[320px] overflow-hidden" : "overflow-visible"}`}
            >
              <img
                ref={logoRef}
                src={companyConfig.brand.logoUrl}
                alt={`${companyConfig.brand.name} Logo`}
                className={`h-[56px] w-auto sm:h-[64px] lg:h-[72px] ${isPreviewResizeMode ? "absolute left-0 top-1/2 -translate-y-1/2 cursor-move select-none" : ""}`}
                loading="eager"
                decoding="async"
                width={700}
                height={350}
                onPointerDown={handleMoveDragStart}
                style={
                  isPreviewResizeMode
                    ? {
                        height: logoHeightPx ? `${logoHeightPx}px` : undefined,
                        transform: `translate(${logoOffset.x}px, calc(-50% + ${logoOffset.y}px))`,
                      }
                    : (logoHeightPx ? { height: `${logoHeightPx}px` } : undefined)
                }
              />
              {isPreviewResizeMode ? (
                <button
                  type="button"
                  onPointerDown={handleResizeDragStart}
                  className="absolute right-1 bottom-1 h-4 w-4 rounded-full border border-slate-400 bg-white shadow"
                  title="Logo-Größe ziehen"
                  aria-label="Logo-Größe ziehen"
                />
              ) : null}
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              link.target === "_blank" || isExternalHref(link.href) ? (
                <a
                  key={link.id}
                  href={link.href}
                  target={link.target}
                  rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                  className="pc-nav-link"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`pc-nav-link ${
                    location === link.href.split("#")[0]
                      ? "pc-text-brand pc-bg-soft"
                      : ""
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href={companyConfig.contact.phoneHref}
              onClick={() => handlePhoneClick("navigation_desktop")}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 pc-text-primary hover:text-[var(--color-primary)] rounded-lg px-3 py-2 hover:bg-[var(--color-bg-soft)]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Phone size={14} />
              <span>{companyConfig.contact.phoneDisplay}</span>
            </a>
            {ctaIsExternal ? (
              <a href={ctaHref} onClick={() => handleRequestClick("navigation_desktop")} className="pc-btn-primary text-sm px-5 py-2.5">
                {resolvedCmsContent.navigation.ctaLabel}
              </a>
            ) : (
              <Link href={ctaHref} onClick={() => handleRequestClick("navigation_desktop")} className="pc-btn-primary text-sm px-5 py-2.5">
                {resolvedCmsContent.navigation.ctaLabel}
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors pc-text-primary hover:bg-[var(--color-bg-soft)]"
            aria-label={isMobileOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation-menu"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div id="mobile-navigation-menu" className="lg:hidden bg-white border-t pc-border shadow-[0_18px_34px_-26px_rgba(15,33,55,0.6)]">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              link.target === "_blank" || isExternalHref(link.href) ? (
                <a
                  key={link.id}
                  href={link.href}
                  target={link.target}
                  rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                  className="block py-3 px-2 text-sm font-medium rounded transition-colors pc-text-primary hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-soft)]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`block py-3 px-2 text-sm font-medium rounded transition-colors ${
                    location === link.href.split("#")[0]
                      ? "pc-text-brand pc-bg-soft"
                      : "pc-text-primary hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-soft)]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {link.label}
                </Link>
              )
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
              {ctaIsExternal ? (
                <a href={ctaHref} onClick={() => handleRequestClick("navigation_mobile")} className="pc-btn-primary w-full justify-center text-sm">
                  {resolvedCmsContent.navigation.ctaLabel}
                </a>
              ) : (
                <Link href={ctaHref} onClick={() => handleRequestClick("navigation_mobile")} className="pc-btn-primary w-full justify-center text-sm">
                  {resolvedCmsContent.navigation.ctaLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


