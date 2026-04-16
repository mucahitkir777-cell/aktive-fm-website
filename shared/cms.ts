import { z } from "zod";

export const cmsPageSlugs = ["global", "home", "leistungen", "ueber-uns", "faq", "kontakt"] as const;
export const cmsPageSlugSchema = z.enum(cmsPageSlugs);
export type CmsPageSlug = (typeof cmsPageSlugs)[number];

const pageTitleSchema = z.string().trim().min(1, "Der Titel ist erforderlich.").max(120, "Der Titel ist zu lang.");
const pageSubtitleSchema = z.string().trim().min(1, "Die Beschreibung ist erforderlich.").max(500, "Die Beschreibung ist zu lang.");
const pageButtonSchema = z.string().trim().min(1, "Der Button-Text ist erforderlich.").max(60, "Der Button-Text ist zu lang.");

const heroBaseSchema = z.object({
  title: pageTitleSchema,
  subtitle: pageSubtitleSchema,
  buttonText: pageButtonSchema.default("Mehr erfahren"),
});

const heroWithAccentSchema = z.object({
  title: pageTitleSchema,
  accentTitle: pageTitleSchema,
  subtitle: pageSubtitleSchema,
  primaryButtonText: pageButtonSchema.default("Kostenloses Angebot"),
});

const finalCtaSchema = z.object({
  title: pageTitleSchema,
  body: pageSubtitleSchema,
  primaryButtonText: pageButtonSchema.default("Jetzt anfragen"),
  seoTitle: z.string().trim().max(120, "Der SEO-Titel ist zu lang.").default(""),
  seoDescription: z.string().trim().max(500, "Die SEO-Beschreibung ist zu lang.").default(""),
});

export const cmsHomeContentSchema = z.object({
  hero: heroWithAccentSchema,
  services: z
    .object({
      title: pageTitleSchema.default("Unsere Leistungen"),
      subtitle: pageSubtitleSchema.default(
        "Von der täglichen Büroreinigung bis zur Glasfassade – wir bieten das vollständige Spektrum professioneller Gebäudereinigung."
      ),
      buttonText: pageButtonSchema.default("Alle Leistungen ansehen"),
    })
    .default({
      title: "Unsere Leistungen",
      subtitle: "Von der täglichen Büroreinigung bis zur Glasfassade – wir bieten das vollständige Spektrum professioneller Gebäudereinigung.",
      buttonText: "Alle Leistungen ansehen",
    }),
  usps: z
    .object({
      title: pageTitleSchema.default("Warum Unternehmen uns vertrauen"),
      subtitle: pageSubtitleSchema.default(
        "Wir sind kein anonymer Großbetrieb. Als mittelständisches Reinigungsunternehmen kennen wir unsere Kunden persönlich und arbeiten mit festen Teams – für gleichbleibende Qualität und echtes Vertrauen."
      ),
    })
    .default({
      title: "Warum Unternehmen uns vertrauen",
      subtitle:
        "Wir sind kein anonymer Großbetrieb. Als mittelständisches Reinigungsunternehmen kennen wir unsere Kunden persönlich und arbeiten mit festen Teams – für gleichbleibende Qualität und echtes Vertrauen.",
    }),
  finalCta: finalCtaSchema,
});

export type CmsHomeContent = z.infer<typeof cmsHomeContentSchema>;

export const cmsServicesContentSchema = z.object({
  hero: heroBaseSchema,
  overview: z
    .object({
      title: pageTitleSchema.default("Leistungsübersicht"),
      subtitle: pageSubtitleSchema.default(
        "Ein Überblick über unser Leistungsspektrum: von täglicher Büroreinigung bis zur Glas- und Sonderreinigung."
      ),
    })
    .default({
      title: "Leistungsübersicht",
      subtitle: "Ein Überblick über unser Leistungsspektrum: von täglicher Büroreinigung bis zur Glas- und Sonderreinigung.",
    }),
  benefits: z
    .object({
      title: pageTitleSchema.default("Ihre Vorteile"),
      subtitle: pageSubtitleSchema.default(
        "Wir arbeiten mit festen Teams, transparenter Abrechnung und hoher Zuverlässigkeit – genau das, was Unternehmen erwarten."
      ),
    })
    .default({
      title: "Ihre Vorteile",
      subtitle:
        "Wir arbeiten mit festen Teams, transparenter Abrechnung und hoher Zuverlässigkeit – genau das, was Unternehmen erwarten.",
    }),
  finalCta: finalCtaSchema,
});

