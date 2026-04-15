/*
 * ProClean 404-Seite
 * Design: Architektonischer Minimalismus
 */

import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navigation />

      <section className="bg-[#0F2137] pt-28 pb-16 min-h-[60vh] flex items-center">
        <div className="container">
          <div className="max-w-lg">
            <span className="text-[#1D6FA4] font-bold text-8xl lg:text-9xl block mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              404
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              Seite nicht gefunden
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
              Die gesuchte Seite existiert nicht oder wurde verschoben. Kehren Sie zur Startseite zurück.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/">
                <span className="pc-btn-primary">
                  <Home size={16} />
                  Zur Startseite
                </span>
              </Link>
              <button
                onClick={() => window.history.back()}
                className="pc-btn-white"
              >
                <ArrowLeft size={16} />
                Zurück
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
