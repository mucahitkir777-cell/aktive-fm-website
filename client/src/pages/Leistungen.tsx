/*
 * ProClean Leistungen-Seite
 * Design: Architektonischer Minimalismus
 */

import { Link } from "wouter";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trackCtaClick, trackPhoneClick, trackServiceInterest } from "@/lib/analytics";
import { companyConfig } from "@/config/company";
import {
  ArrowRight,
  CheckCircle,
  Phone,
  Building2,
  Sparkles,
  Wind,
  Layers,
  Wrench,
  Home as HomeIcon,
} from "lucide-react";

const IMAGES = {
  serviceGlass: "https://d2xsxph8kpxj0f.cloudfront.net/310519663547187307/43Rukg9YxBYUx2aiERC352/service-glass-RSr9dJatK4isuPRMPxyn8n.webp",
  serviceOffice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663547187307/43Rukg9YxBYUx2aiERC352/service-office-YPatmHc5sFH6C2yr9bLqK8.webp",
  heroOffice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663547187307/43Rukg9YxBYUx2aiERC352/hero-office-VNZtTnE2YeTnTnK8cq3QYi.webp",
};

const services = [
  {
    icon: Building2,
    title: "Büroreinigung",
    slug: "buero",
    shortDesc: "Regelmäßige, diskrete Reinigung Ihrer Büroflächen.",
    fullDesc: "Unsere Büroreinigung sorgt dafür, dass Ihre Mitarbeiter und Besucher täglich eine saubere, gepflegte Arbeitsumgebung vorfinden. Wir reinigen Schreibtische, Böden, Sanitäranlagen, Küchen und Gemeinschaftsflächen – nach einem festen Reinigungsplan und mit geschultem Personal.",
    features: [
      "Tägliche oder wöchentliche Reinigung nach Wunsch",
      "Reinigung außerhalb der Geschäftszeiten möglich",
      "Festes Reinigungsteam für Ihr Objekt",
      "Umweltfreundliche Reinigungsmittel",
      "Regelmäßige Qualitätskontrollen",
    ],
    image: IMAGES.heroOffice,
  },
  {
    icon: Sparkles,
    title: "Unterhaltsreinigung",
    slug: "unterhalts",
    shortDesc: "Kontinuierliche Pflege nach festem Reinigungsplan.",
    fullDesc: "Die Unterhaltsreinigung ist das Herzstück unserer Dienstleistungen. Wir übernehmen die regelmäßige, systematische Reinigung Ihrer Immobilie – damit Sauberkeit kein Zufall ist, sondern Programm. Ob täglich, wöchentlich oder nach individuellem Rhythmus.",
    features: [
      "Individuelle Reinigungsintervalle",
      "Dokumentierte Reinigungsprotokolle",
      "Zuverlässige Vertretungsregelungen",
      "Transparente Abrechnung",
      "Direkter Ansprechpartner",
    ],
    image: IMAGES.serviceOffice,
  },
  {
    icon: Wind,
    title: "Glasreinigung",
    slug: "glas",
    shortDesc: "Streifenfreie Reinigung von Fenstern und Glasfassaden.",
    fullDesc: "Saubere Glasflächen sind das Aushängeschild Ihres Unternehmens. Wir reinigen Fenster, Glastrennwände, Glasfassaden und Schaufenster – innen und außen, streifenfrei und professionell. Auch Hochhaus-Fassaden und schwer zugängliche Bereiche.",
    features: [
      "Innen- und Außenreinigung",
      "Glasfassaden und Hochhäuser",
      "Schaufenster und Schaufronten",
      "Glastrennwände und Innenverglasung",
      "Zertifizierte Höhenarbeiter",
    ],
    image: IMAGES.serviceGlass,
  },
  {
    icon: Layers,
    title: "Treppenhaus & Außenanlagen",
    slug: "treppenhaus",
    shortDesc: "Pflege von Treppenhäusern, Eingängen und Außenbereichen.",
    fullDesc: "Der erste Eindruck zählt. Wir sorgen dafür, dass Treppenhäuser, Eingangsbereiche, Aufzüge und Außenanlagen Ihres Objekts stets gepflegt und einladend wirken. Regelmäßige Reinigung nach Plan – zuverlässig und gründlich.",
    features: [
      "Treppenhäuser und Flure",
      "Eingangsbereiche und Foyers",
      "Aufzüge und Aufzugskabinen",
      "Außenanlagen und Parkplätze",
      "Müllbereiche und Technikräume",
    ],
    image: IMAGES.heroOffice,
  },
  {
    icon: Wrench,
    title: "Grundreinigung",
    slug: "grund",
    shortDesc: "Intensive Tiefenreinigung für besonders beanspruchte Bereiche.",
    fullDesc: "Wenn normale Unterhaltsreinigung nicht ausreicht, kommt unsere Grundreinigung zum Einsatz. Wir reinigen intensiv und gründlich – Böden, Wände, Einrichtungen und schwer zugängliche Bereiche. Ideal nach Umzügen, Renovierungen oder als saisonale Tiefenreinigung.",
    features: [
      "Intensive Bodenreinigung und -pflege",
      "Maschinelle Reinigungsverfahren",
      "Entfernung hartnäckiger Verschmutzungen",
      "Nach Umzug oder Renovierung",
      "Saisonale Tiefenreinigung",
    ],
    image: IMAGES.serviceOffice,
  },
  {
    icon: HomeIcon,
    title: "Sonderreinigung",
    slug: "sonder",
    shortDesc: "Maßgeschneiderte Lösungen für besondere Anforderungen.",
    fullDesc: "Nicht jede Reinigungsaufgabe ist Standard. Für spezielle Anforderungen bieten wir individuelle Sonderreinigungen an – von der Baureinigung über Veranstaltungsreinigung bis hin zu hygienekritischen Bereichen in Praxen und Labors.",
    features: [
      "Baureinigung nach Renovierung",
      "Veranstaltungsreinigung",
      "Hygienekritische Bereiche",
      "Desinfektionsreinigung",
      "Individuelle Konzepte auf Anfrage",
    ],
    image: IMAGES.serviceGlass,
  },
];

