import { AFM_BRAND } from "@/styles/brand";

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
    logoUrl: AFM_BRAND.logoPath,
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
    {
      id: "dieburg",
      slug: "dieburg",
      label: "Dieburg",
      route: "/gebaeudereinigung-dieburg",
      shortLabel: "Dieburg",
      description:
        "Zuverlässige Gebäudereinigung für Büros, Praxen und Gewerbeobjekte in Dieburg.",
      proofPoint: "Geeignet für Innenstadt, Gewerbegebiete und angrenzende Standorte in und um Dieburg.",
      responseNote: "Anfragen aus Dieburg werden regional abgestimmt und zeitnah eingeplant.",
      nearbyAreas: ["Münster", "Groß-Zimmern", "Roßdorf", "Eppertshausen", "Messel"],
      seoTitle: "Gebäudereinigung Dieburg | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung in Dieburg für Büros, Praxen und Gewerbeobjekte. Regional geplant, transparent abgestimmt und schnell erreichbar.",
    },
    {
      id: "langen",
      slug: "langen",
      label: "Langen",
      route: "/gebaeudereinigung-langen",
      shortLabel: "Langen",
      description:
        "Professionelle Reinigung für Büros, Praxen und Gewerbeflächen in Langen.",
      proofPoint: "Passend für Objekte in Langen, Egelsbach und angrenzenden Gewerbegebieten.",
      responseNote: "Termine in Langen werden nach Objektgröße und Intervall priorisiert geplant.",
      nearbyAreas: ["Egelsbach", "Dreieich", "Neu-Isenburg", "Mörfelden", "Offenthal"],
      seoTitle: "Gebäudereinigung Langen | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung in Langen für Büros, Praxen und Gewerbeflächen. Zuverlässige Reinigungsteams und schnelle Terminabstimmung.",
    },
    {
      id: "seligenstadt",
      slug: "seligenstadt",
      label: "Seligenstadt",
      route: "/gebaeudereinigung-seligenstadt",
      shortLabel: "Seligenstadt",
      description:
        "Gründliche Gebäudereinigung für Unternehmen und Gewerbeobjekte in Seligenstadt.",
      proofPoint: "Optimal für Objekte in Seligenstadt, Froschhausen und dem nahen Umland.",
      responseNote: "Anfragen aus Seligenstadt werden mit festen Reinigungsfenstern eingeplant.",
      nearbyAreas: ["Hainburg", "Mainhausen", "Klein-Welzheim", "Froschhausen", "Zellhausen"],
      seoTitle: "Gebäudereinigung Seligenstadt | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung in Seligenstadt für Büros, Praxen und Gewerbe. Regional organisiert und zuverlässig ausgeführt.",
    },
    {
      id: "maintal",
      slug: "maintal",
      label: "Maintal",
      route: "/gebaeudereinigung-maintal",
      shortLabel: "Maintal",
      description:
        "Professionelle Reinigungslösungen für Unternehmen und Gewerbeobjekte in Maintal.",
      proofPoint: "Geeignet für Bischofsheim, Dörnigheim, Hochstadt und Wachenbuchen.",
      responseNote: "Termine in Maintal werden regional gebündelt und effizient eingeplant.",
      nearbyAreas: ["Hanau", "Offenbach", "Frankfurt-Fechenheim", "Bischofsheim", "Dörnigheim"],
      seoTitle: "Gebäudereinigung Maintal | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung in Maintal für Büros, Praxen und Gewerbeobjekte. Verlässliche Reinigungsleistung mit klarer Planung.",
    },
    {
      id: "rodgau",
      slug: "rodgau",
      label: "Rodgau",
      route: "/gebaeudereinigung-rodgau",
      shortLabel: "Rodgau",
      description:
        "Zuverlässige Gebäudereinigung für gewerbliche Objekte und Praxen in Rodgau.",
      proofPoint: "Passend für Jügesheim, Nieder-Roden, Dudenhofen, Hainhausen und Weiskirchen.",
      responseNote: "Anfragen aus Rodgau werden mit kurzen Reaktionszeiten bearbeitet.",
      nearbyAreas: ["Obertshausen", "Dietzenbach", "Seligenstadt", "Heusenstamm", "Offenbach"],
      seoTitle: "Gebäudereinigung Rodgau | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung in Rodgau für Büros, Praxen und Gewerbeobjekte. Regional betreut, gründlich umgesetzt und flexibel planbar.",
    },
    {
      id: "dreieich",
      slug: "dreieich",
      label: "Dreieich",
      route: "/gebaeudereinigung-dreieich",
      shortLabel: "Dreieich",
      description:
        "Gründliche Reinigung für Büros, Praxen und Unternehmen in Dreieich.",
      proofPoint: "Ideal für Sprendlingen, Buchschlag, Offenthal, Götzenhain und Dreieichenhain.",
      responseNote: "Termine in Dreieich werden nach Lage und Leistungsumfang abgestimmt.",
      nearbyAreas: ["Neu-Isenburg", "Langen", "Egelsbach", "Dietzenbach", "Frankfurt"],
      seoTitle: "Gebäudereinigung Dreieich | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung in Dreieich für Büros, Praxen und Gewerbeflächen. Transparente Abläufe und verlässliche Reinigungsteams.",
    },
    {
      id: "dietzenbach",
      slug: "dietzenbach",
      label: "Dietzenbach",
      route: "/gebaeudereinigung-dietzenbach",
      shortLabel: "Dietzenbach",
      description:
        "Professionelle Gebäudereinigung für Unternehmen und Gewerbeobjekte in Dietzenbach.",
      proofPoint: "Geeignet für Innenstadt, Steinberg und umliegende Gewerbegebiete.",
      responseNote: "Anfragen aus Dietzenbach werden zeitnah mit regionaler Tourenplanung umgesetzt.",
      nearbyAreas: ["Heusenstamm", "Dreieich", "Rodgau", "Offenbach", "Rödermark"],
      seoTitle: "Gebäudereinigung Dietzenbach | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung in Dietzenbach für Büros, Praxen und Gewerbe. Zuverlässiger Service mit planbaren Reinigungsintervallen.",
    },
    {
      id: "neu_isenburg",
      slug: "neu-isenburg",
      label: "Neu-Isenburg",
      route: "/gebaeudereinigung-neu-isenburg",
      shortLabel: "Neu-Isenburg",
      description:
        "Professionelle Reinigung für Büros, Praxen und Gewerbeobjekte in Neu-Isenburg.",
      proofPoint: "Passend für Innenstadt, Zeppelinheim, Gravenbruch und angrenzende Standorte.",
      responseNote: "Anfragen aus Neu-Isenburg werden bevorzugt und kurzfristig eingeplant.",
      nearbyAreas: ["Frankfurt", "Dreieich", "Langen", "Offenbach", "Heusenstamm"],
      seoTitle: "Gebäudereinigung Neu-Isenburg | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung in Neu-Isenburg für Unternehmen, Praxen und Gewerbe. Regional betreut und zuverlässig umgesetzt.",
    },
    {
      id: "muehlheim_am_main",
      slug: "muehlheim-am-main",
      label: "Mühlheim am Main",
      route: "/gebaeudereinigung-muehlheim-am-main",
      shortLabel: "Mühlheim",
      description:
        "Zuverlässige Gebäudereinigung für Gewerbeflächen, Büros und Praxen in Mühlheim am Main.",
      proofPoint: "Geeignet für Lämmerspiel, Dietesheim und zentrale Lagen in Mühlheim.",
      responseNote: "Termine in Mühlheim am Main werden regional koordiniert und flexibel geplant.",
      nearbyAreas: ["Offenbach", "Obertshausen", "Hanau", "Maintal", "Rodgau"],
      seoTitle: "Gebäudereinigung Mühlheim am Main | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung in Mühlheim am Main für Büros, Praxen und Gewerbeobjekte. Regional organisiert und gründlich durchgeführt.",
    },
    {
      id: "obertshausen",
      slug: "obertshausen",
      label: "Obertshausen",
      route: "/gebaeudereinigung-obertshausen",
      shortLabel: "Obertshausen",
      description:
        "Gründliche Reinigung für Unternehmen und Gewerbeobjekte in Obertshausen.",
      proofPoint: "Ideal für Hausen, Obertshausen und umliegende Gewerbestandorte.",
      responseNote: "Anfragen aus Obertshausen werden mit festen Ansprechpartnern betreut.",
      nearbyAreas: ["Mühlheim am Main", "Rodgau", "Heusenstamm", "Offenbach", "Hanau"],
      seoTitle: "Gebäudereinigung Obertshausen | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung in Obertshausen für Büros, Praxen und Gewerbeobjekte. Verlässliche Reinigung mit klarer regionaler Planung.",
    },
    {
      id: "bruchkoebel",
      slug: "bruchkoebel",
      label: "Bruchköbel",
      route: "/gebaeudereinigung-bruchkoebel",
      shortLabel: "Bruchköbel",
      description:
        "Professionelle Gebäudereinigung für Unternehmen und Praxen in Bruchköbel.",
      proofPoint: "Geeignet für Innenstadt, Roßdorf, Niederissigheim und Butterstadt.",
      responseNote: "Termine in Bruchköbel werden regional eingeplant und zügig umgesetzt.",
      nearbyAreas: ["Hanau", "Nidderau", "Erlensee", "Maintal", "Langenselbold"],
      seoTitle: "Gebäudereinigung Bruchköbel | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung in Bruchköbel für Büros, Praxen und Gewerbe. Regional verfügbar und zuverlässig organisiert.",
    },
    {
      id: "erlensee",
      slug: "erlensee",
      label: "Erlensee",
      route: "/gebaeudereinigung-erlensee",
      shortLabel: "Erlensee",
      description:
        "Zuverlässige Gebäudereinigung für Büros, Praxen und Gewerbeobjekte in Erlensee.",
      proofPoint: "Passend für Rückingen, Langendiebach und angrenzende Gewerbeflächen.",
      responseNote: "Anfragen aus Erlensee werden mit kurzen Vorlaufzeiten bearbeitet.",
      nearbyAreas: ["Hanau", "Bruchköbel", "Langenselbold", "Nidderau", "Maintal"],
      seoTitle: "Gebäudereinigung Erlensee | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung in Erlensee für Gewerbeobjekte, Büros und Praxen. Gründliche Reinigung mit regionaler Einsatzplanung.",
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
    {
      id: "gebaeudereinigung",
      label: "Gebäudereinigung",
      description:
        "Professionelle Gebäudereinigung für Büros, Praxen, Gewerbeobjekte und Gemeinschaftsflächen.",
    },
    {
      id: "fensterreinigung",
      label: "Fensterreinigung",
      description:
        "Gründliche Reinigung von Fenstern, Fensterrahmen und Glasflächen im Innen- und Außenbereich.",
    },
    {
      id: "sonderreinigung",
      label: "Sonderreinigung",
      description:
        "Individuelle Sonderreinigungen für besondere Anforderungen, sensible Bereiche und spezielle Anlässe.",
    },
    {
      id: "praxisreinigung",
      label: "Praxisreinigung",
      description:
        "Hygienische Reinigung für Arztpraxen, Behandlungsräume, Empfangsbereiche und Sanitärflächen.",
    },
    {
      id: "kanzleireinigung",
      label: "Kanzleireinigung",
      description:
        "Diskrete und zuverlässige Reinigung für Kanzleien, Besprechungsräume und Arbeitsplätze.",
    },
    {
      id: "bauendreinigung",
      label: "Bauendreinigung",
      description:
        "Gründliche Reinigung nach Bau-, Umbau- oder Renovierungsarbeiten für bezugsfertige Flächen.",
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
    {
      id: "fensterreinigung_frankfurt",
      route: "/fensterreinigung-frankfurt",
      regionId: "frankfurt_am_main",
      serviceId: "fensterreinigung",
      h1: "Fensterreinigung in Frankfurt am Main",
      seoTitle: "Fensterreinigung Frankfurt am Main | Aktive Facility Management",
      seoDescription:
        "Fensterreinigung in Frankfurt am Main für Büros, Praxen und Gewerbeobjekte. Saubere Glasflächen im Innen- und Außenbereich.",
      intro:
        "Fensterreinigung in Frankfurt am Main für klare Sicht und gepflegte Fassaden in Büro- und Gewerbeobjekten.",
    },
    {
      id: "sonderreinigung_frankfurt",
      route: "/sonderreinigung-frankfurt",
      regionId: "frankfurt_am_main",
      serviceId: "sonderreinigung",
      h1: "Sonderreinigung in Frankfurt am Main",
      seoTitle: "Sonderreinigung Frankfurt am Main | Aktive Facility Management",
      seoDescription:
        "Sonderreinigung in Frankfurt am Main für besondere Anforderungen und sensible Bereiche. Individuell geplant und gründlich umgesetzt.",
      intro:
        "Sonderreinigung in Frankfurt am Main für spezielle Reinigungsanforderungen in Gewerbe, Praxis und Verwaltung.",
    },
    {
      id: "praxisreinigung_frankfurt",
      route: "/praxisreinigung-frankfurt",
      regionId: "frankfurt_am_main",
      serviceId: "praxisreinigung",
      h1: "Praxisreinigung in Frankfurt am Main",
      seoTitle: "Praxisreinigung Frankfurt am Main | Aktive Facility Management",
      seoDescription:
        "Praxisreinigung in Frankfurt am Main für Behandlungsräume, Empfang und Sanitärbereiche. Hygienisch, zuverlässig und planbar.",
      intro:
        "Praxisreinigung in Frankfurt am Main mit hygienischer Ausführung für Arztpraxen und medizinische Einrichtungen.",
    },
    {
      id: "kanzleireinigung_frankfurt",
      route: "/kanzleireinigung-frankfurt",
      regionId: "frankfurt_am_main",
      serviceId: "kanzleireinigung",
      h1: "Kanzleireinigung in Frankfurt am Main",
      seoTitle: "Kanzleireinigung Frankfurt am Main | Aktive Facility Management",
      seoDescription:
        "Kanzleireinigung in Frankfurt am Main für Besprechungsräume, Arbeitsplätze und Empfangsbereiche. Diskret und zuverlässig umgesetzt.",
      intro:
        "Kanzleireinigung in Frankfurt am Main für gepflegte Arbeitsumgebungen mit diskreter und verlässlicher Durchführung.",
    },
    {
      id: "bauendreinigung_frankfurt",
      route: "/bauendreinigung-frankfurt",
      regionId: "frankfurt_am_main",
      serviceId: "bauendreinigung",
      h1: "Bauendreinigung in Frankfurt am Main",
      seoTitle: "Bauendreinigung Frankfurt am Main | Aktive Facility Management",
      seoDescription:
        "Bauendreinigung in Frankfurt am Main nach Bau-, Umbau- oder Renovierungsarbeiten. Gründlich gereinigt für bezugsfertige Flächen.",
      intro:
        "Bauendreinigung in Frankfurt am Main für saubere und bezugsfertige Gewerbe- und Praxisflächen nach Abschluss der Arbeiten.",
    },
    {
      id: "glasreinigung_hanau",
      route: "/glasreinigung-hanau",
      regionId: "hanau",
      serviceId: "glasreinigung",
      h1: "Glasreinigung in Hanau",
      seoTitle: "Glasreinigung Hanau | Aktive Facility Management",
      seoDescription:
        "Glasreinigung in Hanau für Fenster, Glasfassaden und Eingangsbereiche. Streifenfreie Ergebnisse für gewerbliche Objekte.",
      intro:
        "Glasreinigung in Hanau für klare Fensterflächen und gepflegte Eingangsbereiche in Gewerbeobjekten.",
    },
    {
      id: "treppenhausreinigung_hanau",
      route: "/treppenhausreinigung-hanau",
      regionId: "hanau",
      serviceId: "treppenhausreinigung",
      h1: "Treppenhausreinigung in Hanau",
      seoTitle: "Treppenhausreinigung Hanau | Aktive Facility Management",
      seoDescription:
        "Treppenhausreinigung in Hanau für Wohn- und Gewerbeobjekte. Saubere Eingangsbereiche mit festen Reinigungsintervallen.",
      intro:
        "Treppenhausreinigung in Hanau mit planbaren Intervallen für gepflegte Allgemeinflächen und Eingänge.",
    },
    {
      id: "buero_reinigung_hanau",
      route: "/buero-reinigung-hanau",
      regionId: "hanau",
      serviceId: "buero_reinigung",
      h1: "Büroreinigung in Hanau",
      seoTitle: "Büroreinigung Hanau | Aktive Facility Management",
      seoDescription:
        "Büroreinigung in Hanau für Arbeitsplätze, Besprechungsräume und Gemeinschaftsflächen. Zuverlässig, gründlich und regelmäßig.",
      intro:
        "Büroreinigung in Hanau für saubere Arbeitsplätze, Konferenzräume und Sanitärbereiche im laufenden Betrieb.",
    },
    {
      id: "gebaeudereinigung_hanau",
      route: "/gebaeudereinigung-hanau",
      regionId: "hanau",
      serviceId: "gebaeudereinigung",
      h1: "Gebäudereinigung in Hanau",
      seoTitle: "Gebäudereinigung Hanau | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung in Hanau für Büros, Praxen und Gewerbeobjekte. Regional abgestimmt und professionell durchgeführt.",
      intro:
        "Gebäudereinigung in Hanau für Unternehmen mit verlässlicher Einsatzplanung und klar definierten Leistungen.",
    },
    {
      id: "glasreinigung_kreis_offenbach",
      route: "/glasreinigung-kreis-offenbach",
      regionId: "kreis_offenbach",
      serviceId: "glasreinigung",
      h1: "Glasreinigung im Kreis Offenbach",
      seoTitle: "Glasreinigung Kreis Offenbach | Aktive Facility Management",
      seoDescription:
        "Glasreinigung im Kreis Offenbach für Fenster, Fassaden und Eingangsbereiche. Streifenfreie Pflege für gewerbliche Objekte.",
      intro:
        "Glasreinigung im Kreis Offenbach für gepflegte Fensterflächen und Eingänge in Büro- und Gewerbeimmobilien.",
    },
    {
      id: "treppenhausreinigung_kreis_offenbach",
      route: "/treppenhausreinigung-kreis-offenbach",
      regionId: "kreis_offenbach",
      serviceId: "treppenhausreinigung",
      h1: "Treppenhausreinigung im Kreis Offenbach",
      seoTitle: "Treppenhausreinigung Kreis Offenbach | Aktive Facility Management",
      seoDescription:
        "Treppenhausreinigung im Kreis Offenbach für Wohn- und Gewerbeobjekte. Saubere Allgemeinflächen mit festen Intervallen.",
      intro:
        "Treppenhausreinigung im Kreis Offenbach für gepflegte Eingangsbereiche und dauerhaft saubere Allgemeinflächen.",
    },
    {
      id: "buero_reinigung_kreis_offenbach",
      route: "/buero-reinigung-kreis-offenbach",
      regionId: "kreis_offenbach",
      serviceId: "buero_reinigung",
      h1: "Büroreinigung im Kreis Offenbach",
      seoTitle: "Büroreinigung Kreis Offenbach | Aktive Facility Management",
      seoDescription:
        "Büroreinigung im Kreis Offenbach für Arbeitsplätze, Besprechungsräume und Gemeinschaftsflächen. Regelmäßig und zuverlässig.",
      intro:
        "Büroreinigung im Kreis Offenbach für saubere Arbeitsumgebungen mit klarer Abstimmung und festen Reinigungsplänen.",
    },
    {
      id: "gebaeudereinigung_kreis_offenbach",
      route: "/gebaeudereinigung-kreis-offenbach",
      regionId: "kreis_offenbach",
      serviceId: "gebaeudereinigung",
      h1: "Gebäudereinigung im Kreis Offenbach",
      seoTitle: "Gebäudereinigung Kreis Offenbach | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung im Kreis Offenbach für Büros, Praxen und Gewerbeobjekte. Regional organisiert und professionell umgesetzt.",
      intro:
        "Gebäudereinigung im Kreis Offenbach mit zuverlässigen Teams für Büro-, Praxis- und Gewerbeflächen.",
    },
  ] satisfies RegionalServiceRoute[],
} as const;

export const getCopyrightLine = (year = new Date().getFullYear()) =>
  `© ${year} ${companyConfig.brand.legalName}. Alle Rechte vorbehalten.`;