export type CmsServicesContent = z.infer<typeof cmsServicesContentSchema>;

export const cmsAboutContentSchema = z.object({
  hero: heroBaseSchema,
  companyInfo: z
    .object({
      title: pageTitleSchema.default("Über uns"),
      body: pageSubtitleSchema.default(
        "Wir sind ein regionales Reinigungsunternehmen mit Fokus auf individuelle Betreuung, festen Teams und nachhaltiger Qualität."
      ),
    })
    .default({
      title: "Über uns",
      body: "Wir sind ein regionales Reinigungsunternehmen mit Fokus auf individuelle Betreuung, festen Teams und nachhaltiger Qualität.",
    }),
  values: z
    .object({
      title: pageTitleSchema.default("Werte & Vorteile"),
      subtitle: pageSubtitleSchema.default(
        "Vertrauen, Verlässlichkeit und Transparenz sind die Basis unserer Arbeit – für zufriedene Kunden im Rhein-Main-Gebiet."
      ),
    })
    .default({
      title: "Werte & Vorteile",
      subtitle:
        "Vertrauen, Verlässlichkeit und Transparenz sind die Basis unserer Arbeit – für zufriedene Kunden im Rhein-Main-Gebiet.",
    }),
  finalCta: finalCtaSchema,
});

export type CmsAboutContent = z.infer<typeof cmsAboutContentSchema>;

export const cmsFaqContentSchema = z.object({
  hero: heroBaseSchema,
  questions: z
    .object({
      title: pageTitleSchema.default("Häufige Fragen"),
      subtitle: pageSubtitleSchema.default("Hier finden Sie Antworten auf die wichtigsten Fragen rund um unsere Reinigungsleistungen."),
      faqText: z.string().trim().max(2000, "Der FAQ-Inhalt ist zu lang.").default(
        "Was kostet die Reinigung?\nWelchen Service bieten Sie an?\nWie schnell erhalten wir ein Angebot?"
      ),
    })
    .default({
      title: "Häufige Fragen",
      subtitle: "Hier finden Sie Antworten auf die wichtigsten Fragen rund um unsere Reinigungsleistungen.",
      faqText: "Was kostet die Reinigung?\nWelchen Service bieten Sie an?\nWie schnell erhalten wir ein Angebot?",
    }),
  finalCta: finalCtaSchema,
});

export type CmsFaqContent = z.infer<typeof cmsFaqContentSchema>;

export const cmsContactContentSchema = z.object({
  hero: heroBaseSchema,
  contactInfo: z
    .object({
      title: pageTitleSchema.default("Kontaktinformationen"),
      subtitle: pageSubtitleSchema.default(
        "Nutzen Sie unsere Kontaktmöglichkeiten für schnelle Rückmeldung und individuelle Beratung."
      ),
    })
    .default({
      title: "Kontaktinformationen",
      subtitle: "Nutzen Sie unsere Kontaktmöglichkeiten für schnelle Rückmeldung und individuelle Beratung.",
    }),
  formSection: z
    .object({
      title: pageTitleSchema.default("Anfrage senden"),
      subtitle: pageSubtitleSchema.default("Senden Sie uns Ihre Anfrage und wir melden uns innerhalb von 24 Stunden.") ,
      buttonText: pageButtonSchema.default("Nachricht senden"),
    })
    .default({
      title: "Anfrage senden",
      subtitle: "Senden Sie uns Ihre Anfrage und wir melden uns innerhalb von 24 Stunden.",
      buttonText: "Nachricht senden",
    }),
});

export type CmsContactContent = z.infer<typeof cmsContactContentSchema>;

const pathFieldSchema = z.string().trim().min(1, "Der Pfad ist erforderlich.").max(200, "Der Pfad ist zu lang.");
const multilineTextSchema = z.string().trim().min(1, "Das Feld ist erforderlich.").max(2000, "Das Feld ist zu lang.");

