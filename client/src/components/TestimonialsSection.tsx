/*
 * ProClean Testimonials & Bewertungen
 * Trust-Building Element mit Kundenzitaten und Ratings
 */

import { Star, Users, Clock, Award } from "lucide-react";
import { companyConfig } from "@/config/company";

const testimonials = [
  {
    name: "Michael K.",
    company: "IT-Unternehmen",
    rating: 5,
    text: `Seit zwei Jahren arbeiten wir mit ${companyConfig.brand.name} zusammen. Das Team ist immer pünktlich, gründlich und diskret. Unsere Büroräume waren noch nie so sauber.`,
    initials: "MK",
  },
  {
    name: "Sandra M.",
    company: "Immobilienverwaltung",
    rating: 5,
    text: "Endlich ein Reinigungsunternehmen, das hält, was es verspricht. Feste Ansprechpartner, transparente Abrechnung und konstant hohe Qualität.",
    initials: "SM",
  },
  {
    name: "Thomas B.",
    company: "Arztpraxis",
    rating: 5,
    text: `Für unsere Praxis ist Hygiene keine Option, sondern Pflicht. ${companyConfig.brand.name} erfüllt unsere hohen Anforderungen zuverlässig und professionell.`,
    initials: "TB",
  },
];

const trustMetrics = [
  {
    icon: Users,
    number: `${companyConfig.metrics.customers}+`,
    label: "Zufriedene Kunden",
  },
  {
    icon: Clock,
    number: companyConfig.metrics.responseTime,
    label: "Reaktionszeit",
  },
  {
    icon: Award,
    number: `${companyConfig.metrics.yearsExperience}+`,
    label: "Jahre Erfahrung",
  },
  {
    icon: Star,
    number: companyConfig.metrics.googleRating,
    label: "Google-Bewertung",
  },
];

export function TrustMetrics() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {trustMetrics.map((metric) => (
        <div key={metric.label} className="bg-white rounded-xl p-5 shadow-[0_16px_36px_-28px_rgba(15,33,55,0.4)] border pc-border text-center">
          <metric.icon size={24} className="pc-text-brand mx-auto mb-2" />
          <div className="text-xl lg:text-2xl font-bold pc-text-primary" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            {metric.number}
          </div>
          <div className="text-xs lg:text-sm pc-text-secondary mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TestimonialsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <div key={testimonial.name} className="bg-white rounded-xl p-6 shadow-[0_16px_36px_-28px_rgba(15,33,55,0.4)] border pc-border hover:shadow-[0_18px_40px_-26px_rgba(15,33,55,0.5)] transition-shadow">
          {/* Stars */}
          <div className="flex gap-1 mb-4">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} size={16} className="fill-[#FFB800] text-[#FFB800]" />
            ))}
          </div>

          {/* Zitat */}
          <p className="pc-text-secondary text-sm leading-relaxed mb-4 italic" style={{ fontFamily: "Inter, sans-serif" }}>
            "{testimonial.text}"
          </p>

          {/* Autor */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full pc-bg-brand text-white flex items-center justify-center font-bold text-sm">
              {testimonial.initials}
            </div>
            <div>
              <div className="font-semibold pc-text-primary text-sm" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                {testimonial.name}
              </div>
              <div className="pc-text-secondary text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                {testimonial.company}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="pc-section pc-bg-section">
      <div className="container">
        {/* Trust Metrics */}
        <div className="mb-16">
          <div className="max-w-xl mb-8">
            <span className="pc-accent-line" />
            <h2 className="pc-section-title">Zahlen, die sprechen</h2>
            <p className="pc-section-subtitle">
              {companyConfig.brand.name} ist der vertrauenswürdige Partner für Unternehmen im Rhein-Main-Gebiet.
            </p>
          </div>
          <TrustMetrics />
        </div>

        {/* Testimonials */}
        <div>
          <div className="max-w-xl mb-8">
            <span className="pc-accent-line" />
            <h2 className="pc-section-title">Das sagen unsere Kunden</h2>
            <p className="pc-section-subtitle">
              Vertrauen entsteht durch Erfahrung – lesen Sie, was Unternehmen über die Zusammenarbeit mit uns berichten.
            </p>
          </div>
          <TestimonialsGrid />
        </div>
      </div>
    </section>
  );
}
