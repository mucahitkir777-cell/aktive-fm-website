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
      ctaLabel: "Angebot anfragen",
      ctaHref: "/kontakt",
    },
    siteStatus: "live",
    footer: {
      footerText: "Ihr zuverlässiger Partner für professionelle Gebäudereinigung in Neu-Isenburg und Umgebung. Qualität, die man sieht.",
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
        "Zuverlässige Gebäudereinigung für Unternehmen in Neu-Isenburg und Umgebung - pünktlich, gründlich und diskret. Damit Sie sich auf Ihr Kerngeschäft konzentrieren können.",
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
    reviews: {
      title: "Bewertungen & Vertrauen",
      subtitle: "Unabhängige Plattformen bestätigen unsere Qualität und Zuverlässigkeit im täglichen Einsatz.",
      googleImageUrl: "/assets/review-logos/google.svg",
      googleScore: "5,0",
      googleLabel: "Kundenrezensionen",
      trustpilotImageUrl: "/assets/review-logos/trustpilot.svg",
      trustpilotScore: "5,0",
      trustpilotLabel: "Verifizierte Bewertungen",
      provenexpertImageUrl: "/assets/review-logos/provenexpert.png",
      provenexpertScore: "SEHR GUT",
      provenexpertLabel: "Empfehlungen",
    },
    finalCta: {
      title: "Bereit für saubere Ergebnisse?",
      body:
        "Fordern Sie jetzt Ihr kostenloses Angebot für Neu-Isenburg und Umgebung an. Wir melden uns innerhalb von 24 Stunden bei Ihnen.",
      primaryButtonText: "Jetzt Angebot anfragen",
      imageUrl: "",
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








