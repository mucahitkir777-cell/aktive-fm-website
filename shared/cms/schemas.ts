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
  buttonText: pageButtonSchema.default("Kontakt aufnehmen"),
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
        "Unterhaltsreinigung, Büroreinigung, Glasreinigung und Sonderleistungen für Unternehmen im Rhein-Main-Gebiet."
      ),
      buttonText: pageButtonSchema.default("Alle Leistungen ansehen"),
      imageUrl: imageUrlSchema,
    })
    .default({
      title: "Unsere Leistungen",
      subtitle: "Unterhaltsreinigung, Büroreinigung, Glasreinigung und Sonderleistungen für Unternehmen im Rhein-Main-Gebiet.",
      buttonText: "Alle Leistungen ansehen",
      imageUrl: "",
    }),
  usps: z
    .object({
      title: pageTitleSchema.default("Warum Unternehmen uns vertrauen"),
      imageUrl: imageUrlSchema,
      subtitle: pageSubtitleSchema.default(
        "Feste Teams, klare Abläufe und persönliche Erreichbarkeit sorgen dafür, dass Reinigungsqualität planbar bleibt und Ihr Tagesgeschäft ohne Reibungsverluste weiterläuft."
      ),
    })
    .default({
      title: "Warum Unternehmen uns vertrauen",
      imageUrl: "",
      subtitle:
        "Feste Teams, klare Abläufe und persönliche Erreichbarkeit sorgen dafür, dass Reinigungsqualität planbar bleibt und Ihr Tagesgeschäft ohne Reibungsverluste weiterläuft.",
    }),
  reviews: z
    .object({
      title: pageTitleSchema.default("Bewertungen & Referenzen"),
      subtitle: pageSubtitleSchema.default(
        "Öffentliche Profile und echte Rückmeldungen geben einen schnellen Eindruck davon, wie wir arbeiten."
      ),
      googleImageUrl: imageUrlSchema.default("/assets/review-logos/google.svg"),
      googleScore: pageTitleSchema.default("5,0"),
      googleLabel: pageSubtitleSchema.default("Google Rezensionen"),
      trustpilotImageUrl: imageUrlSchema.default("/assets/review-logos/trustpilot.svg"),
      trustpilotScore: pageTitleSchema.default("5,0"),
      trustpilotLabel: pageSubtitleSchema.default("Unternehmensprofil"),
      provenexpertImageUrl: imageUrlSchema.default("/assets/review-logos/provenexpert.png"),
      provenexpertScore: pageTitleSchema.default("SEHR GUT"),
      provenexpertLabel: pageSubtitleSchema.default("Verifizierte Bewertungen"),
      oneOneEightEightZeroImageUrl: imageUrlSchema.default("/assets/review-logos/11880.png"),
      oneOneEightEightZeroScore: pageTitleSchema.default("4,9"),
      oneOneEightEightZeroLabel: pageSubtitleSchema.default("Branchenprofil"),
      trustlocalImageUrl: imageUrlSchema.default("/assets/review-logos/trustlocal.png"),
      trustlocalScore: pageTitleSchema.default("4,9"),
      trustlocalLabel: pageSubtitleSchema.default("Plattformprofil"),
    })
    .default({
      title: "Bewertungen & Referenzen",
      subtitle: "Öffentliche Profile und echte Rückmeldungen geben einen schnellen Eindruck davon, wie wir arbeiten.",
      googleImageUrl: "/assets/review-logos/google.svg",
      googleScore: "5,0",
      googleLabel: "Google Rezensionen",
      trustpilotImageUrl: "/assets/review-logos/trustpilot.svg",
      trustpilotScore: "5,0",
      trustpilotLabel: "Unternehmensprofil",
      provenexpertImageUrl: "/assets/review-logos/provenexpert.png",
      provenexpertScore: "SEHR GUT",
      provenexpertLabel: "Verifizierte Bewertungen",
      oneOneEightEightZeroImageUrl: "/assets/review-logos/11880.png",
      oneOneEightEightZeroScore: "4,9",
      oneOneEightEightZeroLabel: "Branchenprofil",
      trustlocalImageUrl: "/assets/review-logos/trustlocal.png",
      trustlocalScore: "4,9",
      trustlocalLabel: "Plattformprofil",
    }),
  finalCta: finalCtaSchema.extend({
    imageUrl: imageUrlSchema,
  }),
  seo: seoSectionSchema.default({
    seoTitle: "Gebäudereinigung in Neu-Isenburg, Offenbach und Frankfurt | Aktive Facility Management",
    seoDescription:
      "Gebäudereinigung für Büros, Praxen und Gewerbeflächen in Neu-Isenburg, Offenbach, Frankfurt und Hanau. Feste Teams, klare Abläufe, persönlicher Ansprechpartner.",
  }),
});