export const cmsGlobalContentSchema = z.object({
  navigation: z.object({
    homeLabel: pageTitleSchema.default("Startseite"),
    homeHref: pathFieldSchema.default("/"),
    servicesLabel: pageTitleSchema.default("Leistungen"),
    servicesHref: pathFieldSchema.default("/leistungen"),
    aboutLabel: pageTitleSchema.default("Ueber uns"),
    aboutHref: pathFieldSchema.default("/ueber-uns"),
    faqLabel: pageTitleSchema.default("FAQ"),
    faqHref: pathFieldSchema.default("/faq"),
    contactLabel: pageTitleSchema.default("Kontakt"),
    contactHref: pathFieldSchema.default("/kontakt"),
    ctaLabel: pageButtonSchema.default("Angebot anfragen"),
    ctaHref: pathFieldSchema.default("/kontakt"),
  }),
  footer: z.object({
    footerText: pageSubtitleSchema.default(
      "Ihr zuverlaessiger Partner fuer professionelle Gebaeudereinigung im Rhein-Main-Gebiet. Qualitaet, die man sieht."
    ),
    membershipLabel: z.string().trim().min(1, "Die Mitgliedschaft ist erforderlich.").max(120, "Die Mitgliedschaft ist zu lang.").default("BIV Bundesinnungsverband"),
  }),
  footerContact: z.object({
    phoneLabel: pageTitleSchema.default("Telefon"),
    phoneDisplay: z.string().trim().min(1, "Die Telefonnummer ist erforderlich.").max(80, "Die Telefonnummer ist zu lang.").default("0800 000 000"),
    phoneHref: z.string().trim().min(1, "Der Telefon-Link ist erforderlich.").max(200, "Der Telefon-Link ist zu lang.").default("tel:+4900000000000"),
    phoneMeta: z.string().trim().min(1, "Die Zusatzinfo ist erforderlich.").max(120, "Die Zusatzinfo ist zu lang.").default("Mo-Fr 7:00-18:00 Uhr"),
    emailLabel: pageTitleSchema.default("E-Mail"),
    emailDisplay: z.string().trim().min(1, "Die E-Mail ist erforderlich.").max(120, "Die E-Mail ist zu lang.").default("info@proclean-gmbh.de"),
    emailHref: z.string().trim().min(1, "Der E-Mail-Link ist erforderlich.").max(200, "Der E-Mail-Link ist zu lang.").default("mailto:info@proclean-gmbh.de"),
    addressLabel: pageTitleSchema.default("Adresse"),
    addressLines: multilineTextSchema.default("Musterstrasse 1\n12345 Musterstadt"),
    hoursLabel: pageTitleSchema.default("Oeffnungszeiten"),
    hoursLines: multilineTextSchema.default("Mo-Fr: 07:00-18:00\nSa: 08:00-14:00"),
  }),
  legal: z.object({
    impressumLabel: pageTitleSchema.default("Impressum"),
    impressumHref: pathFieldSchema.default("/impressum"),
    datenschutzLabel: pageTitleSchema.default("Datenschutz"),
    datenschutzHref: pathFieldSchema.default("/datenschutz"),
  }),
});

export type CmsGlobalContent = z.infer<typeof cmsGlobalContentSchema>;

export const cmsPageSchemas = {
  global: cmsGlobalContentSchema,
  home: cmsHomeContentSchema,
  leistungen: cmsServicesContentSchema,
  "ueber-uns": cmsAboutContentSchema,
  faq: cmsFaqContentSchema,
  kontakt: cmsContactContentSchema,
} as const;

export interface CmsFieldDefinition {
  key: string;
  label: string;
  input: "text" | "textarea";
  rows?: number;
}

export interface CmsSectionDefinition {
  key: string;
  label: string;
  fields: CmsFieldDefinition[];
}

