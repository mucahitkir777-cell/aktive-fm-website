import { z } from "zod";

export const cmsPageSlugs = ["global", "home", "leistungen", "ueber-uns", "faq", "kontakt"] as const;
export const cmsPageSlugSchema = z.enum(cmsPageSlugs);
export type CmsPageSlug = (typeof cmsPageSlugs)[number];

const pageTitleSchema = z.string().trim().min(1, "Der Titel ist erforderlich.").max(120, "Der Titel ist zu lang.");
const pageSubtitleSchema = z.string().trim().min(1, "Die Beschreibung ist erforderlich.").max(500, "Die Beschreibung ist zu lang.");
const pageButtonSchema = z.string().trim().min(1, "Der Button-Text ist erforderlich.").max(60, "Der Button-Text ist zu lang.");
const longTextSchema = z.string().trim().min(1, "Das Feld ist erforderlich.").max(2000, "Das Feld ist zu lang.");
const imageUrlSchema = z.string().trim().max(1000, "Die Bild-URL ist zu lang.").default("");

const heroBaseSchema = z.object({
  title: pageTitleSchema,
  subtitle: pageSubtitleSchema,
  buttonText: pageButtonSchema.default("Mehr erfahren"),
  imageUrl: imageUrlSchema,
});

const heroWithAccentSchema = z.object({
  title: pageTitleSchema,
  accentTitle: pageTitleSchema,
  subtitle: pageSubtitleSchema,
  primaryButtonText: pageButtonSchema.default("Kostenloses Angebot"),
  imageUrl: imageUrlSchema,
});

const finalCtaSchema = z.object({
  title: pageTitleSchema,
  body: pageSubtitleSchema,
  primaryButtonText: pageButtonSchema.default("Jetzt anfragen"),
  seoTitle: z.string().trim().max(120, "Der SEO-Titel ist zu lang.").default(""),
  seoDescription: z.string().trim().max(500, "Die SEO-Beschreibung ist zu lang.").default(""),
});

const seoSectionSchema = z.object({
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
      imageUrl: imageUrlSchema,
    })
    .default({
      title: "Unsere Leistungen",
      subtitle: "Von der täglichen Büroreinigung bis zur Glasfassade – wir bieten das vollständige Spektrum professioneller Gebäudereinigung.",
      buttonText: "Alle Leistungen ansehen",
      imageUrl: "",
    }),
  usps: z
    .object({
      title: pageTitleSchema.default("Warum Unternehmen uns vertrauen"),
      imageUrl: imageUrlSchema,
      subtitle: pageSubtitleSchema.default(
        "Wir sind kein anonymer Großbetrieb. Als mittelständisches Reinigungsunternehmen kennen wir unsere Kunden persönlich und arbeiten mit festen Teams – für gleichbleibende Qualität und echtes Vertrauen."
      ),
    })
    .default({
      title: "Warum Unternehmen uns vertrauen",
      imageUrl: "",
      subtitle:
        "Wir sind kein anonymer Großbetrieb. Als mittelständisches Reinigungsunternehmen kennen wir unsere Kunden persönlich und arbeiten mit festen Teams – für gleichbleibende Qualität und echtes Vertrauen.",
    }),
  finalCta: finalCtaSchema.extend({
    imageUrl: imageUrlSchema,
  }),
  seo: seoSectionSchema.default({
    seoTitle: "Gebäudereinigung in Neu-Isenburg und Umgebung | Aktive Facility Management",
    seoDescription:
      "Professionelle Gebäudereinigung für Unternehmen in Neu-Isenburg und Umgebung. Jetzt kostenloses Angebot anfragen.",
  }),
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
      imageUrl1: imageUrlSchema,
      imageUrl2: imageUrlSchema,
    })
    .default({
      title: "Leistungsübersicht",
      subtitle: "Ein Überblick über unser Leistungsspektrum: von täglicher Büroreinigung bis zur Glas- und Sonderreinigung.",
      imageUrl1: "",
      imageUrl2: "",
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
  seo: seoSectionSchema.default({
    seoTitle: "Leistungen für professionelle Gebäudereinigung | Aktive Facility Management",
    seoDescription:
      "Unterhaltsreinigung, Büroreinigung, Glasreinigung und Sonderreinigung für Unternehmen in Neu-Isenburg und Umgebung.",
  }),
});

export type CmsServicesContent = z.infer<typeof cmsServicesContentSchema>;

