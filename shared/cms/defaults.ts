import { cmsPageSchemas } from "./schemas";
import type { CmsPageContentMap } from "./definitions";
import type { CmsNavigationItem, CmsPageSlug } from "./types";
export const defaultCmsPageContent: CmsPageContentMap = {
  global: {
    navigation: {
      items: [
        { id: "home", label: "Startseite", href: "/", visible: true, sortOrder: 1, type: "page", target: "_self" },
        { id: "services", label: "Leistungen", href: "/leistungen", visible: true, sortOrder: 2, type: "page", target: "_self" },
        { id: "about", label: "Über uns", href: "/ueber-uns", visible: true, sortOrder: 3, type: "page", target: "_self" },
        { id: "faq", label: "FAQ", href: "/faq", visible: true, sortOrder: 4, type: "page", target: "_self" },
        { id: "contact", label: "Kontakt", href: "/kontakt", visible: true, sortOrder: 5, type: "page", target: "_self" },
      ],
      ctaLabel: "Kostenloses Angebot",
      ctaHref: "/kontakt",
    },
    siteStatus: "live",
    footer: {
      footerText:
        "Aktive Facility Management betreut Büros, Praxen und Gewerbeflächen in Neu-Isenburg, im Kreis Offenbach, in Frankfurt am Main und in Hanau mit planbarer Gebäudereinigung und festen Teams.",
      membershipLabel: "BIV Bundesinnungsverband",
    },
    footerContact: {
      phoneLabel: "Telefon",
      phoneDisplay: "0178 6660021",
      phoneHref: "tel:+491786660021",
      phoneMeta: "Mo-Fr 07:00-18:00 Uhr",
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
      title: "Gebäudereinigung,",
      accentTitle: "die im Alltag funktioniert.",
      subtitle:
        "Für Büros, Praxen und Gewerbeflächen in Neu-Isenburg, Offenbach, Frankfurt und Hanau. Pünktlich geplant, gründlich ausgeführt und mit festen Ansprechpartnern.",
      primaryButtonText: "Kostenloses Angebot",
      imageUrl: "",
    },
    services: {
      title: "Unsere Leistungen",
      subtitle:
        "Unterhaltsreinigung, Büroreinigung, Glasreinigung und Sonderleistungen für Unternehmen im Rhein-Main-Gebiet.",
      buttonText: "Alle Leistungen ansehen",
      imageUrl: "",
    },
    usps: {
      title: "Warum Unternehmen uns vertrauen",
      imageUrl: "",
      subtitle:
        "Feste Teams, klare Abläufe und persönliche Erreichbarkeit sorgen dafür, dass Reinigungsqualität planbar bleibt und Ihr Tagesgeschäft ohne Reibungsverluste weiterläuft.",
    },
    reviews: {
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
    },
    finalCta: {
      title: "Sauberkeit planbar organisieren",
      body:
        "Lassen Sie uns Ihr Objekt und Ihren Reinigungsbedarf kurz abstimmen. Sie erhalten ein nachvollziehbares Angebot ohne unnötige Umwege.",
      primaryButtonText: "Jetzt Angebot anfragen",
      imageUrl: "",
    },
    seo: {
      seoTitle: "Gebäudereinigung in Neu-Isenburg, Offenbach und Frankfurt | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung für Büros, Praxen und Gewerbeflächen in Neu-Isenburg, Offenbach, Frankfurt und Hanau. Feste Teams, klare Abläufe, persönlicher Ansprechpartner.",
    },
  },
  leistungen: {
    hero: {
      title: "Gebäudereinigung für Unternehmen",
      subtitle: "Wir reinigen Büros, Praxen, Treppenhäuser und Gewerbeflächen im Rhein-Main-Gebiet mit festen Teams und klarer Abstimmung.",
      buttonText: "Kostenloses Angebot",
      imageUrl: "",
    },
    overview: {
      title: "Leistungen im Überblick",
      subtitle:
        "Von der laufenden Unterhaltsreinigung bis zur gründlichen Sonderleistung: Wir planen Reinigungsintervalle und Leistungsumfang passend zu Ihrem Objekt.",
      imageUrl1: "",
      imageUrl2: "",
    },
    benefits: {
      title: "Was Sie davon haben",
      subtitle:
        "Klare Ansprechpartner, nachvollziehbare Leistungen und feste Einsatztage sorgen dafür, dass Reinigung im Alltag verlässlich funktioniert.",
    },
    finalCta: {
      title: "Reinigungsbedarf kurz abstimmen",
      body:
        "Wir besprechen Objekt, Intervall und Anforderungen und erstellen darauf aufbauend ein transparentes Angebot.",
      primaryButtonText: "Kostenloses Angebot",
    },
    seo: {
      seoTitle: "Leistungen der Gebäudereinigung im Rhein-Main-Gebiet | Aktive Facility Management",
      seoDescription:
        "Büroreinigung, Unterhaltsreinigung, Glasreinigung, Treppenhausreinigung und Sonderleistungen für Unternehmen in Neu-Isenburg, Offenbach, Frankfurt und Hanau.",
    },
  },
  "ueber-uns": {
    hero: {
      title: "Regional. Verlässlich. Direkt ansprechbar.",
      subtitle:
        "Aktive Facility Management steht für Gebäudereinigung mit festen Teams, klarer Kommunikation und planbaren Abläufen im Rhein-Main-Gebiet.",
      buttonText: "Kontakt aufnehmen",
      imageUrl: "",
    },
    companyInfo: {
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
    },
    values: {
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
    },
    team: {
      title: "Wie wir arbeiten",
      paragraph1:
        "Unsere Mitarbeiter sind geschult, festangestellt und mit den Anforderungen gewerblicher Objekte vertraut.",
      paragraph2:
        "Wo möglich, setzen wir feste Teams ein. Das reduziert Abstimmungsaufwand und sorgt für gleichbleibende Qualität.",
      bullet1: "Alle Mitarbeiter festangestellt",
      bullet2: "Einarbeitung nach Objekt und Reinigungsplan",
      bullet3: "Verlässliche Vertretung bei Urlaub oder Ausfall",
      bullet4: "Diskret und vertrauenswürdig",
      buttonText: "Anfrage besprechen",
      imageUrl: "",
      imageAlt: "",
    },
    finalCta: {
      title: "Lernen Sie unsere Arbeitsweise kennen",
      body:
        "Wenn Sie eine Reinigung suchen, die zuverlässig in Ihren Betriebsablauf passt, sprechen Sie mit uns.",
      primaryButtonText: "Kontakt aufnehmen",
    },
    seo: {
      seoTitle: "Über Aktive Facility Management | Gebäudereinigung aus Neu-Isenburg",
      seoDescription:
        "Lernen Sie Aktive Facility Management aus Neu-Isenburg kennen: feste Teams, direkte Ansprechpartner und planbare Gebäudereinigung für Unternehmen im Rhein-Main-Gebiet.",
    },
  },
  faq: {
    hero: {
      title: "Fragen zur Zusammenarbeit",
      subtitle: "Hier finden Sie die wichtigsten Antworten zu Ablauf, Angeboten, Einsatzzeiten und Qualitätssicherung.",
      buttonText: "Kontakt aufnehmen",
      imageUrl: "",
    },
    questions: {
      title: "Häufige Fragen",
      subtitle: "Kurz beantwortet: So läuft die Zusammenarbeit mit Aktive Facility Management ab.",
      faqText:
        "Allgemeines|Für welche Objekte arbeiten Sie?|Wir reinigen vor allem Büros, Praxen, Kanzleien, Treppenhäuser, Gewerbeflächen und weitere gewerblich genutzte Objekte im Rhein-Main-Gebiet.\nAllgemeines|In welchen Regionen sind Sie im Einsatz?|Unser Schwerpunkt liegt in Neu-Isenburg, im Kreis Offenbach, in Frankfurt am Main und in Hanau.\nAngebot & Start|Wie läuft eine Anfrage ab?|Nach Ihrer Anfrage stimmen wir die Anforderungen kurz mit Ihnen ab, besichtigen das Objekt bei Bedarf und erstellen ein transparentes Angebot.\nAngebot & Start|Wie schnell erhalte ich ein Angebot?|In der Regel melden wir uns innerhalb von 24 Stunden zurück und planen die nächsten Schritte direkt mit Ihnen.\nLeistungen & Ablauf|Zu welchen Zeiten kann gereinigt werden?|Je nach Objekt reinigen wir vor Arbeitsbeginn, tagsüber in abgestimmten Bereichen oder nach Betriebsschluss.\nLeistungen & Ablauf|Arbeiten Sie mit festen Teams?|Ja, wenn möglich betreuen feste Reinigungsteams Ihr Objekt. Das verbessert Abstimmung, Sicherheit und gleichbleibende Qualität.\nQualität & Vertrauen|Wie sichern Sie die Qualität?|Durch eingearbeitete Teams, klare Leistungsverzeichnisse, direkte Ansprechpartner und regelmäßige Kontrollen.\nVertrag & Kosten|Gibt es versteckte Kosten?|Nein. Unsere Angebote sind nachvollziehbar aufgebaut und enthalten die abgestimmten Leistungen transparent.",
    },
    finalCta: {
      title: "Noch Fragen?",
      body: "Wenn Ihre Frage hier nicht beantwortet wurde, klären wir sie direkt persönlich.",
      primaryButtonText: "Kontakt aufnehmen",
    },
    seo: {
      seoTitle: "FAQ zur Gebäudereinigung für Unternehmen | Aktive Facility Management",
      seoDescription:
        "Antworten zu Angebot, Ablauf, Einsatzzeiten, Qualität und Kosten unserer Gebäudereinigung für Unternehmen im Rhein-Main-Gebiet.",
    },
  },
  kontakt: {
    hero: {
      title: "Kontakt & Angebot",
      subtitle:
        "Ob Erstgespräch, Rückruf oder konkrete Angebotsanfrage: Wir reagieren schnell und klären den Bedarf direkt mit Ihnen.",
      buttonText: "Anfrage senden",
      imageUrl: "",
    },
    contactInfo: {
      title: "Kontaktinformationen",
      subtitle:
        "Telefon, E-Mail oder WhatsApp: Hier erreichen Sie uns schnell für Rückfragen, Besichtigungen und Angebotsabstimmungen.",
    },
    formSection: {
      title: "Anfrage direkt senden",
      subtitle:
        "Beschreiben Sie kurz Objekt, Standort und gewünschten Intervall. Wir melden uns zeitnah mit den nächsten Schritten.",
      buttonText: "Nachricht senden",
    },
    seo: {
      seoTitle: "Kontakt für Gebäudereinigung im Rhein-Main-Gebiet | Aktive Facility Management",
      seoDescription:
        "Kontaktieren Sie Aktive Facility Management für Gebäudereinigung in Neu-Isenburg, Offenbach, Frankfurt und Hanau. Schnelle Rückmeldung und klare Angebotsabstimmung.",
    },
  },
};