export const cmsPageDefinitions = {
  global: {
    title: "Globale Inhalte",
    path: "/",
    sections: [
      {
        key: "navigation",
        label: "Navigation",
        fields: [
          { key: "homeLabel", label: "Startseite Label", input: "text" },
          { key: "homeHref", label: "Startseite Pfad", input: "text" },
          { key: "servicesLabel", label: "Leistungen Label", input: "text" },
          { key: "servicesHref", label: "Leistungen Pfad", input: "text" },
          { key: "aboutLabel", label: "Ueber uns Label", input: "text" },
          { key: "aboutHref", label: "Ueber uns Pfad", input: "text" },
          { key: "faqLabel", label: "FAQ Label", input: "text" },
          { key: "faqHref", label: "FAQ Pfad", input: "text" },
          { key: "contactLabel", label: "Kontakt Label", input: "text" },
          { key: "contactHref", label: "Kontakt Pfad", input: "text" },
          { key: "ctaLabel", label: "CTA Label", input: "text" },
          { key: "ctaHref", label: "CTA Pfad", input: "text" },
        ],
      },
      {
        key: "footer",
        label: "Footer",
        fields: [
          { key: "footerText", label: "Footer-Text", input: "textarea", rows: 4 },
          { key: "membershipLabel", label: "Mitgliedschaft", input: "text" },
        ],
      },
      {
        key: "footerContact",
        label: "Footer Kontakt",
        fields: [
          { key: "phoneLabel", label: "Telefon Label", input: "text" },
          { key: "phoneDisplay", label: "Telefon Anzeige", input: "text" },
          { key: "phoneHref", label: "Telefon Link", input: "text" },
          { key: "phoneMeta", label: "Telefon Zusatzinfo", input: "text" },
          { key: "emailLabel", label: "E-Mail Label", input: "text" },
          { key: "emailDisplay", label: "E-Mail Anzeige", input: "text" },
          { key: "emailHref", label: "E-Mail Link", input: "text" },
          { key: "addressLabel", label: "Adresse Label", input: "text" },
          { key: "addressLines", label: "Adresse Zeilen", input: "textarea", rows: 3 },
          { key: "hoursLabel", label: "Oeffnungszeiten Label", input: "text" },
          { key: "hoursLines", label: "Oeffnungszeiten Zeilen", input: "textarea", rows: 3 },
        ],
      },
      {
        key: "legal",
        label: "Rechtliches",
        fields: [
          { key: "impressumLabel", label: "Impressum Label", input: "text" },
          { key: "impressumHref", label: "Impressum Pfad", input: "text" },
          { key: "datenschutzLabel", label: "Datenschutz Label", input: "text" },
          { key: "datenschutzHref", label: "Datenschutz Pfad", input: "text" },
        ],
      },
    ],
  },
  home: {
    title: "Startseite",
    path: "/",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: [
          { key: "title", label: "Hero-Titel", input: "text" },
          { key: "accentTitle", label: "Hero-Akzenttitel", input: "text" },
          { key: "subtitle", label: "Hero-Untertitel", input: "textarea", rows: 4 },
          { key: "primaryButtonText", label: "Hero-Button-Text", input: "text" },
        ],
      },
      {
        key: "services",
        label: "Leistungen",
        fields: [
          { key: "title", label: "Bereichstitel", input: "text" },
          { key: "subtitle", label: "Bereichsbeschreibung", input: "textarea", rows: 4 },
          { key: "buttonText", label: "Button-Text", input: "text" },
        ],
      },
      {
        key: "usps",
        label: "USPs",
        fields: [
          { key: "title", label: "Bereichstitel", input: "text" },
          { key: "subtitle", label: "Bereichsbeschreibung", input: "textarea", rows: 4 },
        ],
      },
      {
        key: "finalCta",
        label: "Kontaktbereich",
        fields: [
          { key: "title", label: "CTA-Titel", input: "text" },
          { key: "body", label: "CTA-Text", input: "textarea", rows: 4 },
          { key: "primaryButtonText", label: "CTA-Button-Text", input: "text" },
          { key: "seoTitle", label: "SEO-Titel", input: "text" },
          { key: "seoDescription", label: "SEO-Beschreibung", input: "textarea", rows: 4 },
        ],
      },
    ],
  },
  leistungen: {
    title: "Leistungen",
    path: "/leistungen",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: [
          { key: "title", label: "Hero-Titel", input: "text" },
          { key: "subtitle", label: "Hero-Untertitel", input: "textarea", rows: 4 },
          { key: "buttonText", label: "Hero-Button-Text", input: "text" },
        ],
      },
      {
        key: "overview",
        label: "Leistungsübersicht",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "subtitle", label: "Beschreibung", input: "textarea", rows: 4 },
        ],
      },
      {
        key: "benefits",
        label: "Vorteile",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "subtitle", label: "Beschreibung", input: "textarea", rows: 4 },
        ],
      },
      {
        key: "finalCta",
        label: "Kontaktbereich",
        fields: [
          { key: "title", label: "CTA-Titel", input: "text" },
          { key: "body", label: "CTA-Text", input: "textarea", rows: 4 },
          { key: "primaryButtonText", label: "CTA-Button-Text", input: "text" },
          { key: "seoTitle", label: "SEO-Titel", input: "text" },
          { key: "seoDescription", label: "SEO-Beschreibung", input: "textarea", rows: 4 },
        ],
      },
    ],
  },
  "ueber-uns": {
    title: "Über uns",
    path: "/ueber-uns",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: [
          { key: "title", label: "Hero-Titel", input: "text" },
          { key: "subtitle", label: "Hero-Untertitel", input: "textarea", rows: 4 },
          { key: "buttonText", label: "Hero-Button-Text", input: "text" },
        ],
      },
      {
        key: "companyInfo",
        label: "Unternehmensinfo",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "body", label: "Text", input: "textarea", rows: 5 },
        ],
      },
      {
        key: "values",
        label: "Werte / Vorteile",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "subtitle", label: "Beschreibung", input: "textarea", rows: 4 },
        ],
      },
      {
        key: "finalCta",
        label: "Kontaktbereich",
        fields: [
          { key: "title", label: "CTA-Titel", input: "text" },
          { key: "body", label: "CTA-Text", input: "textarea", rows: 4 },
          { key: "primaryButtonText", label: "CTA-Button-Text", input: "text" },
          { key: "seoTitle", label: "SEO-Titel", input: "text" },
          { key: "seoDescription", label: "SEO-Beschreibung", input: "textarea", rows: 4 },
        ],
      },
    ],
  },
  faq: {
    title: "FAQ",
    path: "/faq",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: [
          { key: "title", label: "Hero-Titel", input: "text" },
          { key: "subtitle", label: "Hero-Untertitel", input: "textarea", rows: 4 },
          { key: "buttonText", label: "Hero-Button-Text", input: "text" },
        ],
      },
      {
        key: "questions",
        label: "Fragenbereich",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "subtitle", label: "Beschreibung", input: "textarea", rows: 4 },
          { key: "faqText", label: "FAQ-Inhalt", input: "textarea", rows: 6 },
        ],
      },
      {
        key: "finalCta",
        label: "Kontaktbereich",
        fields: [
          { key: "title", label: "CTA-Titel", input: "text" },
          { key: "body", label: "CTA-Text", input: "textarea", rows: 4 },
          { key: "primaryButtonText", label: "CTA-Button-Text", input: "text" },
          { key: "seoTitle", label: "SEO-Titel", input: "text" },
          { key: "seoDescription", label: "SEO-Beschreibung", input: "textarea", rows: 4 },
        ],
      },
    ],
  },
  kontakt: {
    title: "Kontakt",
    path: "/kontakt",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: [
          { key: "title", label: "Hero-Titel", input: "text" },
          { key: "subtitle", label: "Hero-Untertitel", input: "textarea", rows: 4 },
          { key: "buttonText", label: "Hero-Button-Text", input: "text" },
        ],
      },
      {
        key: "contactInfo",
        label: "Kontaktinfos",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "subtitle", label: "Beschreibung", input: "textarea", rows: 4 },
        ],
      },
      {
        key: "formSection",
        label: "Formularbereich",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "subtitle", label: "Untertitel", input: "textarea", rows: 4 },
          { key: "buttonText", label: "Button-Text", input: "text" },
        ],
      },
    ],
  },
} as const satisfies Record<
  CmsPageSlug,
  {
    title: string;
    path: string;
    sections: readonly CmsSectionDefinition[];
  }