export const cmsAboutContentSchema = z.object({
  hero: heroBaseSchema,
  companyInfo: z
    .object({
      title: pageTitleSchema.default("Unsere Geschichte"),
      storyParagraph1: longTextSchema.default(
        "Aktive Facility Management wurde gegründet mit einer klaren Vision: Gebäudereinigung auf einem Niveau anzubieten, das Unternehmen wirklich überzeugt."
      ),
      storyParagraph2: longTextSchema.default(
        "Was als kleines lokales Unternehmen begann, ist heute ein verlässlicher Partner für Unternehmen aus verschiedensten Branchen."
      ),
      storyParagraph3: longTextSchema.default(
        "Wir beschäftigen ausschließlich festangestellte, geschulte Mitarbeiter. Keine Subunternehmer, keine Überraschungen."
      ),
      statsYearsLabel: pageTitleSchema.default("Jahre Erfahrung"),
      statsCustomersLabel: pageTitleSchema.default("Stammkunden"),
      statsStaffLabel: pageTitleSchema.default("Mitarbeiter"),
      statsEmployeesLabel: pageTitleSchema.default("Festangestellt"),
      teamImageUrl: imageUrlSchema,
      teamImageAlt: z.string().trim().max(160, "Der Alternativtext ist zu lang.").default(""),
      teamBadgeLabel: pageTitleSchema.default("Zufriedene Kunden"),
    })
    .default({
      title: "Unsere Geschichte",
      storyParagraph1:
        "Aktive Facility Management wurde gegründet mit einer klaren Vision: Gebäudereinigung auf einem Niveau anzubieten, das Unternehmen wirklich überzeugt.",
      storyParagraph2:
        "Was als kleines lokales Unternehmen begann, ist heute ein verlässlicher Partner für Unternehmen aus verschiedensten Branchen.",
      storyParagraph3:
        "Wir beschäftigen ausschließlich festangestellte, geschulte Mitarbeiter. Keine Subunternehmer, keine Überraschungen.",
      statsYearsLabel: "Jahre Erfahrung",
      statsCustomersLabel: "Stammkunden",
      statsStaffLabel: "Mitarbeiter",
      statsEmployeesLabel: "Festangestellt",
      teamImageUrl: "",
      teamImageAlt: "",
      teamBadgeLabel: "Zufriedene Kunden",
    }),
  values: z
    .object({
      title: pageTitleSchema.default("Unsere Werte"),
      subtitle: pageSubtitleSchema.default(
        "Diese Grundsätze leiten unser Handeln – gegenüber Kunden, Mitarbeitern und der Gesellschaft."
      ),
      value1Title: pageTitleSchema.default("Verlässlichkeit"),
      value1Desc: pageSubtitleSchema.default("Wir halten, was wir versprechen. Termine, Qualität und Absprachen – ohne Ausnahme."),
      value2Title: pageTitleSchema.default("Qualität"),
      value2Desc: pageSubtitleSchema.default("Kein Kompromiss bei der Ausführung. Wir arbeiten gründlich und sorgfältig."),
      value3Title: pageTitleSchema.default("Partnerschaft"),
      value3Desc: pageSubtitleSchema.default("Wir verstehen uns als langfristiger Partner unserer Kunden."),
      value4Title: pageTitleSchema.default("Verantwortung"),
      value4Desc: pageSubtitleSchema.default("Verantwortung gegenüber Kunden, Mitarbeitern und der Umwelt prägt unser Handeln."),
    })
    .default({
      title: "Unsere Werte",
      subtitle: "Diese Grundsätze leiten unser Handeln – gegenüber Kunden, Mitarbeitern und der Gesellschaft.",
      value1Title: "Verlässlichkeit",
      value1Desc: "Wir halten, was wir versprechen. Termine, Qualität und Absprachen – ohne Ausnahme.",
      value2Title: "Qualität",
      value2Desc: "Kein Kompromiss bei der Ausführung. Wir arbeiten gründlich und sorgfältig.",
      value3Title: "Partnerschaft",
      value3Desc: "Wir verstehen uns als langfristiger Partner unserer Kunden.",
      value4Title: "Verantwortung",
      value4Desc: "Verantwortung gegenüber Kunden, Mitarbeitern und der Umwelt prägt unser Handeln.",
    }),
  team: z
    .object({
      title: pageTitleSchema.default("Unser Team"),
      paragraph1: longTextSchema.default(
        "Unser Team besteht aus erfahrenen, geschulten Fachkräften, die ihren Beruf mit Sorgfalt und Engagement ausüben."
      ),
      paragraph2: longTextSchema.default(
        "Wir legen großen Wert auf Kontinuität: Ihre Objekte werden von festen Teams betreut."
      ),
      bullet1: pageSubtitleSchema.default("Alle Mitarbeiter festangestellt"),
      bullet2: pageSubtitleSchema.default("Regelmäßige Schulungen und Weiterbildungen"),
      bullet3: pageSubtitleSchema.default("Zuverlässige Vertretungsregelungen"),
      bullet4: pageSubtitleSchema.default("Diskret und vertrauenswürdig"),
      buttonText: pageButtonSchema.default("Kontakt aufnehmen"),
      imageUrl: imageUrlSchema,
      imageAlt: z.string().trim().max(160, "Der Alternativtext ist zu lang.").default(""),
    })
    .default({
      title: "Unser Team",
      paragraph1:
        "Unser Team besteht aus erfahrenen, geschulten Fachkräften, die ihren Beruf mit Sorgfalt und Engagement ausüben.",
      paragraph2: "Wir legen großen Wert auf Kontinuität: Ihre Objekte werden von festen Teams betreut.",
      bullet1: "Alle Mitarbeiter festangestellt",
      bullet2: "Regelmäßige Schulungen und Weiterbildungen",
      bullet3: "Zuverlässige Vertretungsregelungen",
      bullet4: "Diskret und vertrauenswürdig",
      buttonText: "Kontakt aufnehmen",
      imageUrl: "",
      imageAlt: "",
    }),
  finalCta: finalCtaSchema,
  seo: seoSectionSchema.default({
    seoTitle: "Über uns | Aktive Facility Management Gebäudereinigung",
    seoDescription:
      "Lernen Sie das Team hinter Aktive Facility Management kennen. Festangestellte Fachkräfte, klare Prozesse und zuverlässige Qualität.",
  }),
});

