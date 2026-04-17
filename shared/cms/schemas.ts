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
        "Von der tÃ¤glichen BÃ¼roreinigung bis zur Glasfassade â€“ wir bieten das vollstÃ¤ndige Spektrum professioneller GebÃ¤udereinigung."
      ),
      buttonText: pageButtonSchema.default("Alle Leistungen ansehen"),
      imageUrl: imageUrlSchema,
    })
    .default({
      title: "Unsere Leistungen",
      subtitle: "Von der tÃ¤glichen BÃ¼roreinigung bis zur Glasfassade â€“ wir bieten das vollstÃ¤ndige Spektrum professioneller GebÃ¤udereinigung.",
      buttonText: "Alle Leistungen ansehen",
      imageUrl: "",
    }),
  usps: z
    .object({
      title: pageTitleSchema.default("Warum Unternehmen uns vertrauen"),
      imageUrl: imageUrlSchema,
      subtitle: pageSubtitleSchema.default(
        "Wir sind kein anonymer GroÃŸbetrieb. Als mittelstÃ¤ndisches Reinigungsunternehmen kennen wir unsere Kunden persÃ¶nlich und arbeiten mit festen Teams â€“ fÃ¼r gleichbleibende QualitÃ¤t und echtes Vertrauen."
      ),
    })
    .default({
      title: "Warum Unternehmen uns vertrauen",
      imageUrl: "",
      subtitle:
        "Wir sind kein anonymer GroÃŸbetrieb. Als mittelstÃ¤ndisches Reinigungsunternehmen kennen wir unsere Kunden persÃ¶nlich und arbeiten mit festen Teams â€“ fÃ¼r gleichbleibende QualitÃ¤t und echtes Vertrauen.",
    }),
  finalCta: finalCtaSchema.extend({
    imageUrl: imageUrlSchema,
  }),
  seo: seoSectionSchema.default({
    seoTitle: "GebÃ¤udereinigung in Neu-Isenburg und Umgebung | Aktive Facility Management",
    seoDescription:
      "Professionelle GebÃ¤udereinigung fÃ¼r Unternehmen in Neu-Isenburg und Umgebung. Jetzt kostenloses Angebot anfragen.",
  }),
});

export type CmsHomeContent = z.infer<typeof cmsHomeContentSchema>;

export const cmsServicesContentSchema = z.object({
  hero: heroBaseSchema,
  overview: z
    .object({
      title: pageTitleSchema.default("LeistungsÃ¼bersicht"),
      subtitle: pageSubtitleSchema.default(
        "Ein Ãœberblick Ã¼ber unser Leistungsspektrum: von tÃ¤glicher BÃ¼roreinigung bis zur Glas- und Sonderreinigung."
      ),
      imageUrl1: imageUrlSchema,
      imageUrl2: imageUrlSchema,
    })
    .default({
      title: "LeistungsÃ¼bersicht",
      subtitle: "Ein Ãœberblick Ã¼ber unser Leistungsspektrum: von tÃ¤glicher BÃ¼roreinigung bis zur Glas- und Sonderreinigung.",
      imageUrl1: "",
      imageUrl2: "",
    }),
  benefits: z
    .object({
      title: pageTitleSchema.default("Ihre Vorteile"),
      subtitle: pageSubtitleSchema.default(
        "Wir arbeiten mit festen Teams, transparenter Abrechnung und hoher ZuverlÃ¤ssigkeit â€“ genau das, was Unternehmen erwarten."
      ),
    })
    .default({
      title: "Ihre Vorteile",
      subtitle:
        "Wir arbeiten mit festen Teams, transparenter Abrechnung und hoher ZuverlÃ¤ssigkeit â€“ genau das, was Unternehmen erwarten.",
    }),
  finalCta: finalCtaSchema,
  seo: seoSectionSchema.default({
    seoTitle: "Leistungen fÃ¼r professionelle GebÃ¤udereinigung | Aktive Facility Management",
    seoDescription:
      "Unterhaltsreinigung, BÃ¼roreinigung, Glasreinigung und Sonderreinigung fÃ¼r Unternehmen in Neu-Isenburg und Umgebung.",
  }),
});