export type CmsHomeContent = z.infer<typeof cmsHomeContentSchema>;

export const cmsServicesContentSchema = z.object({
  hero: heroBaseSchema,
  overview: z
    .object({
      title: pageTitleSchema.default("Leistungsübersicht"),
      subtitle: pageSubtitleSchema.default(
        "Von der laufenden Unterhaltsreinigung bis zur gründlichen Sonderleistung: Wir planen Reinigungsintervalle und Leistungsumfang passend zu Ihrem Objekt."
      ),
      imageUrl1: imageUrlSchema,
      imageUrl2: imageUrlSchema,
    })
    .default({
      title: "Leistungsübersicht",
      subtitle: "Von der laufenden Unterhaltsreinigung bis zur gründlichen Sonderleistung: Wir planen Reinigungsintervalle und Leistungsumfang passend zu Ihrem Objekt.",
      imageUrl1: "",
      imageUrl2: "",
    }),
  benefits: z
    .object({
      title: pageTitleSchema.default("Ihre Vorteile"),
      subtitle: pageSubtitleSchema.default(
        "Klare Ansprechpartner, nachvollziehbare Leistungen und feste Einsatztage sorgen dafür, dass Reinigung im Alltag verlässlich funktioniert."
      ),
    })
    .default({
      title: "Ihre Vorteile",
      subtitle:
        "Klare Ansprechpartner, nachvollziehbare Leistungen und feste Einsatztage sorgen dafür, dass Reinigung im Alltag verlässlich funktioniert.",
    }),
  finalCta: finalCtaSchema,
  seo: seoSectionSchema.default({
    seoTitle: "Leistungen der Gebäudereinigung im Rhein-Main-Gebiet | Aktive Facility Management",
    seoDescription:
      "Büroreinigung, Unterhaltsreinigung, Glasreinigung, Treppenhausreinigung und Sonderleistungen für Unternehmen in Neu-Isenburg, Offenbach, Frankfurt und Hanau.",
  }),
});

export type CmsServicesContent = z.infer<typeof cmsServicesContentSchema>;