export type CmsAboutContent = z.infer<typeof cmsAboutContentSchema>;

export const cmsFaqContentSchema = z.object({
  hero: heroBaseSchema,
  questions: z
    .object({
      title: pageTitleSchema.default("FAQ"),
      subtitle: pageSubtitleSchema.default("Hier finden Sie Antworten auf die wichtigsten Fragen rund um unsere Reinigungsleistungen."),
      faqText: z.string().trim().max(12000, "Der FAQ-Inhalt ist zu lang.").default(
        "Allgemeines|Für welche Objekte bieten Sie Ihre Reinigungsleistungen an?|Wir reinigen gewerbliche Objekte aller Art: Büros, Praxen, Kanzleien, Hotels, Einzelhandel und Industrieanlagen.\nAllgemeines|Wie schnell kann ich ein Angebot erhalten?|Nach Ihrer Anfrage melden wir uns in der Regel innerhalb von 24 Stunden.\nLeistungen & Ablauf|Wie häufig wird gereinigt?|Wir bieten tägliche, wöchentliche oder individuelle Reinigungsintervalle an.\nLeistungen & Ablauf|Kann die Reinigung außerhalb unserer Geschäftszeiten stattfinden?|Ja, wir reinigen auf Wunsch vor Arbeitsbeginn, nach Feierabend oder am Wochenende.\nQualität & Vertrauen|Wie stellen Sie gleichbleibende Qualität sicher?|Durch feste Teams, Schulungen, Reinigungsprotokolle und persönliche Qualitätskontrollen.\nVertrag & Kosten|Gibt es versteckte Kosten?|Nein. Unser Angebot ist transparent und vollständig."
      ),
    })
    .default({
      title: "FAQ",
      subtitle: "Hier finden Sie Antworten auf die wichtigsten Fragen rund um unsere Reinigungsleistungen.",
      faqText:
        "Allgemeines|Für welche Objekte bieten Sie Ihre Reinigungsleistungen an?|Wir reinigen gewerbliche Objekte aller Art: Büros, Praxen, Kanzleien, Hotels, Einzelhandel und Industrieanlagen.\nAllgemeines|Wie schnell kann ich ein Angebot erhalten?|Nach Ihrer Anfrage melden wir uns in der Regel innerhalb von 24 Stunden.\nLeistungen & Ablauf|Wie häufig wird gereinigt?|Wir bieten tägliche, wöchentliche oder individuelle Reinigungsintervalle an.\nLeistungen & Ablauf|Kann die Reinigung außerhalb unserer Geschäftszeiten stattfinden?|Ja, wir reinigen auf Wunsch vor Arbeitsbeginn, nach Feierabend oder am Wochenende.\nQualität & Vertrauen|Wie stellen Sie gleichbleibende Qualität sicher?|Durch feste Teams, Schulungen, Reinigungsprotokolle und persönliche Qualitätskontrollen.\nVertrag & Kosten|Gibt es versteckte Kosten?|Nein. Unser Angebot ist transparent und vollständig.",
    }),
  finalCta: finalCtaSchema,
  seo: seoSectionSchema.default({
    seoTitle: "FAQ zur Gebäudereinigung | Aktive Facility Management",
    seoDescription:
      "Antworten auf häufige Fragen zu Leistungen, Ablauf, Kosten und Qualität unserer professionellen Gebäudereinigung.",
  }),
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
  seo: seoSectionSchema.default({
    seoTitle: "Kontakt | Aktive Facility Management Gebäudereinigung",
    seoDescription:
      "Kontaktieren Sie Aktive Facility Management für ein kostenloses und unverbindliches Angebot zur Gebäudereinigung in Neu-Isenburg und Umgebung.",
  }),
});

