export interface CompanyRegion {
  id: string;
  slug: string;
  label: string;
  route: string;
  shortLabel: string;
  description: string;
  proofPoint: string;
  responseNote: string;
  nearbyAreas: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface CompanyService {
  id: string;
  label: string;
  description: string;
}

export interface RegionalServiceRoute {
  id: string;
  route: string;
  regionId: string;
  serviceId: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
}

export const companyConfig = {
  brand: {
    name: "ProClean",
    legalName: "ProClean GmbH",
    initials: "PC",
    descriptor: "Gebäudereinigung",
    siteUrl: "https://www.proclean-gmbh.de",
    footerText:
      "Ihr zuverlässiger Partner für professionelle Gebäudereinigung im Rhein-Main-Gebiet. Qualität, die man sieht.",
    membershipLabel: "BIV Bundesinnungsverband",
  },
  seo: {
    title: "ProClean – Professionelle Gebäudereinigung im Rhein-Main-Gebiet",
    description:
      "ProClean GmbH – Ihr zuverlässiger Partner für professionelle Gebäudereinigung, Büroreinigung, Glasreinigung und Unterhaltsreinigung. Kostenlos & unverbindlich anfragen.",
    keywords:
      "Gebäudereinigung, Büroreinigung, Glasreinigung, Unterhaltsreinigung, Reinigungsservice, gewerbliche Reinigung, Grundreinigung, Sonderreinigung, Treppenhaus reinigen",
    ogTitle: "ProClean – Professionelle Gebäudereinigung",
    ogDescription:
      "Zuverlässige Gebäudereinigung für Unternehmen im Rhein-Main-Gebiet – pünktlich, gründlich und diskret. Jetzt kostenloses Angebot anfordern.",
    twitterDescription:
      "Zuverlässige Gebäudereinigung für Unternehmen im Rhein-Main-Gebiet – pünktlich, gründlich und diskret.",
  },
  contact: {
    phoneDisplay: "0800 000 000",
    phoneHref: "tel:+4900000000000",
    phoneInternational: "+4900000000000",
    email: "info@proclean-gmbh.de",
    emailHref: "mailto:info@proclean-gmbh.de",
    whatsappHref:
      "https://wa.me/4900000000000?text=Hallo%20ProClean%2C%20ich%20m%C3%B6chte%20ein%20Angebot%20f%C3%BCr%20Geb%C3%A4udereinigung%20anfordern.",
  },
  address: {
    street: "Musterstraße 1",
    postalCode: "12345",
    city: "Musterstadt",
    country: "Deutschland",
    countryCode: "DE",
    lines: ["Musterstraße 1", "12345 Musterstadt"],
    singleLine: "Musterstraße 1, 12345 Musterstadt",
  },
  legal: {
    managingDirector: "[Vorname Nachname]",
    registerCourt: "Amtsgericht Musterstadt",
    registerNumber: "HRB 00000",
    vatId: "DE 000 000 000",
    profession: "Gebäudereiniger",
    chamber: "Innung des Gebäudereiniger-Handwerks [Region]",
    providerNote:
      "Die auf dieser Website dargestellten Leistungen können durch die ProClean GmbH sowie durch verbundene Einzelunternehmen erbracht werden. Die Auftragsabwicklung, Rechnungsstellung und Haftung erfolgt jeweils durch das ausführende Unternehmen. Auf Anfrage teilen wir Ihnen mit, welches Unternehmen Ihren Auftrag ausführt.",
  },
  openingHours: {
    phoneAvailability: "Mo-Fr 7:00-18:00 Uhr",
    contactLines: ["Mo-Fr: 07:00-18:00 Uhr", "Sa: 08:00-14:00 Uhr"],
    footerLines: ["Mo-Fr: 07:00-18:00", "Sa: 08:00-14:00"],
    regionPageLines: ["Mo-Fr: 7:00-18:00 Uhr", "Sa: Nach Vereinbarung"],
    schema: [
      {
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "18:00",
      },
      {
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "14:00",
      },
    ],
  },
  metrics: {
    yearsExperience: 10,
    customers: 500,
    staff: 50,
    satisfactionPercent: 98,
    googleRating: "4.9★",
    responseTime: "24h",
  },
  regions: [
    {
      id: "kreis_offenbach",
      slug: "kreis-offenbach",
      label: "Kreis Offenbach",
      route: "/gebaeudereinigung-kreis-offenbach",
      shortLabel: "Offenbach",
      description:
        "Feste Reinigungsteams für Büros, Praxen und Gewerbeflächen im Kreis Offenbach.",
      proofPoint: "Ideal für Objekte in Offenbach, Neu-Isenburg, Dreieich, Dietzenbach und Umgebung.",
      responseNote: "Vor-Ort-Termine im Kreis Offenbach werden priorisiert eingeplant.",
      nearbyAreas: ["Offenbach", "Neu-Isenburg", "Dreieich", "Dietzenbach", "Rodgau"],
      seoTitle: "Gebäudereinigung Kreis Offenbach | ProClean",
      seoDescription:
        "Professionelle Gebäudereinigung im Kreis Offenbach für Büros, Praxen und Gewerbe. Regional geplant, transparent angefragt und schnell erreichbar.",
    },
    {
      id: "frankfurt_am_main",
      slug: "frankfurt",
      label: "Frankfurt am Main",
      route: "/gebaeudereinigung-frankfurt",
      shortLabel: "Frankfurt",
      description:
        "Zuverlässige Gebäudereinigung für Büros, Kanzleien, Praxen und Standorte in Frankfurt am Main.",
      proofPoint: "Passend für Innenstadt, Sachsenhausen, Niederrad, Ostend und Gewerbestandorte.",
      responseNote: "Termine in Frankfurt werden nach Stadtteil und Objektgröße geplant.",
      nearbyAreas: ["Innenstadt", "Sachsenhausen", "Niederrad", "Ostend", "Bockenheim"],
      seoTitle: "Gebäudereinigung Frankfurt am Main | ProClean",
      seoDescription:
        "Gebäudereinigung in Frankfurt am Main für Büros, Kanzleien, Praxen und Gewerbeflächen. Jetzt regionales Reinigungsangebot anfragen.",
    },
    {
      id: "hanau",
      slug: "hanau",
      label: "Hanau",
      route: "/gebaeudereinigung-hanau",
      shortLabel: "Hanau",
      description:
        "Professionelle Reinigung für Unternehmen, Verwaltungen und Gewerbeobjekte in Hanau.",
      proofPoint: "Geeignet für Hanau, Steinheim, Großauheim, Kesselstadt und angrenzende Gewerbegebiete.",
      responseNote: "Anfragen aus Hanau können mit umliegenden Rhein-Main-Routen gebündelt werden.",
      nearbyAreas: ["Steinheim", "Großauheim", "Kesselstadt", "Wolfgang", "Maintal"],
      seoTitle: "Gebäudereinigung Hanau | ProClean",
      seoDescription:
        "Professionelle Gebäudereinigung in Hanau für Unternehmen, Verwaltungen und Gewerbeobjekte. Anfrage mit Region und Leistung starten.",
    },
  ] satisfies CompanyRegion[],
  services: [
    {
      id: "buero_reinigung",
      label: "Büroreinigung",
      description: "Regelmäßige Reinigung von Arbeitsplätzen, Konferenzräumen und Gemeinschaftsflächen.",
    },
    {
      id: "unterhaltsreinigung",
      label: "Unterhaltsreinigung",
      description: "Laufende Pflege nach abgestimmtem Reinigungsplan.",
    },
    {
      id: "glasreinigung",
      label: "Glasreinigung",
      description: "Streifenfreie Reinigung von Fenstern, Glasflächen und Eingangsbereichen.",
    },
    {
      id: "treppenhausreinigung",
      label: "Treppenhausreinigung",
      description: "Pflege von Treppenhäusern, Eingangsbereichen und Allgemeinflächen.",
    },
    {
      id: "grundreinigung",
      label: "Grundreinigung",
      description: "Intensive Reinigung für beanspruchte Flächen oder besondere Anlässe.",
    },
  ] satisfies CompanyService[],
  regionalServiceRoutes: [
    {
      id: "buero_reinigung_frankfurt",
      route: "/buero-reinigung-frankfurt",
      regionId: "frankfurt_am_main",
      serviceId: "buero_reinigung",
      h1: "Büroreinigung in Frankfurt am Main",
      seoTitle: "Büroreinigung Frankfurt am Main | ProClean",
      seoDescription:
        "Büroreinigung in Frankfurt am Main für Büros, Kanzleien und Praxen. Regelmäßige Reinigung mit klarer Abstimmung und schneller Anfrage.",
      intro:
        "Regelmäßige Büroreinigung für Frankfurter Arbeitsplätze, Besprechungsräume, Küchen und Sanitärbereiche.",
    },
    {
      id: "treppenhausreinigung_frankfurt",
      route: "/treppenhausreinigung-frankfurt",
      regionId: "frankfurt_am_main",
      serviceId: "treppenhausreinigung",
      h1: "Treppenhausreinigung in Frankfurt am Main",
      seoTitle: "Treppenhausreinigung Frankfurt am Main | ProClean",
      seoDescription:
        "Treppenhausreinigung in Frankfurt am Main für Wohn- und Gewerbeobjekte. Saubere Eingangsbereiche, klare Intervalle und regionale Planung.",
      intro:
        "Treppenhausreinigung für Frankfurter Wohn- und Gewerbeobjekte mit festen Intervallen und nachvollziehbaren Leistungen.",
    },
    {
      id: "glasreinigung_frankfurt",
      route: "/glasreinigung-frankfurt",
      regionId: "frankfurt_am_main",
      serviceId: "glasreinigung",
      h1: "Glasreinigung in Frankfurt am Main",
      seoTitle: "Glasreinigung Frankfurt am Main | ProClean",
      seoDescription:
        "Glasreinigung in Frankfurt am Main für Fenster, Glasflächen und Eingangsbereiche. Streifenfreie Reinigung für gewerbliche Objekte.",
      intro:
        "Glasreinigung für Frankfurter Gewerbeflächen, Fensterfronten und Eingangsbereiche mit sauberer Terminplanung.",
    },
  ] satisfies RegionalServiceRoute[],
} as const;

export const getCopyrightLine = (year = new Date().getFullYear()) =>
  `© ${year} ${companyConfig.brand.legalName}. Alle Rechte vorbehalten.`;