export type CmsServicesContent = z.infer<typeof cmsServicesContentSchema>;

export const cmsAboutContentSchema = z.object({
  hero: heroBaseSchema,
  companyInfo: z
    .object({
      title: pageTitleSchema.default("Unsere Geschichte"),
      storyParagraph1: longTextSchema.default(
        "Aktive Facility Management wurde gegrÃ¼ndet mit einer klaren Vision: GebÃ¤udereinigung auf einem Niveau anzubieten, das Unternehmen wirklich Ã¼berzeugt."
      ),
      storyParagraph2: longTextSchema.default(
        "Was als kleines lokales Unternehmen begann, ist heute ein verlÃ¤sslicher Partner fÃ¼r Unternehmen aus verschiedensten Branchen."
      ),
      storyParagraph3: longTextSchema.default(
        "Wir beschÃ¤ftigen ausschlieÃŸlich festangestellte, geschulte Mitarbeiter. Keine Subunternehmer, keine Ãœberraschungen."
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
        "Aktive Facility Management wurde gegrÃ¼ndet mit einer klaren Vision: GebÃ¤udereinigung auf einem Niveau anzubieten, das Unternehmen wirklich Ã¼berzeugt.",
      storyParagraph2:
        "Was als kleines lokales Unternehmen begann, ist heute ein verlÃ¤sslicher Partner fÃ¼r Unternehmen aus verschiedensten Branchen.",
      storyParagraph3:
        "Wir beschÃ¤ftigen ausschlieÃŸlich festangestellte, geschulte Mitarbeiter. Keine Subunternehmer, keine Ãœberraschungen.",
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
        "Diese GrundsÃ¤tze leiten unser Handeln â€“ gegenÃ¼ber Kunden, Mitarbeitern und der Gesellschaft."
      ),
      value1Title: pageTitleSchema.default("VerlÃ¤sslichkeit"),
      value1Desc: pageSubtitleSchema.default("Wir halten, was wir versprechen. Termine, QualitÃ¤t und Absprachen â€“ ohne Ausnahme."),
      value2Title: pageTitleSchema.default("QualitÃ¤t"),
      value2Desc: pageSubtitleSchema.default("Kein Kompromiss bei der AusfÃ¼hrung. Wir arbeiten grÃ¼ndlich und sorgfÃ¤ltig."),
      value3Title: pageTitleSchema.default("Partnerschaft"),
      value3Desc: pageSubtitleSchema.default("Wir verstehen uns als langfristiger Partner unserer Kunden."),
      value4Title: pageTitleSchema.default("Verantwortung"),
      value4Desc: pageSubtitleSchema.default("Verantwortung gegenÃ¼ber Kunden, Mitarbeitern und der Umwelt prÃ¤gt unser Handeln."),
    })
    .default({
      title: "Unsere Werte",
      subtitle: "Diese GrundsÃ¤tze leiten unser Handeln â€“ gegenÃ¼ber Kunden, Mitarbeitern und der Gesellschaft.",
      value1Title: "VerlÃ¤sslichkeit",
      value1Desc: "Wir halten, was wir versprechen. Termine, QualitÃ¤t und Absprachen â€“ ohne Ausnahme.",
      value2Title: "QualitÃ¤t",
      value2Desc: "Kein Kompromiss bei der AusfÃ¼hrung. Wir arbeiten grÃ¼ndlich und sorgfÃ¤ltig.",
      value3Title: "Partnerschaft",
      value3Desc: "Wir verstehen uns als langfristiger Partner unserer Kunden.",
      value4Title: "Verantwortung",
      value4Desc: "Verantwortung gegenÃ¼ber Kunden, Mitarbeitern und der Umwelt prÃ¤gt unser Handeln.",
    }),
  team: z
    .object({
      title: pageTitleSchema.default("Unser Team"),
      paragraph1: longTextSchema.default(
        "Unser Team besteht aus erfahrenen, geschulten FachkrÃ¤ften, die ihren Beruf mit Sorgfalt und Engagement ausÃ¼ben."
      ),
      paragraph2: longTextSchema.default(
        "Wir legen groÃŸen Wert auf KontinuitÃ¤t: Ihre Objekte werden von festen Teams betreut."
      ),
      bullet1: pageSubtitleSchema.default("Alle Mitarbeiter festangestellt"),
      bullet2: pageSubtitleSchema.default("RegelmÃ¤ÃŸige Schulungen und Weiterbildungen"),
      bullet3: pageSubtitleSchema.default("ZuverlÃ¤ssige Vertretungsregelungen"),
      bullet4: pageSubtitleSchema.default("Diskret und vertrauenswÃ¼rdig"),
      buttonText: pageButtonSchema.default("Kontakt aufnehmen"),
      imageUrl: imageUrlSchema,
      imageAlt: z.string().trim().max(160, "Der Alternativtext ist zu lang.").default(""),
    })
    .default({
      title: "Unser Team",
      paragraph1:
        "Unser Team besteht aus erfahrenen, geschulten FachkrÃ¤ften, die ihren Beruf mit Sorgfalt und Engagement ausÃ¼ben.",
      paragraph2: "Wir legen groÃŸen Wert auf KontinuitÃ¤t: Ihre Objekte werden von festen Teams betreut.",
      bullet1: "Alle Mitarbeiter festangestellt",
      bullet2: "RegelmÃ¤ÃŸige Schulungen und Weiterbildungen",
      bullet3: "ZuverlÃ¤ssige Vertretungsregelungen",
      bullet4: "Diskret und vertrauenswÃ¼rdig",
      buttonText: "Kontakt aufnehmen",
      imageUrl: "",
      imageAlt: "",
    }),
  finalCta: finalCtaSchema,
  seo: seoSectionSchema.default({
    seoTitle: "Ãœber uns | Aktive Facility Management GebÃ¤udereinigung",
    seoDescription:
      "Lernen Sie das Team hinter Aktive Facility Management kennen. Festangestellte FachkrÃ¤fte, klare Prozesse und zuverlÃ¤ssige QualitÃ¤t.",
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
        "Allgemeines|FÃ¼r welche Objekte bieten Sie Ihre Reinigungsleistungen an?|Wir reinigen gewerbliche Objekte aller Art: BÃ¼ros, Praxen, Kanzleien, Hotels, Einzelhandel und Industrieanlagen.\nAllgemeines|Wie schnell kann ich ein Angebot erhalten?|Nach Ihrer Anfrage melden wir uns in der Regel innerhalb von 24 Stunden.\nLeistungen & Ablauf|Wie hÃ¤ufig wird gereinigt?|Wir bieten tÃ¤gliche, wÃ¶chentliche oder individuelle Reinigungsintervalle an.\nLeistungen & Ablauf|Kann die Reinigung auÃŸerhalb unserer GeschÃ¤ftszeiten stattfinden?|Ja, wir reinigen auf Wunsch vor Arbeitsbeginn, nach Feierabend oder am Wochenende.\nQualitÃ¤t & Vertrauen|Wie stellen Sie gleichbleibende QualitÃ¤t sicher?|Durch feste Teams, Schulungen, Reinigungsprotokolle und persÃ¶nliche QualitÃ¤tskontrollen.\nVertrag & Kosten|Gibt es versteckte Kosten?|Nein. Unser Angebot ist transparent und vollstÃ¤ndig."
      ),
    })
    .default({
      title: "FAQ",
      subtitle: "Hier finden Sie Antworten auf die wichtigsten Fragen rund um unsere Reinigungsleistungen.",
      faqText:
        "Allgemeines|FÃ¼r welche Objekte bieten Sie Ihre Reinigungsleistungen an?|Wir reinigen gewerbliche Objekte aller Art: BÃ¼ros, Praxen, Kanzleien, Hotels, Einzelhandel und Industrieanlagen.\nAllgemeines|Wie schnell kann ich ein Angebot erhalten?|Nach Ihrer Anfrage melden wir uns in der Regel innerhalb von 24 Stunden.\nLeistungen & Ablauf|Wie hÃ¤ufig wird gereinigt?|Wir bieten tÃ¤gliche, wÃ¶chentliche oder individuelle Reinigungsintervalle an.\nLeistungen & Ablauf|Kann die Reinigung auÃŸerhalb unserer GeschÃ¤ftszeiten stattfinden?|Ja, wir reinigen auf Wunsch vor Arbeitsbeginn, nach Feierabend oder am Wochenende.\nQualitÃ¤t & Vertrauen|Wie stellen Sie gleichbleibende QualitÃ¤t sicher?|Durch feste Teams, Schulungen, Reinigungsprotokolle und persÃ¶nliche QualitÃ¤tskontrollen.\nVertrag & Kosten|Gibt es versteckte Kosten?|Nein. Unser Angebot ist transparent und vollstÃ¤ndig.",
    }),
  finalCta: finalCtaSchema,
  seo: seoSectionSchema.default({
    seoTitle: "FAQ zur GebÃ¤udereinigung | Aktive Facility Management",
    seoDescription:
      "Antworten auf hÃ¤ufige Fragen zu Leistungen, Ablauf, Kosten und QualitÃ¤t unserer professionellen GebÃ¤udereinigung.",
  }),
});