export const cmsAboutContentSchema = z.object({
  hero: heroBaseSchema,
  companyInfo: z
    .object({
      title: pageTitleSchema.default("Wer wir sind"),
      storyParagraph1: longTextSchema.default(
        "Aktive Facility Management betreut Unternehmen in Neu-Isenburg und im Rhein-Main-Gebiet mit professioneller Gebäudereinigung."
      ),
      storyParagraph2: longTextSchema.default(
        "Im Mittelpunkt stehen für uns saubere Abläufe, feste Ansprechpartner und Leistungen, die im Tagesgeschäft tatsächlich entlasten."
      ),
      storyParagraph3: longTextSchema.default(
        "Deshalb arbeiten wir mit geschulten, festangestellten Teams und setzen auf direkte Abstimmung statt wechselnder Zuständigkeiten."
      ),
      statsYearsLabel: pageTitleSchema.default("Jahre Erfahrung"),
      statsCustomersLabel: pageTitleSchema.default("Stammkunden"),
      statsStaffLabel: pageTitleSchema.default("Mitarbeiter"),
      statsEmployeesLabel: pageTitleSchema.default("Festangestellt"),
      teamImageUrl: imageUrlSchema,
      teamImageAlt: z.string().trim().max(160, "Der Alternativtext ist zu lang.").default(""),
      teamBadgeLabel: pageTitleSchema.default("Betreute Kunden"),
    })
    .default({
      title: "Wer wir sind",
      storyParagraph1:
        "Aktive Facility Management betreut Unternehmen in Neu-Isenburg und im Rhein-Main-Gebiet mit professioneller Gebäudereinigung.",
      storyParagraph2:
        "Im Mittelpunkt stehen für uns saubere Abläufe, feste Ansprechpartner und Leistungen, die im Tagesgeschäft tatsächlich entlasten.",
      storyParagraph3:
        "Deshalb arbeiten wir mit geschulten, festangestellten Teams und setzen auf direkte Abstimmung statt wechselnder Zuständigkeiten.",
      statsYearsLabel: "Jahre Erfahrung",
      statsCustomersLabel: "Stammkunden",
      statsStaffLabel: "Mitarbeiter",
      statsEmployeesLabel: "Festangestellt",
      teamImageUrl: "",
      teamImageAlt: "",
      teamBadgeLabel: "Betreute Kunden",
    }),
  values: z
    .object({
      title: pageTitleSchema.default("Unsere Werte"),
      subtitle: pageSubtitleSchema.default(
        "Diese Punkte prägen unsere Zusammenarbeit mit Kunden und unser tägliches Arbeiten im Objekt."
      ),
      value1Title: pageTitleSchema.default("Verlässlichkeit"),
      value1Desc: pageSubtitleSchema.default("Absprachen, Reinigungszeiten und Ergebnisse müssen im Tagesgeschäft verlässlich funktionieren."),
      value2Title: pageTitleSchema.default("Qualität"),
      value2Desc: pageSubtitleSchema.default("Wir arbeiten gründlich, dokumentiert und mit Blick für sensible Bereiche."),
      value3Title: pageTitleSchema.default("Partnerschaft"),
      value3Desc: pageSubtitleSchema.default("Wir denken nicht in Einzeleinsätzen, sondern in stabilen, langfristigen Kundenbeziehungen."),
      value4Title: pageTitleSchema.default("Verantwortung"),
      value4Desc: pageSubtitleSchema.default("Wir gehen sorgfältig mit Räumen, Material, Mitarbeitern und den Abläufen unserer Kunden um."),
    })
    .default({
      title: "Unsere Werte",
      subtitle: "Diese Punkte prägen unsere Zusammenarbeit mit Kunden und unser tägliches Arbeiten im Objekt.",
      value1Title: "Verlässlichkeit",
      value1Desc: "Absprachen, Reinigungszeiten und Ergebnisse müssen im Tagesgeschäft verlässlich funktionieren.",
      value2Title: "Qualität",
      value2Desc: "Wir arbeiten gründlich, dokumentiert und mit Blick für sensible Bereiche.",
      value3Title: "Partnerschaft",
      value3Desc: "Wir denken nicht in Einzeleinsätzen, sondern in stabilen, langfristigen Kundenbeziehungen.",
      value4Title: "Verantwortung",
      value4Desc: "Wir gehen sorgfältig mit Räumen, Material, Mitarbeitern und den Abläufen unserer Kunden um.",
    }),
  team: z
    .object({
      title: pageTitleSchema.default("Wie wir arbeiten"),
      paragraph1: longTextSchema.default(
        "Unsere Mitarbeiter sind geschult, festangestellt und mit den Anforderungen gewerblicher Objekte vertraut."
      ),
      paragraph2: longTextSchema.default(
        "Wo möglich, setzen wir feste Teams ein. Das reduziert Abstimmungsaufwand und sorgt für gleichbleibende Qualität."
      ),
      bullet1: pageSubtitleSchema.default("Alle Mitarbeiter festangestellt"),
      bullet2: pageSubtitleSchema.default("Einarbeitung nach Objekt und Reinigungsplan"),
      bullet3: pageSubtitleSchema.default("Verlässliche Vertretung bei Urlaub oder Ausfall"),
      bullet4: pageSubtitleSchema.default("Diskret und vertrauenswürdig"),
      buttonText: pageButtonSchema.default("Anfrage besprechen"),
      imageUrl: imageUrlSchema,
      imageAlt: z.string().trim().max(160, "Der Alternativtext ist zu lang.").default(""),
    })
    .default({
      title: "Wie wir arbeiten",
      paragraph1:
        "Unsere Mitarbeiter sind geschult, festangestellt und mit den Anforderungen gewerblicher Objekte vertraut.",
      paragraph2: "Wo möglich, setzen wir feste Teams ein. Das reduziert Abstimmungsaufwand und sorgt für gleichbleibende Qualität.",
      bullet1: "Alle Mitarbeiter festangestellt",
      bullet2: "Einarbeitung nach Objekt und Reinigungsplan",
      bullet3: "Verlässliche Vertretung bei Urlaub oder Ausfall",
      bullet4: "Diskret und vertrauenswürdig",
      buttonText: "Anfrage besprechen",
      imageUrl: "",
      imageAlt: "",
    }),
  finalCta: finalCtaSchema,
  seo: seoSectionSchema.default({
    seoTitle: "Über Aktive Facility Management | Gebäudereinigung aus Neu-Isenburg",
    seoDescription:
      "Lernen Sie Aktive Facility Management aus Neu-Isenburg kennen: feste Teams, direkte Ansprechpartner und planbare Gebäudereinigung für Unternehmen im Rhein-Main-Gebiet.",
  }),
});

