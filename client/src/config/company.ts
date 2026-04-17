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
    name: "Aktive Facility Management",
    legalName: "Aktive Facility Management GmbH",
    initials: "AFM",
    descriptor: "Gebäudereinigung",
    siteUrl: "https://aktive-fm.de",
    footerText:
      "Ihr zuverlässiger Partner für professionelle Gebäudereinigung in Neu-Isenburg und Umgebung. Qualität, die man sieht.",
    membershipLabel: "BIV Bundesinnungsverband",
  },
  seo: {
    title: "Aktive Facility Management – Professionelle Gebäudereinigung in Neu-Isenburg und Umgebung",
    description:
      "Aktive Facility Management GmbH – Ihr zuverlässiger Partner für professionelle Gebäudereinigung in Neu-Isenburg und Umgebung. Kostenlos & unverbindlich anfragen.",
    keywords:
      "Gebäudereinigung, Büroreinigung, Glasreinigung, Unterhaltsreinigung, Reinigungsservice, gewerbliche Reinigung, Grundreinigung, Sonderreinigung, Treppenhaus reinigen",
    ogTitle: "Aktive Facility Management – Professionelle Gebäudereinigung",
    ogDescription:
      "Zuverlässige Gebäudereinigung für Unternehmen in Neu-Isenburg und Umgebung – pünktlich, gründlich und diskret. Jetzt kostenloses Angebot anfordern.",
    twitterDescription:
      "Zuverlässige Gebäudereinigung für Unternehmen in Neu-Isenburg und Umgebung – pünktlich, gründlich und diskret.",
  },
  regionMessaging: {
    primaryLabel: "Neu-Isenburg und Umgebung",
    coverageLabel: "Kreis Offenbach, Frankfurt am Main und Hanau",
    coverageDescription:
      "Wir betreuen Unternehmen in Neu-Isenburg, im Kreis Offenbach sowie in Frankfurt am Main und Hanau.",
  },
  contact: {
    phoneDisplay: "0178 6660021",
    phoneHref: "tel:+491786660021",
    phoneInternational: "+491786660021",
    email: "info@aktive-fm.de",
    emailHref: "mailto:info@aktive-fm.de",
    whatsappHref:
      "https://wa.me/491786660021?text=Hallo%20Aktive%20Facility%20Management%2C%20ich%20m%C3%B6chte%20ein%20Angebot%20f%C3%BCr%20Geb%C3%A4udereinigung%20anfordern.",
  },
  address: {
    street: "Schleussnerstraße 90",
    postalCode: "63263",
    city: "Neu-Isenburg",
    country: "Deutschland",
    countryCode: "DE",
    lines: ["Schleussnerstraße 90", "63263 Neu-Isenburg"],
    singleLine: "Schleussnerstraße 90, 63263 Neu-Isenburg",
  },
  legal: {
    managingDirector: "Mücahit Kir",
    registerCourt: "Amtsgericht Offenbach am Main",
    registerNumber: "HRB 49079",
    vatId: "DE 306064109",
    profession: "Gebäudereiniger",
    chamber: "Innung des Gebäudereiniger-Handwerks",
    editorialResponsibleName: "Mücahit Kir",
    editorialResponsibleAddressLines: ["Schleussnerstraße 90", "63263 Neu-Isenburg"],
    providerNote:
      "Die auf dieser Website dargestellten Leistungen werden durch die Aktive Facility Management GmbH erbracht.",
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
      seoTitle: "Gebäudereinigung Kreis Offenbach | Aktive Facility Management",
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
      seoTitle: "Gebäudereinigung Frankfurt am Main | Aktive Facility Management",
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
      responseNote: "Anfragen aus Hanau werden regional abgestimmt und zeitnah eingeplant.",
      nearbyAreas: ["Steinheim", "Großauheim", "Kesselstadt", "Wolfgang", "Maintal"],
      seoTitle: "Gebäudereinigung Hanau | Aktive Facility Management",
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
      seoTitle: "Büroreinigung Frankfurt am Main | Aktive Facility Management",
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
      seoTitle: "Treppenhausreinigung Frankfurt am Main | Aktive Facility Management",
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
      seoTitle: "Glasreinigung Frankfurt am Main | Aktive Facility Management",
      seoDescription:
        "Glasreinigung in Frankfurt am Main für Fenster, Glasflächen und Eingangsbereiche. Streifenfreie Reinigung für gewerbliche Objekte.",
      intro:
        "Glasreinigung für Frankfurter Gewerbeflächen, Fensterfronten und Eingangsbereiche mit sauberer Terminplanung.",
    },
  ] satisfies RegionalServiceRoute[],
} as const;

export const getCopyrightLine = (year = new Date().getFullYear()) =>
  `© ${year} ${companyConfig.brand.legalName}. Alle Rechte vorbehalten.`;