export default function Leistungen() {
  const handleServiceCtaClick = (ctaId: string, ctaText: string, ctaLocation: string, destinationUrl: string, serviceTitle?: string, serviceId?: string) => {
    if (serviceTitle) {
      trackServiceInterest(serviceTitle, {
        service_id: serviceId,
        cta_location: ctaLocation,
        destination_url: destinationUrl,
      });
    }

    trackCtaClick({
      cta_id: ctaId,
      cta_text: ctaText,
      cta_location: ctaLocation,
      destination_url: destinationUrl,
      service_type: serviceTitle,
      service_id: serviceId,
    });
  };

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
              Unsere Leistungen
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
              Das vollständige Spektrum professioneller Gebäudereinigung – maßgeschneidert für Ihr Objekt und Ihre Anforderungen.
            </p>

            {/* Hero CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("services_hero")} className="pc-btn-primary">
                <Phone size={16} />
                {companyConfig.contact.phoneDisplay}
              </a>
              <Link href="/kontakt">
                <span onClick={() => handleServiceCtaClick("services_hero_offer", "Angebot anfragen", "services_hero", "/kontakt")} className="pc-btn-white">
                  Angebot anfragen
                  <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="pc-section">
        <div className="container">
          <div className="space-y-16 lg:space-y-24">
            {services.map((service, i) => (
              <div
                key={service.slug}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center pc-fade-up`}
              >
                {/* Image */}
                <div className={`relative ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-72 lg:h-96 object-cover hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute -bottom-3 -left-3 bg-[#1D6FA4] text-white rounded-lg p-4 shadow-lg">
                    <service.icon size={22} />
                  </div>
                </div>

                {/* Content */}
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#0F2137] mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
                    {service.title}
                  </h2>
                  <p className="text-[#6B7A8D] leading-relaxed mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                    {service.fullDesc}
                  </p>

                  <ul className="space-y-2.5 mb-7">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <CheckCircle size={16} className="text-[#1D6FA4] mt-0.5 shrink-0" />
                        <span className="text-[#1A2332] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/kontakt">
                      <span onClick={() => handleServiceCtaClick(`service_${service.slug}_offer`, "Angebot anfragen", "services_detail", "/kontakt", service.title, service.slug)} className="pc-btn-primary">
                        Angebot anfragen
                        <ArrowRight size={16} />
                      </span>
                    </Link>
                    <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("services_detail", { service_type: service.title, service_id: service.slug })} className="pc-btn-outline">
                      <Phone size={16} />
                      Anrufen
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Lead-Maschine */}
      <section className="bg-[#0F2137] py-16 lg:py-20">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
            Bereit für professionelle Reinigung?
          </h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto text-lg" style={{ fontFamily: "Inter, sans-serif" }}>
            Fordern Sie jetzt Ihr kostenloses Angebot an. Wir melden uns innerhalb von 24 Stunden.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/kontakt">
              <span onClick={() => handleServiceCtaClick("services_final_offer", "Kostenloses Angebot", "services_final_cta", "/kontakt")} className="pc-btn-primary text-lg">
                Kostenloses Angebot
                <ArrowRight size={16} />
              </span>
            </Link>
            <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("services_final_cta")} className="pc-btn-white text-lg">
              <Phone size={16} />
              Jetzt anrufen
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
