import { cmsPageSchemas } from "./schemas";
import type { CmsPageContentMap } from "./definitions";
import type { CmsNavigationItem, CmsPageSlug } from "./types";
export const defaultCmsPageContent: CmsPageContentMap = {
  global: {
    navigation: {
      items: [
        { id: "home", label: "Startseite", href: "/", visible: true, sortOrder: 1, type: "page", target: "_self" },
        { id: "services", label: "Leistungen", href: "/leistungen", visible: true, sortOrder: 2, type: "page", target: "_self" },
        { id: "about", label: "Ãœber uns", href: "/ueber-uns", visible: true, sortOrder: 3, type: "page", target: "_self" },
        { id: "faq", label: "FAQ", href: "/faq", visible: true, sortOrder: 4, type: "page", target: "_self" },
        { id: "contact", label: "Kontakt", href: "/kontakt", visible: true, sortOrder: 5, type: "page", target: "_self" },
      ],
      ctaLabel: "Angebot anfragen",
      ctaHref: "/kontakt",
    },
    siteStatus: "live",
    footer: {
      footerText: "Ihr zuverlÃ¤ssiger Partner fÃ¼r professionelle GebÃ¤udereinigung in Neu-Isenburg und Umgebung. QualitÃ¤t, die man sieht.",
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
      addressLines: "SchleussnerstraÃŸe 90\n63263 Neu-Isenburg",
      hoursLabel: "Ã–ffnungszeiten",
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
      accentTitle: "die Ã¼berzeugt.",
      subtitle:
        "ZuverlÃ¤ÃŸige GebÃ¤udereinigung fÃ¼r Unternehmen in Neu-Isenburg und Umgebung - pÃ¼nktlich, grÃ¼ndlich und diskret. Damit Sie sich auf Ihr KerngeschÃ¤ft konzentrieren kÃ¶nnen.",
      primaryButtonText: "Kostenloses Angebot",
      imageUrl: "",
    },
    services: {
      title: "Unsere Leistungen",
      subtitle:
        "Von der tÃ¤glichen BÃ¼roreinigung bis zur Glasfassade â€“ wir bieten das vollstÃ¤ndige Spektrum professioneller GebÃ¤udereinigung.",
      buttonText: "Alle Leistungen ansehen",
      imageUrl: "",
    },
    usps: {
      title: "Warum Unternehmen uns vertrauen",
      imageUrl: "",
      subtitle:
        "Wir sind kein anonymer GroÃŸbetrieb. Als mittelstÃ¤ndisches Reinigungsunternehmen kennen wir unsere Kunden persÃ¶nlich und arbeiten mit festen Teams â€“ fÃ¼r gleichbleibende QualitÃ¤t und echtes Vertrauen.",
    },
    finalCta: {
      title: "Bereit fÃ¼r saubere Ergebnisse?",
      body:
        "Fordern Sie jetzt Ihr kostenloses Angebot fÃ¼r Neu-Isenburg und Umgebung an. Wir melden uns innerhalb von 24 Stunden bei Ihnen.",
      primaryButtonText: "Jetzt Angebot anfragen",
      imageUrl: "",
      seoTitle: "",
      seoDescription: "",
    },
    seo: {
      seoTitle: "GebÃ¤udereinigung in Neu-Isenburg und Umgebung | Aktive Facility Management",
      seoDescription:
        "Professionelle GebÃ¤udereinigung fÃ¼r Unternehmen in Neu-Isenburg und Umgebung. Jetzt kostenloses Angebot anfragen.",
    },
  },
  leistungen: {
    hero: {
      title: "Professionelle Reinigungsleistungen",
      subtitle: "Unser Team reinigt BÃ¼ro-, Praxis- und GewerbeflÃ¤chen mit hoher Sorgfalt und planbarer Frequenz.",
      buttonText: "Mehr erfahren",
      imageUrl: "",
    },
    overview: {
      title: "Unser Angebot im Ãœberblick",
      subtitle: "Von der Unterhaltsreinigung bis zur Grundreinigung: Wir bieten passgenaue LÃ¶sungen fÃ¼r Ihr Objekt.",
      imageUrl1: "",
      imageUrl2: "",
    },
    benefits: {
      title: "Ihre Vorteile",
      subtitle: "Feste Teams, transparente Preise und zuverlÃ¤ssige QualitÃ¤t â€“ so unterstÃ¼tzen wir Ihren GeschÃ¤ftsbetrieb.",
    },
    finalCta: {
      title: "Jetzt Angebot anfragen",
      body: "Fordern Sie ein individuelles Reinigungsangebot an und erhalten Sie eine kostenfreie Beratung fÃ¼r Ihr Unternehmen.",
      primaryButtonText: "Angebot anfragen",
      seoTitle: "",
      seoDescription: "",
    },
    seo: {
      seoTitle: "Leistungen fÃ¼r professionelle GebÃ¤udereinigung | Aktive Facility Management",
      seoDescription:
        "Unterhaltsreinigung, BÃ¼roreinigung, Glasreinigung und Sonderreinigung fÃ¼r Unternehmen in Neu-Isenburg und Umgebung.",
    },
  },
  "ueber-uns": {
    hero: {
      title: "Wir reinigen mit Vertrauen",
      subtitle: "Lernen Sie unser regionales Team kennen und erfahren Sie, wie wir QualitÃ¤t, Sicherheit und Service verbinden.",
      buttonText: "Mehr erfahren",
      imageUrl: "",
    },
    companyInfo: {
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
    },
    values: {
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
    },
    team: {
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
    },
    finalCta: {
      title: "Lernen Sie uns kennen",
      body: "Vereinbaren Sie ein unverbindliches GesprÃ¤ch und erfahren Sie, wie wir Ihre Reinigungsanforderungen umsetzen.",
      primaryButtonText: "Kontakt aufnehmen",
      seoTitle: "",
      seoDescription: "",
    },
    seo: {
      seoTitle: "Ãœber uns | Aktive Facility Management GebÃ¤udereinigung",
      seoDescription:
        "Lernen Sie das Team hinter Aktive Facility Management kennen. Festangestellte FachkrÃ¤fte, klare Prozesse und zuverlÃ¤ssige QualitÃ¤t.",
    },
  },
  faq: {
    hero: {
      title: "HÃ¤ufige Fragen",
      subtitle: "Antworten auf die wichtigsten Fragen zu unseren Reinigungsleistungen und unserem Service.",
      buttonText: "Mehr erfahren",
      imageUrl: "",
    },
    questions: {
      title: "FAQ",
      subtitle: "Die hÃ¤ufigsten Fragen unserer Kunden â€“ kurz und verstÃ¤ndlich beantwortet.",
      faqText:
        "Allgemeines|FÃ¼r welche Objekte bieten Sie Ihre Reinigungsleistungen an?|Wir reinigen gewerbliche Objekte aller Art: BÃ¼ros, Praxen, Kanzleien, Hotels, Einzelhandel und Industrieanlagen.\nAllgemeines|Wie schnell kann ich ein Angebot erhalten?|Nach Ihrer Anfrage melden wir uns in der Regel innerhalb von 24 Stunden.\nLeistungen & Ablauf|Wie hÃ¤ufig wird gereinigt?|Wir bieten tÃ¤gliche, wÃ¶chentliche oder individuelle Reinigungsintervalle an.\nLeistungen & Ablauf|Kann die Reinigung auÃŸerhalb unserer GeschÃ¤ftszeiten stattfinden?|Ja, wir reinigen auf Wunsch vor Arbeitsbeginn, nach Feierabend oder am Wochenende.\nQualitÃ¤t & Vertrauen|Wie stellen Sie gleichbleibende QualitÃ¤t sicher?|Durch feste Teams, Schulungen, Reinigungsprotokolle und persÃ¶nliche QualitÃ¤tskontrollen.\nVertrag & Kosten|Gibt es versteckte Kosten?|Nein. Unser Angebot ist transparent und vollstÃ¤ndig.",
    },
    finalCta: {
      title: "Noch Fragen?",
      body: "Rufen Sie uns an oder senden Sie uns eine Nachricht â€“ wir beraten Sie persÃ¶nlich und schnell.",
      primaryButtonText: "Jetzt kontaktieren",
      seoTitle: "",
      seoDescription: "",
    },
    seo: {
      seoTitle: "FAQ zur GebÃ¤udereinigung | Aktive Facility Management",
      seoDescription:
        "Antworten auf hÃ¤ufige Fragen zu Leistungen, Ablauf, Kosten und QualitÃ¤t unserer professionellen GebÃ¤udereinigung.",
    },
  },
  kontakt: {
    hero: {
      title: "Kontakt aufnehmen",
      subtitle: "Wir sind fÃ¼r Sie da â€“ schreiben Sie uns oder rufen Sie an. Wir melden uns schnellstmÃ¶glich zurÃ¼ck.",
      buttonText: "Anfrage senden",
      imageUrl: "",
    },
    contactInfo: {
      title: "Kontaktinformationen",
      subtitle: "Telefon, E-Mail und persÃ¶nliche Beratung â€“ alle Wege fÃ¼hren schnell zu uns.",
    },
    formSection: {
      title: "Senden Sie uns Ihre Anfrage",
      subtitle: "Nutzen Sie das Formular fÃ¼r Ihr Anliegen und wir melden uns innerhalb von 24 Stunden.",
      buttonText: "Nachricht senden",
    },
    seo: {
      seoTitle: "Kontakt | Aktive Facility Management GebÃ¤udereinigung",
      seoDescription:
        "Kontaktieren Sie Aktive Facility Management fÃ¼r ein kostenloses und unverbindliches Angebot zur GebÃ¤udereinigung in Neu-Isenburg und Umgebung.",
    },
  },
};