export type CmsFaqContent = z.infer<typeof cmsFaqContentSchema>;

export const cmsContactContentSchema = z.object({
  hero: heroBaseSchema,
  contactInfo: z
    .object({
      title: pageTitleSchema.default("Kontaktinformationen"),
      subtitle: pageSubtitleSchema.default(
        "Nutzen Sie unsere KontaktmÃ¶glichkeiten fÃ¼r schnelle RÃ¼ckmeldung und individuelle Beratung."
      ),
    })
    .default({
      title: "Kontaktinformationen",
      subtitle: "Nutzen Sie unsere KontaktmÃ¶glichkeiten fÃ¼r schnelle RÃ¼ckmeldung und individuelle Beratung.",
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
    seoTitle: "Kontakt | Aktive Facility Management GebÃ¤udereinigung",
    seoDescription:
      "Kontaktieren Sie Aktive Facility Management fÃ¼r ein kostenloses und unverbindliches Angebot zur GebÃ¤udereinigung in Neu-Isenburg und Umgebung.",
  }),
});

export type CmsContactContent = z.infer<typeof cmsContactContentSchema>;

const pathFieldSchema = z.string().trim().min(1, "Der Pfad ist erforderlich.").max(200, "Der Pfad ist zu lang.");
const multilineTextSchema = z.string().trim().min(1, "Das Feld ist erforderlich.").max(2000, "Das Feld ist zu lang.");
const defaultNavigationItems = [
  { id: "home", label: "Startseite", href: "/", visible: true, sortOrder: 1, type: "page", target: "_self" },
  { id: "services", label: "Leistungen", href: "/leistungen", visible: true, sortOrder: 2, type: "page", target: "_self" },
  { id: "about", label: "Ãœber uns", href: "/ueber-uns", visible: true, sortOrder: 3, type: "page", target: "_self" },
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
      "Ihr zuverlÃ¤ssiger Partner fÃ¼r professionelle GebÃ¤udereinigung in Neu-Isenburg und Umgebung. QualitÃ¤t, die man sieht."
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
    addressLines: multilineTextSchema.default("SchleussnerstraÃŸe 90\n63263 Neu-Isenburg"),
    hoursLabel: pageTitleSchema.default("Ã–ffnungszeiten"),
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