export type CmsAboutContent = z.infer<typeof cmsAboutContentSchema>;

export const cmsFaqContentSchema = z.object({
  hero: heroBaseSchema,
  questions: z
    .object({
      title: pageTitleSchema.default("Häufige Fragen"),
      subtitle: pageSubtitleSchema.default("Kurz beantwortet: So läuft die Zusammenarbeit mit Aktive Facility Management ab."),
      faqText: z.string().trim().max(12000, "Der FAQ-Inhalt ist zu lang.").default(
        "Allgemeines|Für welche Objekte arbeiten Sie?|Wir reinigen vor allem Büros, Praxen, Kanzleien, Treppenhäuser, Gewerbeflächen und weitere gewerblich genutzte Objekte im Rhein-Main-Gebiet.\nAllgemeines|In welchen Regionen sind Sie im Einsatz?|Unser Schwerpunkt liegt in Neu-Isenburg, im Kreis Offenbach, in Frankfurt am Main und in Hanau.\nAngebot & Start|Wie läuft eine Anfrage ab?|Nach Ihrer Anfrage stimmen wir die Anforderungen kurz mit Ihnen ab, besichtigen das Objekt bei Bedarf und erstellen ein transparentes Angebot.\nAngebot & Start|Wie schnell erhalte ich ein Angebot?|In der Regel melden wir uns innerhalb von 24 Stunden zurück und planen die nächsten Schritte direkt mit Ihnen.\nLeistungen & Ablauf|Zu welchen Zeiten kann gereinigt werden?|Je nach Objekt reinigen wir vor Arbeitsbeginn, tagsüber in abgestimmten Bereichen oder nach Betriebsschluss.\nLeistungen & Ablauf|Arbeiten Sie mit festen Teams?|Ja, wenn möglich betreuen feste Reinigungsteams Ihr Objekt. Das verbessert Abstimmung, Sicherheit und gleichbleibende Qualität.\nQualität & Vertrauen|Wie sichern Sie die Qualität?|Durch eingearbeitete Teams, klare Leistungsverzeichnisse, direkte Ansprechpartner und regelmäßige Kontrollen.\nVertrag & Kosten|Gibt es versteckte Kosten?|Nein. Unsere Angebote sind nachvollziehbar aufgebaut und enthalten die abgestimmten Leistungen transparent."
      ),
    })
    .default({
      title: "Häufige Fragen",
      subtitle: "Kurz beantwortet: So läuft die Zusammenarbeit mit Aktive Facility Management ab.",
      faqText:
        "Allgemeines|Für welche Objekte arbeiten Sie?|Wir reinigen vor allem Büros, Praxen, Kanzleien, Treppenhäuser, Gewerbeflächen und weitere gewerblich genutzte Objekte im Rhein-Main-Gebiet.\nAllgemeines|In welchen Regionen sind Sie im Einsatz?|Unser Schwerpunkt liegt in Neu-Isenburg, im Kreis Offenbach, in Frankfurt am Main und in Hanau.\nAngebot & Start|Wie läuft eine Anfrage ab?|Nach Ihrer Anfrage stimmen wir die Anforderungen kurz mit Ihnen ab, besichtigen das Objekt bei Bedarf und erstellen ein transparentes Angebot.\nAngebot & Start|Wie schnell erhalte ich ein Angebot?|In der Regel melden wir uns innerhalb von 24 Stunden zurück und planen die nächsten Schritte direkt mit Ihnen.\nLeistungen & Ablauf|Zu welchen Zeiten kann gereinigt werden?|Je nach Objekt reinigen wir vor Arbeitsbeginn, tagsüber in abgestimmten Bereichen oder nach Betriebsschluss.\nLeistungen & Ablauf|Arbeiten Sie mit festen Teams?|Ja, wenn möglich betreuen feste Reinigungsteams Ihr Objekt. Das verbessert Abstimmung, Sicherheit und gleichbleibende Qualität.\nQualität & Vertrauen|Wie sichern Sie die Qualität?|Durch eingearbeitete Teams, klare Leistungsverzeichnisse, direkte Ansprechpartner und regelmäßige Kontrollen.\nVertrag & Kosten|Gibt es versteckte Kosten?|Nein. Unsere Angebote sind nachvollziehbar aufgebaut und enthalten die abgestimmten Leistungen transparent.",
    }),
  finalCta: finalCtaSchema,
  seo: seoSectionSchema.default({
    seoTitle: "FAQ zur Gebäudereinigung für Unternehmen | Aktive Facility Management",
    seoDescription:
      "Antworten zu Angebot, Ablauf, Einsatzzeiten, Qualität und Kosten unserer Gebäudereinigung für Unternehmen im Rhein-Main-Gebiet.",
  }),
});