const legacyNavigationMapping = [
  { id: "home", label: "Startseite", href: "/", keyPrefix: "home" },
  { id: "services", label: "Leistungen", href: "/leistungen", keyPrefix: "services" },
  { id: "about", label: "Ãœber uns", href: "/ueber-uns", keyPrefix: "about" },
  { id: "faq", label: "FAQ", href: "/faq", keyPrefix: "faq" },
  { id: "contact", label: "Kontakt", href: "/kontakt", keyPrefix: "contact" },
] as const;

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

function migrateLegacyGlobalContent(content: unknown): unknown {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return content;
  }

  const typedContent = content as Record<string, unknown>;
  const navigation =
    typedContent.navigation && typeof typedContent.navigation === "object" && !Array.isArray(typedContent.navigation)
      ? (typedContent.navigation as Record<string, unknown>)
      : {};

  const hasLegacyKeys = legacyNavigationMapping.some((item) =>
    Object.prototype.hasOwnProperty.call(navigation, `${item.keyPrefix}Label`),
  );

  if (!hasLegacyKeys && Array.isArray(navigation.items)) {
    return {
      ...typedContent,
      navigation: {
        ...navigation,
        items: normalizeNavigationItems(navigation.items),
      },
    };
  }

  const existingById = new Map(
    normalizeNavigationItems(navigation.items).map((item) => [item.id, item] as const),
  );
  const migratedItems = legacyNavigationMapping.map((legacyItem, index) => {
    const existing = existingById.get(legacyItem.id);
    const label = navigation[`${legacyItem.keyPrefix}Label`];
    const href = navigation[`${legacyItem.keyPrefix}Href`];
    const visible = navigation[`${legacyItem.keyPrefix}Visible`];
    const sortOrder = navigation[`${legacyItem.keyPrefix}SortOrder`];
    return {
      id: legacyItem.id,
      label:
        typeof label === "string" && label.trim()
          ? label.trim()
          : (existing?.label ?? legacyItem.label),
      href:
        typeof href === "string" && href.trim()
          ? href.trim()
          : (existing?.href ?? legacyItem.href),
      visible: typeof visible === "boolean" ? visible : (existing?.visible ?? true),
      sortOrder:
        typeof sortOrder === "number" && Number.isFinite(sortOrder)
          ? Math.max(1, Math.floor(sortOrder))
          : (existing?.sortOrder ?? index + 1),
      type: existing?.type ?? "page",
      target: existing?.target ?? "_self",
    } satisfies CmsNavigationItem;
  });

  return {
    ...typedContent,
    navigation: {
      ...navigation,
      items: sortNavigationItems(migratedItems),
      ctaLabel:
        typeof navigation.ctaLabel === "string" && navigation.ctaLabel.trim()
          ? navigation.ctaLabel.trim()
          : defaultCmsPageContent.global.navigation.ctaLabel,
      ctaHref:
        typeof navigation.ctaHref === "string" && navigation.ctaHref.trim()
          ? navigation.ctaHref.trim()
          : defaultCmsPageContent.global.navigation.ctaHref,
    },
  };
}

export function normalizeCmsPageContent<TSlug extends CmsPageSlug>(slug: TSlug, content: unknown): CmsPageContentMap[TSlug] {
  const schema = cmsPageSchemas[slug];
  const candidateContent = slug === "global" ? migrateLegacyGlobalContent(content) : content;
  const parsed = schema.safeParse(candidateContent);
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

  return getDefaultCmsPageContent(slug);
}

export function getDefaultCmsPageContent<TSlug extends CmsPageSlug>(slug: TSlug): CmsPageContentMap[TSlug] {
  return JSON.parse(JSON.stringify(defaultCmsPageContent[slug])) as CmsPageContentMap[TSlug];
}






