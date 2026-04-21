/*
 * Aktive Facility Management Navigation Component
 * Design: Architektonischer Minimalismus
 * - Transparent on hero, solid white on scroll
 * - Logo left, nav center, CTA right
 * - Mobile hamburger menu
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Phone, Save, X } from "lucide-react";
import { trackCtaClick, trackPhoneClick } from "@/lib/analytics";
import { companyConfig } from "@/config/company";
import { fetchPublicCmsPage } from "@/lib/cms";
import { getDefaultCmsPageContent, normalizeCmsPageContent, type CmsGlobalContent, type CmsNavigationItem } from "@shared/cms";

function isExternalHref(href: string) {
  return /^(?:[a-z][a-z\d+\-.]*:|\/\/)/i.test(href);
}

const NAV_LAYOUT_STORAGE_KEY = "proclean:nav:layout:v1";

interface NavLayoutConfig {
  logoHeightPx: number;
  logoOffsetX: number;
  logoOffsetY: number;
}

const defaultNavLayout: NavLayoutConfig = {
  logoHeightPx: 72,
  logoOffsetX: 0,
  logoOffsetY: 0,
};

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [cmsContent, setCmsContent] = useState<CmsGlobalContent>(() => getDefaultCmsPageContent("global"));
  const [isPreviewResizeMode, setIsPreviewResizeMode] = useState(false);
  const [logoHeightPx, setLogoHeightPx] = useState<number>(defaultNavLayout.logoHeightPx);
  const [logoOffset, setLogoOffset] = useState({ x: defaultNavLayout.logoOffsetX, y: defaultNavLayout.logoOffsetY });
  const [saveNotice, setSaveNotice] = useState("");
  const [location] = useLocation();
  const logoRef = useRef<HTMLImageElement | null>(null);
  const editBoundsRef = useRef<HTMLDivElement | null>(null);
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
    if (typeof window === "undefined") {
      return;
    }

    const raw = window.localStorage.getItem(NAV_LAYOUT_STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<NavLayoutConfig>;
      setLogoHeightPx(typeof parsed.logoHeightPx === "number" ? parsed.logoHeightPx : defaultNavLayout.logoHeightPx);
      setLogoOffset({
        x: typeof parsed.logoOffsetX === "number" ? parsed.logoOffsetX : defaultNavLayout.logoOffsetX,
        y: typeof parsed.logoOffsetY === "number" ? parsed.logoOffsetY : defaultNavLayout.logoOffsetY,
      });
    } catch {
      // ignore broken local layout payload
    }
  }, []);

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

  const clampOffset = (nextX: number, nextY: number, target: HTMLElement | null) => {
    const frame = editBoundsRef.current?.getBoundingClientRect();
    const element = target?.getBoundingClientRect();
    if (!frame || !element) {
      return { x: nextX, y: nextY };
    }

    const xDelta = frame.width - element.width;
    const yDelta = frame.height - element.height;
    const minX = Math.min(0, xDelta);
    const maxX = Math.max(0, xDelta);
    const minY = Math.min(0, yDelta);
    const maxY = Math.max(0, yDelta);

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
    const currentHeight = logoRef.current?.getBoundingClientRect().height ?? defaultNavLayout.logoHeightPx;
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
    const next = clampOffset(
      moveDragStateRef.current.startOffsetX + deltaX,
      moveDragStateRef.current.startOffsetY + deltaY,
      logoRef.current,
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

  const handleSaveLayout = () => {
    if (typeof window === "undefined") {
      return;
    }

    const payload: NavLayoutConfig = {
      logoHeightPx,
      logoOffsetX: logoOffset.x,
      logoOffsetY: logoOffset.y,
    };

    window.localStorage.setItem(NAV_LAYOUT_STORAGE_KEY, JSON.stringify(payload));
    setSaveNotice("Gespeichert");
    window.setTimeout(() => setSaveNotice(""), 1400);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handleResizeDrag);
      window.removeEventListener("pointerup", stopResizeDrag);
      window.removeEventListener("pointermove", handleMoveDrag);
      window.removeEventListener("pointerup", stopMoveDrag);
    };
  }, []);
  const resolvedLogoWidth = logoRef.current?.getBoundingClientRect().width ?? Math.max(120, Math.round(logoHeightPx * 2));

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTopState
          ? "bg-white border-b border-slate-200 shadow-[0_8px_24px_-24px_rgba(15,33,55,0.45)]"
          : "bg-white shadow-[0_12px_28px_-22px_rgba(15,33,55,0.65)] border-b border-slate-200"
      }`}
    >
      <div className="container">
        <div className="relative flex items-center justify-between h-16 lg:h-20 gap-3 lg:gap-6">
          <div ref={editBoundsRef} className="relative h-[52px] w-[190px] shrink-0 overflow-hidden sm:h-[58px] sm:w-[220px] lg:h-[66px] lg:w-[320px]">
            {isPreviewResizeMode ? (
              <>
              <img
                ref={logoRef}
                src={companyConfig.brand.logoUrl}
                alt={`${companyConfig.brand.name} Logo`}
                className="absolute left-0 top-0 h-[56px] w-auto cursor-move select-none sm:h-[64px] lg:h-[72px]"
                loading="eager"
                decoding="async"
                width={700}
                height={350}
                draggable={false}
                onDragStart={(event) => event.preventDefault()}
                onPointerDown={handleMoveDragStart}
                style={{
                  height: `${logoHeightPx}px`,
                  transform: `translate(${logoOffset.x}px, ${logoOffset.y}px)`,
                }}
              />
              <button
                type="button"
                onPointerDown={handleResizeDragStart}
                className="absolute z-20 h-4 w-4 rounded border border-slate-400 bg-white shadow"
                style={{
                  left: `${Math.max(4, logoOffset.x + resolvedLogoWidth - 8)}px`,
                  top: `${Math.max(4, logoOffset.y + Math.max(logoHeightPx - 8, 8))}px`,
                }}
                title="Logo-Größe ziehen"
                aria-label="Logo-Größe ziehen"
              />
              <button
                type="button"
                onClick={handleSaveLayout}
                className="absolute right-1 top-1 inline-flex h-7 items-center gap-1 rounded-md border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-700 shadow-sm"
                aria-label="Layout speichern"
                title="Layout speichern"
              >
                <Save size={12} />
                {saveNotice || "Speichern"}
              </button>
              </>
            ) : (
              <Link href="/">
                <div className="relative flex h-full items-center overflow-visible">
                <img
                  ref={logoRef}
                  src={companyConfig.brand.logoUrl}
                  alt={`${companyConfig.brand.name} Logo`}
                  className="h-[56px] w-auto sm:h-[64px] lg:h-[72px]"
                  loading="eager"
                  decoding="async"
                  width={700}
                  height={350}
                  style={{
                    height: `${logoHeightPx}px`,
                    transform: `translate(${logoOffset.x}px, ${logoOffset.y}px)`,
                  }}
                />
                </div>
              </Link>
            )}
          </div>

          <div className="hidden lg:flex flex-1 min-w-0 items-center justify-end gap-8">
            <nav className="flex min-w-0 items-center justify-end gap-6 whitespace-nowrap">
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

            <div className="flex shrink-0 items-center gap-3">
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


