/*
 * ProClean Über uns Seite
 * Design: Architektonischer Minimalismus
 */

import { Link } from "wouter";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trackCtaClick } from "@/lib/analytics";
import { companyConfig } from "@/config/company";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Award,
  Users,
  Heart,
} from "lucide-react";

const IMAGES = {
  aboutTeam: "https://d2xsxph8kpxj0f.cloudfront.net/310519663547187307/43Rukg9YxBYUx2aiERC352/about-team-TkNpxcp8EkwwruinupRxfN.webp",
  heroOffice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663547187307/43Rukg9YxBYUx2aiERC352/hero-office-VNZtTnE2YeTnTnK8cq3QYi.webp",
};

const values = [
  {
    icon: Shield,
    title: "Verlässlichkeit",
    desc: "Wir halten, was wir versprechen. Termine, Qualität und Absprachen – ohne Ausnahme.",
  },
  {
    icon: Award,
    title: "Qualität",
    desc: "Kein Kompromiss bei der Ausführung. Wir arbeiten gründlich, sorgfältig und mit hochwertigen Materialien.",
  },
  {
    icon: Users,
    title: "Partnerschaft",
    desc: "Wir verstehen uns als langfristiger Partner unserer Kunden – nicht als anonymer Dienstleister.",
  },
  {
    icon: Heart,
    title: "Verantwortung",
    desc: "Verantwortung gegenüber unseren Kunden, Mitarbeitern und der Umwelt prägt unser Handeln.",
  },
];

export default function UeberUns() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
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
              Über uns
            </h1>
            <p className="text-white/60 text-lg leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              Wir sind {companyConfig.brand.name} – ein mittelständisches Reinigungsunternehmen mit Leidenschaft für Qualität und echtem Engagement für unsere Kunden.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="pc-section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="pc-fade-up">
              <span className="pc-accent-line" />
              <h2 className="pc-section-title mb-6">
                Unsere Geschichte
              </h2>
              <p className="text-[#6B7A8D] leading-relaxed mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                {companyConfig.brand.name} wurde gegründet mit einer klaren Vision: Gebäudereinigung auf einem Niveau anzubieten, das Unternehmen wirklich überzeugt. Nicht durch Versprechen, sondern durch konsequente Qualität.
              </p>
              <p className="text-[#6B7A8D] leading-relaxed mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                Was als kleines lokales Unternehmen begann, ist heute ein verlässlicher Partner für Unternehmen aus verschiedensten Branchen. Unser Wachstum basiert auf Weiterempfehlungen – das sagt mehr als jede Werbung.
              </p>
              <p className="text-[#6B7A8D] leading-relaxed mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
                Wir beschäftigen ausschließlich festangestellte, geschulte Mitarbeiter. Keine Subunternehmer, keine Überraschungen. Jedes Team kennt seine Objekte – und unsere Kunden kennen ihr Team.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: `${companyConfig.metrics.yearsExperience}+`, label: "Jahre Erfahrung" },
                  { num: `${companyConfig.metrics.customers}+`, label: "Stammkunden" },
                  { num: `${companyConfig.metrics.staff}+`, label: "Mitarbeiter" },
                  { num: "100%", label: "Festangestellt" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#F7F8FA] rounded-lg p-4">
                    <div className="text-2xl font-bold text-[#0F2137]" style={{ fontFamily: "Syne, sans-serif" }}>
                      {stat.num}
                    </div>
                    <div className="text-[#6B7A8D] text-sm mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative pc-fade-up">
              <div className="overflow-hidden rounded-lg shadow-xl">
                <img
                  src={IMAGES.aboutTeam}
                  alt={`Das ${companyConfig.brand.name} Team`}
                  className="w-full h-96 lg:h-[500px] object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-[#1D6FA4] text-white rounded-lg p-5 shadow-xl">
                <div className="text-2xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>{companyConfig.metrics.customers}+</div>
                <div className="text-white/70 text-xs mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>Zufriedene Kunden</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="pc-section bg-[#F7F8FA]">
        <div className="container">
          <div className="max-w-xl mb-14 pc-fade-up">
            <span className="pc-accent-line" />
            <h2 className="pc-section-title">Unsere Werte</h2>
            <p className="pc-section-subtitle">
              Diese Grundsätze leiten unser Handeln – gegenüber Kunden, Mitarbeitern und der Gesellschaft.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div
                key={value.title}
                className="pc-card pc-fade-up"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <value.icon size={20} className="text-[#1D6FA4]" />
                </div>
                <h3 className="font-bold text-[#0F2137] mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                  {value.title}
                </h3>
                <p className="text-[#6B7A8D] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="pc-section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="pc-fade-up">
              <img
                src={IMAGES.heroOffice}
                alt="Professionelle Reinigung"
                className="w-full h-80 object-cover rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
            <div className="pc-fade-up">
              <span className="pc-accent-line" />
              <h2 className="pc-section-title mb-6">Unser Team</h2>
              <p className="text-[#6B7A8D] leading-relaxed mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                Unser Team besteht aus erfahrenen, geschulten Fachkräften, die ihren Beruf mit Sorgfalt und Engagement ausüben. Alle Mitarbeiter sind festangestellt, regelmäßig geschult und kennen die spezifischen Anforderungen ihrer Einsatzobjekte.
              </p>
              <p className="text-[#6B7A8D] leading-relaxed mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                Wir legen großen Wert auf Kontinuität: Ihre Objekte werden von festen Teams betreut. Das schafft Vertrauen, Effizienz und gleichbleibende Qualität.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  "Alle Mitarbeiter festangestellt",
                  "Regelmäßige Schulungen und Weiterbildungen",
                  "Zuverlässige Vertretungsregelungen",
                  "Diskret und vertrauenswürdig",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle size={15} className="text-[#1D6FA4] shrink-0" />
                    <span className="text-[#1A2332] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/kontakt">
                <span onClick={() => trackCtaClick({ cta_id: "about_team_contact", cta_text: "Kontakt aufnehmen", cta_location: "about_team_section", destination_url: "/kontakt" })} className="pc-btn-primary">
                  Kontakt aufnehmen
                  <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0F2137] py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
            Lernen Sie uns persönlich kennen
          </h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
            Wir kommen gerne zu Ihnen – für eine kostenlose Besichtigung und ein unverbindliches Angebot.
          </p>
          <Link href="/kontakt">
            <span onClick={() => trackCtaClick({ cta_id: "about_final_contact", cta_text: "Jetzt Kontakt aufnehmen", cta_location: "about_final_cta", destination_url: "/kontakt" })} className="pc-btn-primary">
              Jetzt Kontakt aufnehmen
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
