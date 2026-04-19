import { Link } from "wouter";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trackCtaClick, trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";
import { companyConfig } from "@/config/company";
import { fetchPublicCmsPage } from "@/lib/cms";
import { applyPageSeo, resolveSeoValue } from "@/lib/seo";
import { getDefaultCmsPageContent, normalizeCmsPageContent, type CmsAboutContent } from "@shared/cms";
import { ArrowRight, CheckCircle, Shield, Award, Users, Heart, Phone, MessageCircle, type LucideIcon } from "lucide-react";

const IMAGES = {
  aboutTeam: "https://d2xsxph8kpxj0f.cloudfront.net/310519663547187307/43Rukg9YxBYUx2aiERC352/about-team-TkNpxcp8EkwwruinupRxfN.webp",
  heroOffice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663547187307/43Rukg9YxBYUx2aiERC352/hero-office-VNZtTnE2YeTnTnK8cq3QYi.webp",
};

const VALUE_ICONS: LucideIcon[] = [Shield, Award, Users, Heart];

export default function UeberUns() {
  const [cmsContent, setCmsContent] = useState<CmsAboutContent>(() => getDefaultCmsPageContent("ueber-uns"));
  const resolvedCmsContent = normalizeCmsPageContent("ueber-uns", cmsContent);

  const valueItems = [
    { title: resolvedCmsContent.values.value1Title, desc: resolvedCmsContent.values.value1Desc },
    { title: resolvedCmsContent.values.value2Title, desc: resolvedCmsContent.values.value2Desc },
    { title: resolvedCmsContent.values.value3Title, desc: resolvedCmsContent.values.value3Desc },
    { title: resolvedCmsContent.values.value4Title, desc: resolvedCmsContent.values.value4Desc },
  ];

  const storyStats = [
    { num: `${companyConfig.metrics.yearsExperience}+`, label: resolvedCmsContent.companyInfo.statsYearsLabel },
    { num: `${companyConfig.metrics.customers}+`, label: resolvedCmsContent.companyInfo.statsCustomersLabel },
    { num: `${companyConfig.metrics.staff}+`, label: resolvedCmsContent.companyInfo.statsStaffLabel },
    { num: "100%", label: resolvedCmsContent.companyInfo.statsEmployeesLabel },
  ];

  const teamBullets = [
    resolvedCmsContent.team.bullet1,
    resolvedCmsContent.team.bullet2,
    resolvedCmsContent.team.bullet3,
    resolvedCmsContent.team.bullet4,
  ];

  const storyImageUrl = resolvedCmsContent.companyInfo.teamImageUrl || IMAGES.aboutTeam;
  const storyImageAlt = resolvedCmsContent.companyInfo.teamImageAlt || `Das ${companyConfig.brand.name} Team`;
  const teamImageUrl = resolvedCmsContent.team.imageUrl || IMAGES.heroOffice;
  const teamImageAlt = resolvedCmsContent.team.imageAlt || "Professionelle Reinigung";

  useEffect(() => {
    let active = true;

    void fetchPublicCmsPage("ueber-uns")
      .then((page) => {
        if (page && active) {
          setCmsContent(normalizeCmsPageContent("ueber-uns", page.content));
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    applyPageSeo({
      title: resolveSeoValue(resolvedCmsContent.seo.seoTitle, companyConfig.seo.title),
      description: resolveSeoValue(resolvedCmsContent.seo.seoDescription, companyConfig.seo.description),
    });
  }, [
    resolvedCmsContent.seo.seoDescription,
    resolvedCmsContent.seo.seoTitle,
  ]);

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
    <div className="min-h-screen pc-bg-section">
      <Navigation />

      <section className="pc-page-hero">
        <div className="container">
          <div className="max-w-2xl">
            <span className="block w-12 h-0.5 pc-bg-accent mb-6" />
            <h1 className="text-4xl lg:text-5xl font-bold pc-text-primary mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              {resolvedCmsContent.hero.title}
            </h1>
            <p className="pc-text-secondary text-lg leading-relaxed mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
              {resolvedCmsContent.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/kontakt">
                <span onClick={() => trackCtaClick({ cta_id: "about_hero_contact", cta_text: resolvedCmsContent.hero.buttonText, cta_location: "about_hero", destination_url: "/kontakt" })} className="pc-btn-primary">
                  {resolvedCmsContent.hero.buttonText}
                  <ArrowRight size={16} />
                </span>
              </Link>
              <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("about_hero")} className="pc-btn-white">
                <Phone size={16} />
                Jetzt anrufen
              </a>
              <a
                href={companyConfig.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("about_hero")}
                className="pc-btn-whatsapp"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
            <p className="mt-4 text-sm pc-text-secondary" style={{ fontFamily: "Inter, sans-serif" }}>
              Direkter Kontakt ohne Umwege. Rückmeldung in der Regel innerhalb von {companyConfig.metrics.responseTime}.
            </p>
          </div>
        </div>
      </section>

      <section className="pc-section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="pc-fade-up">
              <span className="pc-accent-line" />
              <h2 className="pc-section-title mb-6">{resolvedCmsContent.companyInfo.title}</h2>
              <p className="pc-text-secondary leading-relaxed mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.companyInfo.storyParagraph1}
              </p>
              <p className="pc-text-secondary leading-relaxed mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.companyInfo.storyParagraph2}
              </p>
              <p className="pc-text-secondary leading-relaxed mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.companyInfo.storyParagraph3}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {storyStats.map((stat) => (
                  <div key={stat.label} className="pc-bg-section rounded-lg p-4">
                    <div className="text-2xl font-bold pc-text-primary" style={{ fontFamily: "Inter, sans-serif" }}>
                      {stat.num}
                    </div>
                    <div className="pc-text-secondary text-sm mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative pc-fade-up">
              <div className="overflow-hidden rounded-lg shadow-xl">
                <img src={storyImageUrl} alt={storyImageAlt} className="w-full h-96 lg:h-[500px] object-cover" loading="lazy" />
              </div>
              <div className="absolute -top-4 -right-4 pc-bg-accent pc-text-primary rounded-xl p-5 shadow-xl">
                <div className="text-2xl font-bold" style={{ fontFamily: "Inter, sans-serif" }}>{companyConfig.metrics.customers}+</div>
                <div className="pc-text-brand text-xs mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                  {resolvedCmsContent.companyInfo.teamBadgeLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pc-section pc-bg-section">
        <div className="container">
          <div className="max-w-xl mb-14 pc-fade-up">
            <span className="pc-accent-line" />
            <h2 className="pc-section-title">{resolvedCmsContent.values.title}</h2>
            <p className="pc-section-subtitle">{resolvedCmsContent.values.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueItems.map((value, i) => {
              const Icon = VALUE_ICONS[i] ?? Shield;
              return (
                <div key={value.title} className="pc-card pc-fade-up" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="w-11 h-11 pc-bg-soft rounded-lg flex items-center justify-center mb-4">
                    <Icon size={20} className="pc-text-brand" />
                  </div>
                  <h3 className="font-bold pc-text-primary mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                    {value.title}
                  </h3>
                  <p className="pc-text-secondary text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pc-section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="pc-fade-up">
              <img src={teamImageUrl} alt={teamImageAlt} className="w-full h-80 object-cover rounded-lg shadow-lg" loading="lazy" />
            </div>
            <div className="pc-fade-up">
              <span className="pc-accent-line" />
              <h2 className="pc-section-title mb-6">{resolvedCmsContent.team.title}</h2>
              <p className="pc-text-secondary leading-relaxed mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.team.paragraph1}
              </p>
              <p className="pc-text-secondary leading-relaxed mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                {resolvedCmsContent.team.paragraph2}
              </p>
              <ul className="space-y-2.5 mb-8">
                {teamBullets.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle size={15} className="pc-text-brand shrink-0" />
                    <span className="pc-text-primary text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/kontakt">
                <span onClick={() => trackCtaClick({ cta_id: "about_team_contact", cta_text: resolvedCmsContent.team.buttonText, cta_location: "about_team_section", destination_url: "/kontakt" })} className="pc-btn-primary">
                  {resolvedCmsContent.team.buttonText}
                  <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pc-bg-soft py-16 border-y pc-border">
        <div className="container text-center">
          <h2 className="text-3xl font-bold pc-text-primary mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
            {resolvedCmsContent.finalCta.title}
          </h2>
          <p className="pc-text-secondary mb-8 max-w-lg mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
            {resolvedCmsContent.finalCta.body}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/kontakt">
              <span onClick={() => trackCtaClick({ cta_id: "about_final_contact", cta_text: resolvedCmsContent.finalCta.primaryButtonText, cta_location: "about_final_cta", destination_url: "/kontakt" })} className="pc-btn-primary">
                {resolvedCmsContent.finalCta.primaryButtonText}
                <ArrowRight size={16} />
              </span>
            </Link>
            <a href={companyConfig.contact.phoneHref} onClick={() => trackPhoneClick("about_final_cta")} className="pc-btn-white">
              <Phone size={16} />
              {companyConfig.contact.phoneDisplay}
            </a>
            <a
              href={companyConfig.contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("about_final_cta")}
              className="pc-btn-whatsapp"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