function sortNavigationItems(items: CmsNavigationItem[]) {
  return [...items].sort((left, right) => {
    if (left.sortOrder === right.sortOrder) {
      return left.id.localeCompare(right.id);
    }
    return left.sortOrder - right.sortOrder;
  });
}

function normalizeNavigationItems(items: unknown): CmsNavigationItem[] {
  const defaults = defaultCmsPageContent.global.navigation.items;
  if (!Array.isArray(items)) {
    return sortNavigationItems(defaults);
  }

  const normalized: CmsNavigationItem[] = items
    .filter((item): item is Partial<CmsNavigationItem> => typeof item === "object" && item !== null)
    .map((item, index) => {
      const fallback = defaults[index] ?? defaults[defaults.length - 1];
      const sortOrder =
        typeof item.sortOrder === "number" && Number.isFinite(item.sortOrder)
          ? Math.max(1, Math.floor(item.sortOrder))
          : fallback.sortOrder;
      return {
        id: typeof item.id === "string" && item.id.trim() ? item.id.trim() : fallback.id,
        label:
          typeof item.label === "string" && item.label.trim()
            ? item.label.trim()
            : fallback.label,
        href:
          typeof item.href === "string" && item.href.trim()
            ? item.href.trim()
            : fallback.href,
        visible: typeof item.visible === "boolean" ? item.visible : true,
        sortOrder,
        type: item.type === "custom" ? "custom" : "page",
        target: item.target === "_blank" ? "_blank" : "_self",
      };
    });

  const deduped = normalized.filter(
    (item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index,
  );

  return sortNavigationItems(deduped.length > 0 ? deduped : defaults);
}

export function normalizeCmsPageContent<TSlug extends CmsPageSlug>(slug: TSlug, content: unknown): CmsPageContentMap[TSlug] {
  const schema = cmsPageSchemas[slug];
  const parsed = schema.safeParse(content);
  if (parsed.success) {
    if (slug === "global") {
      const globalContent = parsed.data as CmsPageContentMap["global"];
      return {
        ...globalContent,
        navigation: {
          ...globalContent.navigation,
          items: normalizeNavigationItems(globalContent.navigation.items),
        },
      } as CmsPageContentMap[TSlug];
    }
    return parsed.data as CmsPageContentMap[TSlug];
  }

  console.warn("Invalid CMS content detected", {
    slug,
    reason: parsed.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    })),
  });

  return getDefaultCmsPageContent(slug);
}

export function getDefaultCmsPageContent<TSlug extends CmsPageSlug>(slug: TSlug): CmsPageContentMap[TSlug] {
  return JSON.parse(JSON.stringify(defaultCmsPageContent[slug])) as CmsPageContentMap[TSlug];
}








