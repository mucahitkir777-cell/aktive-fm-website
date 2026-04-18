import { z } from "zod";
import { cmsPageSlugs } from "./types";

export const cmsPageSlugSchema = z.enum(cmsPageSlugs);

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
const defaultNavigationItems = [
  { id: "home", label: "Startseite", href: "/", visible: true, sortOrder: 1, type: "page", target: "_self" },
  { id: "services", label: "Leistungen", href: "/leistungen", visible: true, sortOrder: 2, type: "page", target: "_self" },
  { id: "about", label: "Über uns", href: "/ueber-uns", visible: true, sortOrder: 3, type: "page", target: "_self" },
  { id: "faq", label: "FAQ", href: "/faq", visible: true, sortOrder: 4, type: "page", target: "_self" },
  { id: "contact", label: "Kontakt", href: "/kontakt", visible: true, sortOrder: 5, type: "page", target: "_self" },
] satisfies Array<{
  id: string;
  label: string;
  href: string;
  visible: boolean;
  sortOrder: number;
  type: "page" | "custom";
  target: "_self" | "_blank";
}>;

export const cmsNavigationItemSchema = z.object({
  id: z.string().trim().min(1).max(60),
  label: pageTitleSchema,
  href: pathFieldSchema,
  visible: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(1).max(100),
  type: z.enum(["page", "custom"]).default("page"),
  target: z.enum(["_self", "_blank"]).default("_self"),
});

export const cmsGlobalContentSchema = z.object({
  navigation: z.object({
    items: z.array(cmsNavigationItemSchema).min(1).default(defaultNavigationItems),
    ctaLabel: pageButtonSchema.default("Angebot anfragen"),
    ctaHref: pathFieldSchema.default("/kontakt"),
  }),
  siteStatus: z.enum(["live", "maintenance"]).default("live"),
  footer: z.object({
    footerText: pageSubtitleSchema.default(
      "Ihr zuverlässiger Partner für professionelle Gebäudereinigung in Neu-Isenburg und Umgebung. Qualität, die man sieht."
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