export type CmsFaqContent = z.infer<typeof cmsFaqContentSchema>;

export const cmsContactContentSchema = z.object({
  hero: heroBaseSchema,
  contactInfo: z
    .object({
      title: pageTitleSchema.default("Kontaktinformationen"),
      subtitle: pageSubtitleSchema.default(
        "Telefon, E-Mail oder WhatsApp: Hier erreichen Sie uns schnell für Rückfragen, Besichtigungen und Angebotsabstimmungen."
      ),
    })
    .default({
      title: "Kontaktinformationen",
      subtitle: "Telefon, E-Mail oder WhatsApp: Hier erreichen Sie uns schnell für Rückfragen, Besichtigungen und Angebotsabstimmungen.",
    }),
  formSection: z
    .object({
      title: pageTitleSchema.default("Anfrage direkt senden"),
      subtitle: pageSubtitleSchema.default("Beschreiben Sie kurz Objekt, Standort und gewünschten Intervall. Wir melden uns zeitnah mit den nächsten Schritten."),
      buttonText: pageButtonSchema.default("Nachricht senden"),
    })
    .default({
      title: "Anfrage direkt senden",
      subtitle: "Beschreiben Sie kurz Objekt, Standort und gewünschten Intervall. Wir melden uns zeitnah mit den nächsten Schritten.",
      buttonText: "Nachricht senden",
    }),
  seo: seoSectionSchema.default({
    seoTitle: "Kontakt für Gebäudereinigung im Rhein-Main-Gebiet | Aktive Facility Management",
    seoDescription:
      "Kontaktieren Sie Aktive Facility Management für Gebäudereinigung in Neu-Isenburg, Offenbach, Frankfurt und Hanau. Schnelle Rückmeldung und klare Angebotsabstimmung.",
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
    ctaLabel: pageButtonSchema.default("Kostenloses Angebot"),
    ctaHref: pathFieldSchema.default("/kontakt"),
  }),
  siteStatus: z.enum(["live", "maintenance"]).default("live"),
  footer: z.object({
    footerText: pageSubtitleSchema.default(
      "Aktive Facility Management betreut Büros, Praxen und Gewerbeflächen in Neu-Isenburg, im Kreis Offenbach, in Frankfurt am Main und in Hanau mit planbarer Gebäudereinigung und festen Teams."
    ),
    membershipLabel: z.string().trim().min(1, "Die Mitgliedschaft ist erforderlich.").max(120, "Die Mitgliedschaft ist zu lang.").default("BIV Bundesinnungsverband"),
  }),
  footerContact: z.object({
    phoneLabel: pageTitleSchema.default("Telefon"),
    phoneDisplay: z.string().trim().min(1, "Die Telefonnummer ist erforderlich.").max(80, "Die Telefonnummer ist zu lang.").default("0178 6660021"),
    phoneHref: z.string().trim().min(1, "Der Telefon-Link ist erforderlich.").max(200, "Der Telefon-Link ist zu lang.").default("tel:+491786660021"),
    phoneMeta: z.string().trim().min(1, "Die Zusatzinfo ist erforderlich.").max(120, "Die Zusatzinfo ist zu lang.").default("Mo-Fr 07:00-18:00 Uhr"),
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