>;

export interface CmsPageContentMap {
  global: CmsGlobalContent;
  home: CmsHomeContent;
  leistungen: CmsServicesContent;
  "ueber-uns": CmsAboutContent;
  faq: CmsFaqContent;
  kontakt: CmsContactContent;
}

export const defaultCmsPageContent: CmsPageContentMap = {
  global: {
    navigation: {
      homeLabel: "Startseite",
      homeHref: "/",
      servicesLabel: "Leistungen",
      servicesHref: "/leistungen",
      aboutLabel: "Ueber uns",
      aboutHref: "/ueber-uns",
      faqLabel: "FAQ",
      faqHref: "/faq",
      contactLabel: "Kontakt",
      contactHref: "/kontakt",
      ctaLabel: "Angebot anfragen",
      ctaHref: "/kontakt",
    },
    footer: {
      footerText: "Ihr zuverlaessiger Partner fuer professionelle Gebaeudereinigung im Rhein-Main-Gebiet. Qualitaet, die man sieht.",
      membershipLabel: "BIV Bundesinnungsverband",
    },
    footerContact: {
      phoneLabel: "Telefon",
      phoneDisplay: "0800 000 000",
      phoneHref: "tel:+4900000000000",
      phoneMeta: "Mo-Fr 7:00-18:00 Uhr",
      emailLabel: "E-Mail",
      emailDisplay: "info@proclean-gmbh.de",
      emailHref: "mailto:info@proclean-gmbh.de",
      addressLabel: "Adresse",
      addressLines: "Musterstrasse 1\n12345 Musterstadt",
      hoursLabel: "Oeffnungszeiten",
      hoursLines: "Mo-Fr: 07:00-18:00\nSa: 08:00-14:00",
    },
    legal: {
      impressumLabel: "Impressum",
      impressumHref: "/impressum",
      datenschutzLabel: "Datenschutz",
      datenschutzHref: "/datenschutz",
    },
  },
  home: {
    hero: {
      title: "Sauberkeit,",
      accentTitle: "die ueberzeugt.",
      subtitle:
        "Zuverlaessige Gebaeudereinigung fuer Unternehmen im Rhein-Main-Gebiet - puenktlich, gruendlich und diskret. Damit Sie sich auf Ihr Kerngeschaeft konzentrieren koennen.",
      primaryButtonText: "Kostenloses Angebot",
    },
    services: {
      title: "Unsere Leistungen",
      subtitle:
        "Von der täglichen Büroreinigung bis zur Glasfassade – wir bieten das vollständige Spektrum professioneller Gebäudereinigung.",
      buttonText: "Alle Leistungen ansehen",
    },
    usps: {
      title: "Warum Unternehmen uns vertrauen",
      subtitle:
        "Wir sind kein anonymer Großbetrieb. Als mittelständisches Reinigungsunternehmen kennen wir unsere Kunden persönlich und arbeiten mit festen Teams – für gleichbleibende Qualität und echtes Vertrauen.",
    },
    finalCta: {
      title: "Bereit fuer saubere Ergebnisse?",
      body:
        "Fordern Sie jetzt Ihr kostenloses Angebot fuer Kreis Offenbach, Frankfurt am Main oder Hanau an. Wir melden uns innerhalb von 24 Stunden bei Ihnen.",
      primaryButtonText: "Jetzt Angebot anfragen",
      seoTitle: "",
      seoDescription: "",
    },
  },
  leistungen: {
    hero: {
      title: "Professionelle Reinigungsleistungen",
      subtitle: "Unser Team reinigt Büro-, Praxis- und Gewerbeflächen mit hoher Sorgfalt und planbarer Frequenz.",
      buttonText: "Mehr erfahren",
    },
    overview: {
      title: "Unser Angebot im Überblick",
      subtitle: "Von der Unterhaltsreinigung bis zur Grundreinigung: Wir bieten passgenaue Lösungen für Ihr Objekt.",
    },
    benefits: {
      title: "Ihre Vorteile",
      subtitle: "Feste Teams, transparente Preise und zuverlässige Qualität – so unterstützen wir Ihren Geschäftsbetrieb.",
    },
    finalCta: {
      title: "Jetzt Angebot anfragen",
      body: "Fordern Sie ein individuelles Reinigungsangebot an und erhalten Sie eine kostenfreie Beratung für Ihr Unternehmen.",
      primaryButtonText: "Angebot anfragen",
      seoTitle: "",
      seoDescription: "",
    },
  },
  "ueber-uns": {
    hero: {
      title: "Wir reinigen mit Vertrauen",
      subtitle: "Lernen Sie unser regionales Team kennen und erfahren Sie, wie wir Qualität, Sicherheit und Service verbinden.",
      buttonText: "Mehr erfahren",
    },
    companyInfo: {
      title: "Unsere Geschichte",
      body: "Mit jahrelanger Erfahrung in der gewerblichen Reinigung setzen wir auf transparente Prozesse, feste Ansprechpartner und nachhaltige Ergebnisse.",
    },
    values: {
      title: "Unsere Werte",
      subtitle: "Zuverlässigkeit, Diskretion und klare Kommunikation stehen bei uns an erster Stelle.",
    },
    finalCta: {
      title: "Lernen Sie uns kennen",
      body: "Vereinbaren Sie ein unverbindliches Gespräch und erfahren Sie, wie wir Ihre Reinigungsanforderungen umsetzen.",
      primaryButtonText: "Kontakt aufnehmen",
      seoTitle: "",
      seoDescription: "",
    },
  },
  faq: {
    hero: {
      title: "Häufige Fragen",
      subtitle: "Antworten auf die wichtigsten Fragen zu unseren Reinigungsleistungen und unserem Service.",
      buttonText: "Mehr erfahren",
    },
    questions: {
      title: "FAQ",
      subtitle: "Die häufigsten Fragen unserer Kunden – kurz und verständlich beantwortet.",
      faqText: "Was kostet die Reinigung?\nWelchen Service bieten Sie an?\nWie schnell erhalten wir ein Angebot?",
    },
    finalCta: {
      title: "Noch Fragen?",
      body: "Rufen Sie uns an oder senden Sie uns eine Nachricht – wir beraten Sie persönlich und schnell.",
      primaryButtonText: "Jetzt kontaktieren",
      seoTitle: "",
      seoDescription: "",
    },
  },
  kontakt: {
    hero: {
      title: "Kontakt aufnehmen",
      subtitle: "Wir sind für Sie da – schreiben Sie uns oder rufen Sie an. Wir melden uns schnellstmöglich zurück.",
      buttonText: "Anfrage senden",
    },
    contactInfo: {
      title: "Kontaktinformationen",
      subtitle: "Telefon, E-Mail und persönliche Beratung – alle Wege führen schnell zu uns.",
    },
    formSection: {
      title: "Senden Sie uns Ihre Anfrage",
      subtitle: "Nutzen Sie das Formular für Ihr Anliegen und wir melden uns innerhalb von 24 Stunden.",
      buttonText: "Nachricht senden",
    },
  },
};

export interface CmsPageSummary<TSlug extends CmsPageSlug = CmsPageSlug> {
  slug: TSlug;
  title: string;
  path: string;
  updatedAt: string;
}

export interface CmsPage<TSlug extends CmsPageSlug = CmsPageSlug> extends CmsPageSummary<TSlug> {
  content: CmsPageContentMap[TSlug];
}

export function normalizeCmsPageContent<TSlug extends CmsPageSlug>(slug: TSlug, content: unknown): CmsPageContentMap[TSlug] {
  const schema = cmsPageSchemas[slug];
  const parsed = schema.safeParse(content);
  if (parsed.success) {
    return parsed.data as CmsPageContentMap[TSlug];
  }

  return getDefaultCmsPageContent(slug);
}

export function getDefaultCmsPageContent<TSlug extends CmsPageSlug>(slug: TSlug): CmsPageContentMap[TSlug] {
  return JSON.parse(JSON.stringify(defaultCmsPageContent[slug])) as CmsPageContentMap[TSlug];
}
