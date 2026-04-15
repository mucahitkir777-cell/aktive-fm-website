/*
 * ProClean Navigation Component
 * Design: Architektonischer Minimalismus
 * - Transparent on hero, solid white on scroll
 * - Logo left, nav center, CTA right
 * - Mobile hamburger menu
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { trackCtaClick, trackPhoneClick } from "@/lib/analytics";
import { companyConfig } from "@/config/company";

const navLinks = [
  { href: "/", label: "Startseite" },
  { href: "/leistungen", label: "Leistungen" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/";

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

  const isTransparent = isHome && !isScrolled && !isMobileOpen;

  const handlePhoneClick = (buttonLocation: string) => {
    trackPhoneClick(buttonLocation);
  };

  const handleRequestClick = (buttonLocation: string) => {
    trackCtaClick({
      cta_id: `${buttonLocation}_offer_request`,
      cta_text: "Angebot anfragen",
      cta_location: buttonLocation,
      destination_url: "/kontakt",
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#1D6FA4] rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>
                  {companyConfig.brand.initials}
                </span>
              </div>
              <div>
                <span
                  className={`font-bold text-lg leading-none transition-colors duration-300 ${
                    isTransparent ? "text-white" : "text-[#0F2137]"
                  }`}
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {companyConfig.brand.name}
                </span>
                <span
                  className={`block text-xs font-normal leading-none transition-colors duration-300 ${
                    isTransparent ? "text-white/70" : "text-[#6B7A8D]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {companyConfig.brand.descriptor}
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isTransparent
                      ? "text-white/90 hover:text-white"
                      : location === link.href
                      ? "text-[#1D6FA4]"
                      : "text-[#1A2332] hover:text-[#1D6FA4]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={companyConfig.contact.phoneHref}
              onClick={() => handlePhoneClick("navigation_desktop")}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
                isTransparent ? "text-white/90 hover:text-white" : "text-[#1A2332] hover:text-[#1D6FA4]"
              }`}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Phone size={14} />
              <span>{companyConfig.contact.phoneDisplay}</span>
            </a>
            <Link href="/kontakt">
              <span onClick={() => handleRequestClick("navigation_desktop")} className="pc-btn-primary text-sm px-5 py-2.5">
                Angebot anfragen
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`lg:hidden p-2 rounded transition-colors ${
              isTransparent ? "text-white hover:bg-white/10" : "text-[#0F2137] hover:bg-gray-100"
            }`}
            aria-label="Menü öffnen"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`block py-3 px-2 text-sm font-medium rounded transition-colors ${
                    location === link.href
                      ? "text-[#1D6FA4] bg-blue-50"
                      : "text-[#1A2332] hover:text-[#1D6FA4] hover:bg-gray-50"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">
              <a
                href={companyConfig.contact.phoneHref}
                onClick={() => handlePhoneClick("navigation_mobile")}
                className="flex items-center gap-2 py-2.5 px-2 text-sm font-medium text-[#1A2332]"
              >
                <Phone size={16} className="text-[#1D6FA4]" />
                {companyConfig.contact.phoneDisplay}
              </a>
              <Link href="/kontakt">
                <span onClick={() => handleRequestClick("navigation_mobile")} className="pc-btn-primary w-full justify-center text-sm">
                  Kostenloses Angebot
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