export type CmsContactContent = z.infer<typeof cmsContactContentSchema>;

const pathFieldSchema = z.string().trim().min(1, "Der Pfad ist erforderlich.").max(200, "Der Pfad ist zu lang.");
const multilineTextSchema = z.string().trim().min(1, "Das Feld ist erforderlich.").max(2000, "Das Feld ist zu lang.");

export const cmsGlobalContentSchema = z.object({
  navigation: z.object({
    homeLabel: pageTitleSchema.default("Startseite"),
    homeHref: pathFieldSchema.default("/"),
    homeVisible: z.boolean().default(true),
    homeSortOrder: z.coerce.number().int().min(1).max(100).default(1),
    servicesLabel: pageTitleSchema.default("Leistungen"),
    servicesHref: pathFieldSchema.default("/leistungen"),
    servicesVisible: z.boolean().default(true),
    servicesSortOrder: z.coerce.number().int().min(1).max(100).default(2),
    aboutLabel: pageTitleSchema.default("Über uns"),
    aboutHref: pathFieldSchema.default("/ueber-uns"),
    aboutVisible: z.boolean().default(true),
    aboutSortOrder: z.coerce.number().int().min(1).max(100).default(3),
    faqLabel: pageTitleSchema.default("FAQ"),
    faqHref: pathFieldSchema.default("/faq"),
    faqVisible: z.boolean().default(true),
    faqSortOrder: z.coerce.number().int().min(1).max(100).default(4),
    contactLabel: pageTitleSchema.default("Kontakt"),
    contactHref: pathFieldSchema.default("/kontakt"),
    contactVisible: z.boolean().default(true),
    contactSortOrder: z.coerce.number().int().min(1).max(100).default(5),
    ctaLabel: pageButtonSchema.default("Angebot anfragen"),
    ctaHref: pathFieldSchema.default("/kontakt"),
  }),
  siteStatus: z.enum(["live", "maintenance"]).default("live"),
  footer: z.object({
    footerText: pageSubtitleSchema.default(
      "Ihr zuverläßiger Partner für professionelle Gebäudereinigung in Neu-Isenburg und Umgebung. Qualität, die man sieht."
    ),
    membershipLabel: z.string().trim().min(1, "Die Mitgliedschaft ist erforderlich.").max(120, "Die Mitgliedschaft ist zu lang.").default("BIV Bundesinnungsverband"),
  }),
  footerContact: z.object({
    phoneLabel: pageTitleSchema.default("Telefon"),
    phoneDisplay: z.string().trim().min(1, "Die Telefonnummer ist erforderlich.").max(80, "Die Telefonnummer ist zu lang.").default("0178 6660021"),
    phoneHref: z.string().trim().min(1, "Der Telefon-Link ist erforderlich.").max(200, "Der Telefon-Link ist zu lang.").default("tel:+491786660021"),
    phoneMeta: z.string().trim().min(1, "Die Zusatzinfo ist erforderlich.").max(120, "Die Zusatzinfo ist zu lang.").default("Mo-Fr 7:00-18:00 Uhr"),
    emailLabel: pageTitleSchema.default("E-Mail"),
    emailDisplay: z.string().trim().min(1, "Die E-Mail ist erforderlich.").max(120, "Die E-Mail ist zu lang.").default("info@aktive-fm.de"),
    emailHref: z.string().trim().min(1, "Der E-Mail-Link ist erforderlich.").max(200, "Der E-Mail-Link ist zu lang.").default("mailto:info@aktive-fm.de"),
    addressLabel: pageTitleSchema.default("Adresse"),
    addressLines: multilineTextSchema.default("Schleussnerstraße 90\n63263 Neu-Isenburg"),
    hoursLabel: pageTitleSchema.default("Öffnungszeiten"),
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
  input: "text" | "textarea" | "checkbox" | "number";
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
          { key: "homeVisible", label: "Startseite sichtbar", input: "checkbox" },
          { key: "homeSortOrder", label: "Startseite Reihenfolge", input: "number" },
          { key: "servicesLabel", label: "Leistungen Label", input: "text" },
          { key: "servicesHref", label: "Leistungen Pfad", input: "text" },
          { key: "servicesVisible", label: "Leistungen sichtbar", input: "checkbox" },
          { key: "servicesSortOrder", label: "Leistungen Reihenfolge", input: "number" },
          { key: "aboutLabel", label: "Über uns Label", input: "text" },
          { key: "aboutHref", label: "Über uns Pfad", input: "text" },
          { key: "aboutVisible", label: "Über uns sichtbar", input: "checkbox" },
          { key: "aboutSortOrder", label: "Über uns Reihenfolge", input: "number" },
          { key: "faqLabel", label: "FAQ Label", input: "text" },
          { key: "faqHref", label: "FAQ Pfad", input: "text" },
          { key: "faqVisible", label: "FAQ sichtbar", input: "checkbox" },
          { key: "faqSortOrder", label: "FAQ Reihenfolge", input: "number" },
          { key: "contactLabel", label: "Kontakt Label", input: "text" },
          { key: "contactHref", label: "Kontakt Pfad", input: "text" },
          { key: "contactVisible", label: "Kontakt sichtbar", input: "checkbox" },
          { key: "contactSortOrder", label: "Kontakt Reihenfolge", input: "number" },
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
          { key: "hoursLabel", label: "Öffnungszeiten Label", input: "text" },
          { key: "hoursLines", label: "Öffnungszeiten Zeilen", input: "textarea", rows: 3 },
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
          { key: "imageUrl", label: "Hero-Bild URL", input: "text" },
        ],
      },
      {
        key: "services",
        label: "Leistungen",
        fields: [
          { key: "title", label: "Bereichstitel", input: "text" },
          { key: "subtitle", label: "Bereichsbeschreibung", input: "textarea", rows: 4 },
          { key: "buttonText", label: "Button-Text", input: "text" },
          { key: "imageUrl", label: "Bereichsbild URL", input: "text" },
        ],
      },
      {
        key: "usps",
        label: "USPs",
        fields: [
          { key: "title", label: "Bereichstitel", input: "text" },
          { key: "subtitle", label: "Bereichsbeschreibung", input: "textarea", rows: 4 },
          { key: "imageUrl", label: "Bereichsbild URL", input: "text" },
        ],
      },
      {
        key: "finalCta",
        label: "Kontaktbereich",
        fields: [
          { key: "title", label: "CTA-Titel", input: "text" },
          { key: "body", label: "CTA-Text", input: "textarea", rows: 4 },
          { key: "primaryButtonText", label: "CTA-Button-Text", input: "text" },
          { key: "imageUrl", label: "CTA-Bild URL", input: "text" },
        ],
      },
      {
        key: "seo",
        label: "SEO",
        fields: [
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
          { key: "imageUrl", label: "Hero-Bild URL", input: "text" },
        ],
      },
      {
        key: "overview",
        label: "Leistungsübersicht",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "subtitle", label: "Beschreibung", input: "textarea", rows: 4 },
          { key: "imageUrl1", label: "Leistungsbild URL 1", input: "text" },
          { key: "imageUrl2", label: "Leistungsbild URL 2", input: "text" },
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
        ],
      },
      {
        key: "seo",
        label: "SEO",
        fields: [
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
          { key: "imageUrl", label: "Hero-Bild URL", input: "text" },
        ],
      },
      {
        key: "companyInfo",
        label: "Unternehmensinfo",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "storyParagraph1", label: "Text Absatz 1", input: "textarea", rows: 4 },
          { key: "storyParagraph2", label: "Text Absatz 2", input: "textarea", rows: 4 },
          { key: "storyParagraph3", label: "Text Absatz 3", input: "textarea", rows: 4 },
          { key: "statsYearsLabel", label: "Statistik Jahre Label", input: "text" },
          { key: "statsCustomersLabel", label: "Statistik Kunden Label", input: "text" },
          { key: "statsStaffLabel", label: "Statistik Mitarbeiter Label", input: "text" },
          { key: "statsEmployeesLabel", label: "Statistik Festangestellt Label", input: "text" },
          { key: "teamImageUrl", label: "Story-Bild URL", input: "text" },
          { key: "teamImageAlt", label: "Story-Bild Alt-Text", input: "text" },
          { key: "teamBadgeLabel", label: "Story-Badge Label", input: "text" },
        ],
      },
      {
        key: "values",
        label: "Werte / Vorteile",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "subtitle", label: "Beschreibung", input: "textarea", rows: 4 },
          { key: "value1Title", label: "Wert 1 Titel", input: "text" },
          { key: "value1Desc", label: "Wert 1 Text", input: "textarea", rows: 3 },
          { key: "value2Title", label: "Wert 2 Titel", input: "text" },
          { key: "value2Desc", label: "Wert 2 Text", input: "textarea", rows: 3 },
          { key: "value3Title", label: "Wert 3 Titel", input: "text" },
          { key: "value3Desc", label: "Wert 3 Text", input: "textarea", rows: 3 },
          { key: "value4Title", label: "Wert 4 Titel", input: "text" },
          { key: "value4Desc", label: "Wert 4 Text", input: "textarea", rows: 3 },
        ],
      },
      {
        key: "team",
        label: "Team-Bereich",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "paragraph1", label: "Text Absatz 1", input: "textarea", rows: 4 },
          { key: "paragraph2", label: "Text Absatz 2", input: "textarea", rows: 4 },
          { key: "bullet1", label: "Bullet 1", input: "text" },
          { key: "bullet2", label: "Bullet 2", input: "text" },
          { key: "bullet3", label: "Bullet 3", input: "text" },
          { key: "bullet4", label: "Bullet 4", input: "text" },
          { key: "buttonText", label: "Button-Text", input: "text" },
          { key: "imageUrl", label: "Team-Bild URL", input: "text" },
          { key: "imageAlt", label: "Team-Bild Alt-Text", input: "text" },
        ],
      },
      {
        key: "finalCta",
        label: "Kontaktbereich",
        fields: [
          { key: "title", label: "CTA-Titel", input: "text" },
          { key: "body", label: "CTA-Text", input: "textarea", rows: 4 },
          { key: "primaryButtonText", label: "CTA-Button-Text", input: "text" },
        ],
      },
      {
        key: "seo",
        label: "SEO",
        fields: [
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
          { key: "imageUrl", label: "Hero-Bild URL", input: "text" },
        ],
      },
      {
        key: "questions",
        label: "Fragenbereich",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "subtitle", label: "Beschreibung", input: "textarea", rows: 4 },
          { key: "faqText", label: "FAQ-Inhalt (Kategorie|Frage|Antwort je Zeile)", input: "textarea", rows: 14 },
        ],
      },
      {
        key: "finalCta",
        label: "Kontaktbereich",
        fields: [
          { key: "title", label: "CTA-Titel", input: "text" },
          { key: "body", label: "CTA-Text", input: "textarea", rows: 4 },
          { key: "primaryButtonText", label: "CTA-Button-Text", input: "text" },
        ],
      },
      {
        key: "seo",
        label: "SEO",
        fields: [
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
          { key: "imageUrl", label: "Hero-Bild URL", input: "text" },
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
      {
        key: "seo",
        label: "SEO",
        fields: [
          { key: "seoTitle", label: "SEO-Titel", input: "text" },
          { key: "seoDescription", label: "SEO-Beschreibung", input: "textarea", rows: 4 },
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
      homeVisible: true,
      homeSortOrder: 1,
      servicesLabel: "Leistungen",
      servicesHref: "/leistungen",
      servicesVisible: true,
      servicesSortOrder: 2,
      aboutLabel: "Über uns",
      aboutHref: "/ueber-uns",
      aboutVisible: true,
      aboutSortOrder: 3,
      faqLabel: "FAQ",
      faqHref: "/faq",
      faqVisible: true,
      faqSortOrder: 4,
      contactLabel: "Kontakt",
      contactHref: "/kontakt",
      contactVisible: true,
      contactSortOrder: 5,
      ctaLabel: "Angebot anfragen",
      ctaHref: "/kontakt",
    },
    siteStatus: "live",
    footer: {
      footerText: "Ihr zuverläßiger Partner für professionelle Gebäudereinigung in Neu-Isenburg und Umgebung. Qualität, die man sieht.",
      membershipLabel: "BIV Bundesinnungsverband",
    },
    footerContact: {
      phoneLabel: "Telefon",
      phoneDisplay: "0178 6660021",
      phoneHref: "tel:+491786660021",
      phoneMeta: "Mo-Fr 7:00-18:00 Uhr",
      emailLabel: "E-Mail",
      emailDisplay: "info@aktive-fm.de",
      emailHref: "mailto:info@aktive-fm.de",
      addressLabel: "Adresse",
      addressLines: "Schleussnerstraße 90\n63263 Neu-Isenburg",
      hoursLabel: "Öffnungszeiten",
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
      accentTitle: "die überzeugt.",
      subtitle:
        "Zuverläßige Gebäudereinigung für Unternehmen in Neu-Isenburg und Umgebung - pünktlich, gründlich und diskret. Damit Sie sich auf Ihr Kerngeschäft konzentrieren können.",
      primaryButtonText: "Kostenloses Angebot",
      imageUrl: "",
    },
    services: {
      title: "Unsere Leistungen",
      subtitle:
        "Von der täglichen Büroreinigung bis zur Glasfassade – wir bieten das vollständige Spektrum professioneller Gebäudereinigung.",
      buttonText: "Alle Leistungen ansehen",
      imageUrl: "",
    },
    usps: {
      title: "Warum Unternehmen uns vertrauen",
      imageUrl: "",
      subtitle:
        "Wir sind kein anonymer Großbetrieb. Als mittelständisches Reinigungsunternehmen kennen wir unsere Kunden persönlich und arbeiten mit festen Teams – für gleichbleibende Qualität und echtes Vertrauen.",
    },
    finalCta: {
      title: "Bereit für saubere Ergebnisse?",
      body:
        "Fordern Sie jetzt Ihr kostenloses Angebot für Neu-Isenburg und Umgebung an. Wir melden uns innerhalb von 24 Stunden bei Ihnen.",
      primaryButtonText: "Jetzt Angebot anfragen",
      imageUrl: "",
      seoTitle: "",
      seoDescription: "",
    },
    seo: {
      seoTitle: "Gebäudereinigung in Neu-Isenburg und Umgebung | Aktive Facility Management",
      seoDescription:
        "Professionelle Gebäudereinigung für Unternehmen in Neu-Isenburg und Umgebung. Jetzt kostenloses Angebot anfragen.",
    },
  },
  leistungen: {
    hero: {
      title: "Professionelle Reinigungsleistungen",
      subtitle: "Unser Team reinigt Büro-, Praxis- und Gewerbeflächen mit hoher Sorgfalt und planbarer Frequenz.",
      buttonText: "Mehr erfahren",
      imageUrl: "",
    },
    overview: {
      title: "Unser Angebot im Überblick",
      subtitle: "Von der Unterhaltsreinigung bis zur Grundreinigung: Wir bieten passgenaue Lösungen für Ihr Objekt.",
      imageUrl1: "",
      imageUrl2: "",
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
    seo: {
      seoTitle: "Leistungen für professionelle Gebäudereinigung | Aktive Facility Management",
      seoDescription:
        "Unterhaltsreinigung, Büroreinigung, Glasreinigung und Sonderreinigung für Unternehmen in Neu-Isenburg und Umgebung.",
    },
  },
  "ueber-uns": {
    hero: {
      title: "Wir reinigen mit Vertrauen",
      subtitle: "Lernen Sie unser regionales Team kennen und erfahren Sie, wie wir Qualität, Sicherheit und Service verbinden.",
      buttonText: "Mehr erfahren",
      imageUrl: "",
    },
    companyInfo: {
      title: "Unsere Geschichte",
      storyParagraph1:
        "Aktive Facility Management wurde gegründet mit einer klaren Vision: Gebäudereinigung auf einem Niveau anzubieten, das Unternehmen wirklich überzeugt.",
      storyParagraph2:
        "Was als kleines lokales Unternehmen begann, ist heute ein verlässlicher Partner für Unternehmen aus verschiedensten Branchen.",
      storyParagraph3:
        "Wir beschäftigen ausschließlich festangestellte, geschulte Mitarbeiter. Keine Subunternehmer, keine Überraschungen.",
      statsYearsLabel: "Jahre Erfahrung",
      statsCustomersLabel: "Stammkunden",
      statsStaffLabel: "Mitarbeiter",
      statsEmployeesLabel: "Festangestellt",
      teamImageUrl: "",
      teamImageAlt: "",
      teamBadgeLabel: "Zufriedene Kunden",
    },
    values: {
      title: "Unsere Werte",
      subtitle: "Diese Grundsätze leiten unser Handeln – gegenüber Kunden, Mitarbeitern und der Gesellschaft.",
      value1Title: "Verlässlichkeit",
      value1Desc: "Wir halten, was wir versprechen. Termine, Qualität und Absprachen – ohne Ausnahme.",
      value2Title: "Qualität",
      value2Desc: "Kein Kompromiss bei der Ausführung. Wir arbeiten gründlich und sorgfältig.",
      value3Title: "Partnerschaft",
      value3Desc: "Wir verstehen uns als langfristiger Partner unserer Kunden.",
      value4Title: "Verantwortung",
      value4Desc: "Verantwortung gegenüber Kunden, Mitarbeitern und der Umwelt prägt unser Handeln.",
    },
    team: {
      title: "Unser Team",
      paragraph1:
        "Unser Team besteht aus erfahrenen, geschulten Fachkräften, die ihren Beruf mit Sorgfalt und Engagement ausüben.",
      paragraph2: "Wir legen großen Wert auf Kontinuität: Ihre Objekte werden von festen Teams betreut.",
      bullet1: "Alle Mitarbeiter festangestellt",
      bullet2: "Regelmäßige Schulungen und Weiterbildungen",
      bullet3: "Zuverlässige Vertretungsregelungen",
      bullet4: "Diskret und vertrauenswürdig",
      buttonText: "Kontakt aufnehmen",
      imageUrl: "",
      imageAlt: "",
    },
    finalCta: {
      title: "Lernen Sie uns kennen",
      body: "Vereinbaren Sie ein unverbindliches Gespräch und erfahren Sie, wie wir Ihre Reinigungsanforderungen umsetzen.",
      primaryButtonText: "Kontakt aufnehmen",
      seoTitle: "",
      seoDescription: "",
    },
    seo: {
      seoTitle: "Über uns | Aktive Facility Management Gebäudereinigung",
      seoDescription:
        "Lernen Sie das Team hinter Aktive Facility Management kennen. Festangestellte Fachkräfte, klare Prozesse und zuverlässige Qualität.",
    },
  },
  faq: {
    hero: {
      title: "Häufige Fragen",
      subtitle: "Antworten auf die wichtigsten Fragen zu unseren Reinigungsleistungen und unserem Service.",
      buttonText: "Mehr erfahren",
      imageUrl: "",
    },
    questions: {
      title: "FAQ",
      subtitle: "Die häufigsten Fragen unserer Kunden – kurz und verständlich beantwortet.",
      faqText:
        "Allgemeines|Für welche Objekte bieten Sie Ihre Reinigungsleistungen an?|Wir reinigen gewerbliche Objekte aller Art: Büros, Praxen, Kanzleien, Hotels, Einzelhandel und Industrieanlagen.\nAllgemeines|Wie schnell kann ich ein Angebot erhalten?|Nach Ihrer Anfrage melden wir uns in der Regel innerhalb von 24 Stunden.\nLeistungen & Ablauf|Wie häufig wird gereinigt?|Wir bieten tägliche, wöchentliche oder individuelle Reinigungsintervalle an.\nLeistungen & Ablauf|Kann die Reinigung außerhalb unserer Geschäftszeiten stattfinden?|Ja, wir reinigen auf Wunsch vor Arbeitsbeginn, nach Feierabend oder am Wochenende.\nQualität & Vertrauen|Wie stellen Sie gleichbleibende Qualität sicher?|Durch feste Teams, Schulungen, Reinigungsprotokolle und persönliche Qualitätskontrollen.\nVertrag & Kosten|Gibt es versteckte Kosten?|Nein. Unser Angebot ist transparent und vollständig.",
    },
    finalCta: {
      title: "Noch Fragen?",
      body: "Rufen Sie uns an oder senden Sie uns eine Nachricht – wir beraten Sie persönlich und schnell.",
      primaryButtonText: "Jetzt kontaktieren",
      seoTitle: "",
      seoDescription: "",
    },
    seo: {
      seoTitle: "FAQ zur Gebäudereinigung | Aktive Facility Management",
      seoDescription:
        "Antworten auf häufige Fragen zu Leistungen, Ablauf, Kosten und Qualität unserer professionellen Gebäudereinigung.",
    },
  },
  kontakt: {
    hero: {
      title: "Kontakt aufnehmen",
      subtitle: "Wir sind für Sie da – schreiben Sie uns oder rufen Sie an. Wir melden uns schnellstmöglich zurück.",
      buttonText: "Anfrage senden",
      imageUrl: "",
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
    seo: {
      seoTitle: "Kontakt | Aktive Facility Management Gebäudereinigung",
      seoDescription:
        "Kontaktieren Sie Aktive Facility Management für ein kostenloses und unverbindliches Angebot zur Gebäudereinigung in Neu-Isenburg und Umgebung.",
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





