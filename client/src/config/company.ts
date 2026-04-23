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

export interface RegionalServiceContentModule {
  summary: string;
  focusTitle: string;
  focusPoints: string[];
  suitableTitle: string;
  suitableFor: string[];
}

export const regionalServiceContentByServiceId: Record<string, RegionalServiceContentModule> = {
  buero_reinigung: {
    summary:
      "Büroreinigung braucht feste Abläufe, verlässliche Intervalle und eine saubere Abstimmung mit dem laufenden Betrieb.",
    focusTitle: "Typische Schwerpunkte",
    focusPoints: [
      "Arbeitsplätze, Konferenzräume und Empfangsbereiche",
      "Küchen, Sanitärflächen und Gemeinschaftszonen",
      "Reinigung vor, während oder nach den Bürozeiten",
    ],
    suitableTitle: "Geeignet für",
    suitableFor: [
      "Büros mit regelmäßigem Publikumsverkehr",
      "Verwaltungen und Agenturflächen",
      "Teams mit festen Reinigungsintervallen",
    ],
  },
  glasreinigung: {
    summary:
      "Glasreinigung wirkt besonders dann, wenn Fensterflächen, Eingänge und Sichtachsen regelmäßig gepflegt und streifenfrei gehalten werden.",
    focusTitle: "Typische Schwerpunkte",
    focusPoints: [
      "Fenster, Glasfronten und Eingangsbereiche",
      "Innenverglasung und Trennwände",
      "Abgestimmte Intervalle für dauerhaft gepflegte Glasflächen",
    ],
    suitableTitle: "Geeignet für",
    suitableFor: [
      "Büro- und Gewerbeimmobilien mit Glasanteil",
      "Praxen mit repräsentativen Empfangsflächen",
      "Objekte mit hohem Sichtbarkeitsanspruch",
    ],
  },
  fensterreinigung: {
    summary:
      "Fensterreinigung schafft klare Sicht, verbessert den Gesamteindruck des Standorts und ergänzt laufende Reinigungsintervalle sinnvoll.",
    focusTitle: "Typische Schwerpunkte",
    focusPoints: [
      "Fensterrahmen, Glasflächen und Sichtbereiche",
      "Reinigung im Innen- und Außenbereich",
      "Planbare Einsätze für wiederkehrend saubere Fensterflächen",
    ],
    suitableTitle: "Geeignet für",
    suitableFor: [
      "Büros mit Schaufenster- oder Fassadenflächen",
      "Praxen mit hohem Sauberkeitseindruck im Empfang",
      "Gewerbeobjekte mit regelmäßigem Reinigungsbedarf",
    ],
  },
  treppenhausreinigung: {
    summary:
      "Treppenhausreinigung hält Eingänge, Laufwege und Allgemeinflächen im Alltag sauber und sorgt für einen gepflegten ersten Eindruck.",
    focusTitle: "Typische Schwerpunkte",
    focusPoints: [
      "Treppenhäuser, Flure und Eingangsbereiche",
      "Geländer, Briefkastenanlagen und Aufzugszonen",
      "Feste Reinigungsintervalle für Allgemeinflächen",
    ],
    suitableTitle: "Geeignet für",
    suitableFor: [
      "Wohn- und Gewerbeobjekte mit mehreren Nutzungseinheiten",
      "Objekte mit stark frequentierten Eingängen",
      "Immobilien mit dauerhaftem Pflegebedarf in Allgemeinflächen",
    ],
  },
  praxisreinigung: {
    summary:
      "Praxisreinigung verlangt hygienische Abläufe, klare Zuständigkeiten und ein sauberes Umfeld für Patienten, Team und Empfang.",
    focusTitle: "Typische Schwerpunkte",
    focusPoints: [
      "Behandlungsräume, Empfang und Wartezonen",
      "Sanitärflächen und häufig berührte Kontaktpunkte",
      "Abgestimmte Reinigung außerhalb sensibler Betriebszeiten",
    ],
    suitableTitle: "Geeignet für",
    suitableFor: [
      "Arztpraxen und medizinische Einrichtungen",
      "Physio-, Therapie- und Behandlungsräume",
      "Praxen mit planbaren Hygieneintervallen",
    ],
  },
  sonderreinigung: {
    summary:
      "Sonderreinigung deckt Anforderungen ab, die über Standardintervalle hinausgehen und individuell nach Objekt, Anlass und Aufwand geplant werden.",
    focusTitle: "Typische Schwerpunkte",
    focusPoints: [
      "Sensible Bereiche mit erhöhtem Reinigungsanspruch",
      "Einmalige Sonderaufträge und Zusatzleistungen",
      "Abgestimmte Leistungen für besondere Anforderungen vor Ort",
    ],
    suitableTitle: "Geeignet für",
    suitableFor: [
      "Objekte mit individuellem Reinigungsbedarf",
      "Zusatzleistungen bei besonderen Anlässen",
      "Bereiche mit erhöhten Sauberkeitsanforderungen",
    ],
  },
  kanzleireinigung: {
    summary:
      "Kanzleireinigung braucht Diskretion, ruhige Abläufe und saubere Arbeitsbereiche für Mandantenkontakt, Besprechung und konzentriertes Arbeiten.",
    focusTitle: "Typische Schwerpunkte",
    focusPoints: [
      "Arbeitsplätze, Besprechungsräume und Empfang",
      "Sanitärflächen, Küchen und Gemeinschaftsbereiche",
      "Diskrete Reinigung außerhalb des Tagesgeschäfts",
    ],
    suitableTitle: "Geeignet für",
    suitableFor: [
      "Kanzleien und Beratungsbüros",
      "Objekte mit anspruchsvollem Mandantenempfang",
      "Standorte mit Bedarf an diskreten Reinigungsabläufen",
    ],
  },
  bauendreinigung: {
    summary:
      "Bauendreinigung sorgt nach Bau-, Umbau- oder Renovierungsarbeiten dafür, dass Flächen sauber, nutzbar und bezugsfertig übergeben werden können.",
    focusTitle: "Typische Schwerpunkte",
    focusPoints: [
      "Entfernung von Bau- und Renovierungsrückständen",
      "Feinreinigung vor Übergabe oder Nutzung",
      "Aufbereitung von Böden, Fenstern und Oberflächen",
    ],
    suitableTitle: "Geeignet für",
    suitableFor: [
      "Büro- und Praxisflächen vor Inbetriebnahme",
      "Umbau- und Renovierungsprojekte",
      "Objekte mit Bedarf an bezugsfertiger Übergabe",
    ],
  },
};

export const companyConfig = {
  brand: {
    name: "Aktive Facility Management",
    legalName: "Aktive Facility Management GmbH",
    initials: "AFM",
    descriptor: "Gebäudereinigung",
    logoUrl: AFM_BRAND.logoPath,
    siteUrl: "https://www.aktive-fm.de",
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
        "Gebäudereinigung im Kreis Offenbach für Bürostandorte, Praxen und Gewerbeobjekte mit festen Einsatzplänen.",
      proofPoint: "Abdeckung für Offenbach, Neu-Isenburg, Dreieich, Dietzenbach, Rodgau und umliegende Gewerbeachsen.",
      responseNote: "Anfragen aus dem Kreis Offenbach erhalten feste Ansprechpartner und klare Einsatzfenster.",
      nearbyAreas: ["Offenbach", "Neu-Isenburg", "Dreieich", "Dietzenbach", "Rodgau"],
      seoTitle: "Gebäudereinigung Kreis Offenbach für Gewerbeobjekte | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung im Kreis Offenbach für Büros, Praxen und Gewerbeflächen. Planbare Reinigungsintervalle, kurze Wege und verbindliche Objektbetreuung.",
    },
    {
      id: "frankfurt_am_main",
      slug: "frankfurt",
      label: "Frankfurt am Main",
      route: "/gebaeudereinigung-frankfurt",
      shortLabel: "Frankfurt",
      description:
        "Gebäudereinigung Frankfurt für Büros, Kanzleien, Praxen und Gewerbeflächen mit klaren Leistungsplänen.",
      proofPoint: "Einsätze in Innenstadt, Bankenviertel, Sachsenhausen, Niederrad, Ostend und Bockenheim.",
      responseNote: "Frankfurt-Anfragen werden nach Objektart, Stadtteil und Reinigungsintervall verbindlich getaktet.",
      nearbyAreas: ["Innenstadt", "Sachsenhausen", "Niederrad", "Ostend", "Bockenheim"],
      seoTitle: "Gebäudereinigung Frankfurt für Büro, Praxis und Gewerbe | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung Frankfurt mit festen Teams für Büroreinigung, Praxisreinigung und Objektpflege. Klare Prozesse für stark frequentierte Standorte.",
    },
    {
      id: "hanau",
      slug: "hanau",
      label: "Hanau",
      route: "/gebaeudereinigung-hanau",
      shortLabel: "Hanau",
      description:
        "Gebäudereinigung Hanau für Unternehmen, Verwaltungen und Gewerbeobjekte mit strukturierten Reinigungsabläufen.",
      proofPoint: "Abdeckung für Hanau-Zentrum, Steinheim, Großauheim, Kesselstadt und angrenzende Gewerbestandorte.",
      responseNote: "Hanau-Anfragen werden mit klaren Leistungspaketen und festen Einsatzzeiten geplant.",
      nearbyAreas: ["Steinheim", "Großauheim", "Kesselstadt", "Wolfgang", "Maintal"],
      seoTitle: "Gebäudereinigung Hanau für Büro und Gewerbe | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung Hanau für Büros, Praxen und Gewerbeflächen. Verbindliche Intervalle, transparente Leistungen und regionale Objektbetreuung.",
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
        "Gebäudereinigung Langen für Büroeinheiten, Praxen und Gewerbeobjekte mit festen Reinigungsstandards.",
      proofPoint: "Starke Abdeckung in Langen, Egelsbach und entlang der gewerblichen Entwicklungsflächen.",
      responseNote: "Langen-Anfragen erhalten eine konkrete Taktung nach Objektgröße, Nutzung und Leistungsumfang.",
      nearbyAreas: ["Egelsbach", "Dreieich", "Neu-Isenburg", "Mörfelden", "Offenthal"],
      seoTitle: "Gebäudereinigung Langen für Praxen und Gewerbeflächen | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung Langen für Büros, Praxen und Gewerbeobjekte. Planbare Reinigungseinsätze mit klarer regionaler Einsatzsteuerung.",
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
        "Gebäudereinigung Rodgau für Gewerbestandorte, Büroflächen und Praxisräume mit klar definierten Leistungen.",
      proofPoint: "Einsatzgebiete in Jügesheim, Nieder-Roden, Dudenhofen, Hainhausen und Weiskirchen.",
      responseNote: "Rodgau-Anfragen werden direkt auf Objektgröße, Intervall und Einsatzfenster abgestimmt.",
      nearbyAreas: ["Obertshausen", "Dietzenbach", "Seligenstadt", "Heusenstamm", "Offenbach"],
      seoTitle: "Gebäudereinigung Rodgau für Unternehmen und Praxen | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung Rodgau für Büros, Praxen und Gewerbeobjekte. Strukturierte Reinigungspläne für laufenden Betrieb und klare Verantwortlichkeiten.",
    },
    {
      id: "dreieich",
      slug: "dreieich",
      label: "Dreieich",
      route: "/gebaeudereinigung-dreieich",
      shortLabel: "Dreieich",
      description:
        "Gebäudereinigung Dreieich für Bürokomplexe, Praxen und Gewerbeeinheiten mit klarer Prozessführung.",
      proofPoint: "Objektbetreuung in Sprendlingen, Buchschlag, Offenthal, Götzenhain und Dreieichenhain.",
      responseNote: "Dreieich-Anfragen werden nach Standort, Objektart und Leistungsumfang verbindlich geplant.",
      nearbyAreas: ["Neu-Isenburg", "Langen", "Egelsbach", "Dietzenbach", "Frankfurt"],
      seoTitle: "Gebäudereinigung Dreieich für Büro und Praxis | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung Dreieich für Büros, Praxen und Gewerbeflächen. Klare Leistungsverzeichnisse und feste Einsatzstrukturen.",
    },
    {
      id: "dietzenbach",
      slug: "dietzenbach",
      label: "Dietzenbach",
      route: "/gebaeudereinigung-dietzenbach",
      shortLabel: "Dietzenbach",
      description:
        "Gebäudereinigung Dietzenbach für Unternehmen, Praxen und gewerbliche Flächen mit planbaren Intervallen.",
      proofPoint: "Abdeckung für Innenstadt, Steinberg und die relevanten Gewerbezonen in Dietzenbach.",
      responseNote: "Dietzenbach-Anfragen werden mit festem Leistungsrahmen und regionaler Einsatzkoordination umgesetzt.",
      nearbyAreas: ["Heusenstamm", "Dreieich", "Rodgau", "Offenbach", "Rödermark"],
      seoTitle: "Gebäudereinigung Dietzenbach für Gewerbe und Praxis | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung Dietzenbach für Büros, Praxen und Gewerbeobjekte. Verbindliche Reinigungszyklen und saubere Objektorganisation.",
    },
    {
      id: "neu_isenburg",
      slug: "neu-isenburg",
      label: "Neu-Isenburg",
      route: "/gebaeudereinigung-neu-isenburg",
      shortLabel: "Neu-Isenburg",
      description:
        "Gebäudereinigung Neu-Isenburg für Büros, Praxen und Gewerbeobjekte mit verbindlicher Einsatzplanung.",
      proofPoint: "Objektservice in Innenstadt, Zeppelinheim, Gravenbruch und den angrenzenden Gewerbequartieren.",
      responseNote: "Neu-Isenburg-Anfragen werden direkt in feste Touren und klare Leistungsintervalle überführt.",
      nearbyAreas: ["Frankfurt", "Dreieich", "Langen", "Offenbach", "Heusenstamm"],
      seoTitle: "Gebäudereinigung Neu-Isenburg für Büro und Praxis | Aktive Facility Management",
      seoDescription:
        "Gebäudereinigung Neu-Isenburg für Unternehmen, Praxen und Gewerbeflächen. Klare Abläufe, feste Teams und regionaler Fokus.",
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
      h1: "Büroreinigung Frankfurt",
      seoTitle: "Büroreinigung Frankfurt für Büroflächen und Kanzleien | Aktive Facility Management",
      seoDescription:
        "Büroreinigung Frankfurt für Arbeitsplätze, Konferenzräume und Gemeinschaftszonen. Feste Reinigungsintervalle für laufenden Betrieb.",
      intro:
        "Büroreinigung Frankfurt mit klaren Leistungsplänen für Arbeitsplätze, Besprechungsräume, Küchen und Sanitärflächen.",
    },
    {
      id: "treppenhausreinigung_frankfurt",
      route: "/treppenhausreinigung-frankfurt",
      regionId: "frankfurt_am_main",
      serviceId: "treppenhausreinigung",
      h1: "Treppenhausreinigung Frankfurt",
      seoTitle: "Treppenhausreinigung Frankfurt für Wohn- und Gewerbeobjekte | Aktive Facility Management",
      seoDescription:
        "Treppenhausreinigung Frankfurt für Eingänge, Laufwege und Allgemeinflächen. Verbindliche Reinigungsintervalle für stark genutzte Objekte.",
      intro:
        "Treppenhausreinigung Frankfurt mit festen Takten für Treppenhäuser, Flure und Eingangsbereiche.",
    },
    {
      id: "glasreinigung_frankfurt",
      route: "/glasreinigung-frankfurt",
      regionId: "frankfurt_am_main",
      serviceId: "glasreinigung",
      h1: "Glasreinigung Frankfurt",
      seoTitle: "Glasreinigung Frankfurt für Fenster und Glasfassaden | Aktive Facility Management",
      seoDescription:
        "Glasreinigung Frankfurt für Fensterflächen, Glasfronten und Eingangsbereiche. Streifenfreie Ergebnisse für Büro- und Gewerbestandorte.",
      intro:
        "Glasreinigung Frankfurt mit abgestimmten Einsätzen für saubere Fensterflächen und repräsentative Eingangsbereiche.",
    },
    {
      id: "fensterreinigung_frankfurt",
      route: "/fensterreinigung-frankfurt",
      regionId: "frankfurt_am_main",
      serviceId: "fensterreinigung",
      h1: "Fensterreinigung Frankfurt",
      seoTitle: "Fensterreinigung Frankfurt für Büro und Gewerbe | Aktive Facility Management",
      seoDescription:
        "Fensterreinigung Frankfurt für Büros, Praxen und Gewerbeobjekte. Saubere Fensterflächen innen und außen mit klaren Intervallen.",
      intro:
        "Fensterreinigung Frankfurt für klare Sichtachsen, gepflegte Fassaden und saubere Rahmenflächen.",
    },
    {
      id: "sonderreinigung_frankfurt",
      route: "/sonderreinigung-frankfurt",
      regionId: "frankfurt_am_main",
      serviceId: "sonderreinigung",
      h1: "Sonderreinigung Frankfurt",
      seoTitle: "Sonderreinigung Frankfurt für spezielle Objektanforderungen | Aktive Facility Management",
      seoDescription:
        "Sonderreinigung Frankfurt für Sonderfälle, sensible Bereiche und objektbezogene Zusatzleistungen. Präzise geplant und sauber ausgeführt.",
      intro:
        "Sonderreinigung Frankfurt für Sonderlagen in Kanzleien, Praxen und Gewerbeobjekten mit sauber dokumentierter Ausführung.",
    },
    {
      id: "praxisreinigung_frankfurt",
      route: "/praxisreinigung-frankfurt",
      regionId: "frankfurt_am_main",
      serviceId: "praxisreinigung",
      h1: "Praxisreinigung Frankfurt",
      seoTitle: "Praxisreinigung Frankfurt für Arzt- und Therapiepraxen | Aktive Facility Management",
      seoDescription:
        "Praxisreinigung Frankfurt für Behandlungsräume, Empfangsflächen und Sanitärzonen. Hygienische Standards mit festen Reinigungsfenstern.",
      intro:
        "Praxisreinigung Frankfurt mit klaren Hygieneabläufen für medizinische Einrichtungen.",
    },
    {
      id: "kanzleireinigung_frankfurt",
      route: "/kanzleireinigung-frankfurt",
      regionId: "frankfurt_am_main",
      serviceId: "kanzleireinigung",
      h1: "Kanzleireinigung Frankfurt",
      seoTitle: "Kanzleireinigung Frankfurt für diskrete Büroreinigung | Aktive Facility Management",
      seoDescription:
        "Kanzleireinigung Frankfurt für Arbeitsplätze, Besprechungsräume und Mandantenempfang. Diskrete Reinigung mit festen Qualitätsstandards.",
      intro:
        "Kanzleireinigung Frankfurt für saubere, diskret gepflegte Arbeitsumgebungen in beratungsnahen Büros.",
    },
    {
      id: "bauendreinigung_frankfurt",
      route: "/bauendreinigung-frankfurt",
      regionId: "frankfurt_am_main",
      serviceId: "bauendreinigung",
      h1: "Bauendreinigung Frankfurt",
      seoTitle: "Bauendreinigung Frankfurt für bezugsfertige Übergaben | Aktive Facility Management",
      seoDescription:
        "Bauendreinigung Frankfurt nach Neu-, Um- und Ausbauprojekten. Rückstandsfreie Reinigung für bezugsfertige Büro- und Praxisflächen.",
      intro:
        "Bauendreinigung Frankfurt für bezugsfertige Übergaben in Büro-, Praxis- und Gewerbeflächen nach Bau- und Umbauarbeiten.",
    },
    {
      id: "glasreinigung_hanau",
      route: "/glasreinigung-hanau",
      regionId: "hanau",
      serviceId: "glasreinigung",
      h1: "Glasreinigung Hanau",
      seoTitle: "Glasreinigung Hanau für Fenster und Glasfassaden | Aktive Facility Management",
      seoDescription:
        "Glasreinigung Hanau für Fensterflächen, Glasfronten und Eingangsbereiche. Streifenfreie Ergebnisse für Büro- und Gewerbestandorte.",
      intro:
        "Glasreinigung Hanau mit abgestimmten Einsätzen für saubere Fensterflächen und repräsentative Eingangsbereiche.",
    },
    {
      id: "treppenhausreinigung_hanau",
      route: "/treppenhausreinigung-hanau",
      regionId: "hanau",
      serviceId: "treppenhausreinigung",
      h1: "Treppenhausreinigung Hanau",
      seoTitle: "Treppenhausreinigung Hanau für Wohn- und Gewerbeobjekte | Aktive Facility Management",
      seoDescription:
        "Treppenhausreinigung Hanau für Eingänge, Laufwege und Allgemeinflächen. Verbindliche Reinigungsintervalle für stark genutzte Objekte.",
      intro:
        "Treppenhausreinigung Hanau mit festen Takten für Treppenhäuser, Flure und Eingangsbereiche.",
    },
    {
      id: "buero_reinigung_hanau",
      route: "/buero-reinigung-hanau",
      regionId: "hanau",
      serviceId: "buero_reinigung",
      h1: "Büroreinigung Hanau",
      seoTitle: "Büroreinigung Hanau für Büroflächen und Kanzleien | Aktive Facility Management",
      seoDescription:
        "Büroreinigung Hanau für Arbeitsplätze, Konferenzräume und Gemeinschaftszonen. Feste Reinigungsintervalle für laufenden Betrieb.",
      intro:
        "Büroreinigung Hanau mit klaren Leistungsplänen für Arbeitsplätze, Besprechungsräume, Küchen und Sanitärflächen.",
    },
    {
      id: "glasreinigung_kreis_offenbach",
      route: "/glasreinigung-kreis-offenbach",
      regionId: "kreis_offenbach",
      serviceId: "glasreinigung",
      h1: "Glasreinigung Kreis Offenbach",
      seoTitle: "Glasreinigung Kreis Offenbach für Fenster und Glasfassaden | Aktive Facility Management",
      seoDescription:
        "Glasreinigung Kreis Offenbach für Fensterflächen, Glasfronten und Eingangsbereiche. Streifenfreie Ergebnisse für Büro- und Gewerbestandorte.",
      intro:
        "Glasreinigung Kreis Offenbach mit abgestimmten Einsätzen für saubere Fensterflächen und repräsentative Eingangsbereiche.",
    },
    {
      id: "treppenhausreinigung_kreis_offenbach",
      route: "/treppenhausreinigung-kreis-offenbach",
      regionId: "kreis_offenbach",
      serviceId: "treppenhausreinigung",
      h1: "Treppenhausreinigung Kreis Offenbach",
      seoTitle: "Treppenhausreinigung Kreis Offenbach für Wohn- und Gewerbeobjekte | Aktive Facility Management",
      seoDescription:
        "Treppenhausreinigung Kreis Offenbach für Eingänge, Laufwege und Allgemeinflächen. Verbindliche Reinigungsintervalle für stark genutzte Objekte.",
      intro:
        "Treppenhausreinigung Kreis Offenbach mit festen Takten für Treppenhäuser, Flure und Eingangsbereiche.",
    },
    {
      id: "buero_reinigung_kreis_offenbach",
      route: "/buero-reinigung-kreis-offenbach",
      regionId: "kreis_offenbach",
      serviceId: "buero_reinigung",
      h1: "Büroreinigung Kreis Offenbach",
      seoTitle: "Büroreinigung Kreis Offenbach für Büroflächen und Kanzleien | Aktive Facility Management",
      seoDescription:
        "Büroreinigung Kreis Offenbach für Arbeitsplätze, Konferenzräume und Gemeinschaftszonen. Feste Reinigungsintervalle für laufenden Betrieb.",
      intro:
        "Büroreinigung Kreis Offenbach mit klaren Leistungsplänen für Arbeitsplätze, Besprechungsräume, Küchen und Sanitärflächen.",
    },
    {
      id: "fensterreinigung_hanau",
      route: "/fensterreinigung-hanau",
      regionId: "hanau",
      serviceId: "fensterreinigung",
      h1: "Fensterreinigung Hanau",
      seoTitle: "Fensterreinigung Hanau für Büro und Gewerbe | Aktive Facility Management",
      seoDescription:
        "Fensterreinigung Hanau für Büros, Praxen und Gewerbeobjekte. Saubere Fensterflächen innen und außen mit klaren Intervallen.",
      intro:
        "Fensterreinigung Hanau für klare Sichtachsen, gepflegte Fassaden und saubere Rahmenflächen.",
    },
    {
      id: "praxisreinigung_hanau",
      route: "/praxisreinigung-hanau",
      regionId: "hanau",
      serviceId: "praxisreinigung",
      h1: "Praxisreinigung Hanau",
      seoTitle: "Praxisreinigung Hanau für Arzt- und Therapiepraxen | Aktive Facility Management",
      seoDescription:
        "Praxisreinigung Hanau für Behandlungsräume, Empfangsflächen und Sanitärzonen. Hygienische Standards mit festen Reinigungsfenstern.",
      intro:
        "Praxisreinigung Hanau mit klaren Hygieneabläufen für medizinische Einrichtungen.",
    },
    {
      id: "sonderreinigung_hanau",
      route: "/sonderreinigung-hanau",
      regionId: "hanau",
      serviceId: "sonderreinigung",
      h1: "Sonderreinigung Hanau",
      seoTitle: "Sonderreinigung Hanau für spezielle Objektanforderungen | Aktive Facility Management",
      seoDescription:
        "Sonderreinigung Hanau für Sonderfälle, sensible Bereiche und objektbezogene Zusatzleistungen. Präzise geplant und sauber ausgeführt.",
      intro:
        "Sonderreinigung Hanau für Sonderlagen in Kanzleien, Praxen und Gewerbeobjekten mit sauber dokumentierter Ausführung.",
    },
    {
      id: "kanzleireinigung_hanau",
      route: "/kanzleireinigung-hanau",
      regionId: "hanau",
      serviceId: "kanzleireinigung",
      h1: "Kanzleireinigung Hanau",
      seoTitle: "Kanzleireinigung Hanau für diskrete Büroreinigung | Aktive Facility Management",
      seoDescription:
        "Kanzleireinigung Hanau für Arbeitsplätze, Besprechungsräume und Mandantenempfang. Diskrete Reinigung mit festen Qualitätsstandards.",
      intro:
        "Kanzleireinigung Hanau für saubere, diskret gepflegte Arbeitsumgebungen in beratungsnahen Büros.",
    },
    {
      id: "bauendreinigung_hanau",
      route: "/bauendreinigung-hanau",
      regionId: "hanau",
      serviceId: "bauendreinigung",
      h1: "Bauendreinigung Hanau",
      seoTitle: "Bauendreinigung Hanau für bezugsfertige Übergaben | Aktive Facility Management",
      seoDescription:
        "Bauendreinigung Hanau nach Neu-, Um- und Ausbauprojekten. Rückstandsfreie Reinigung für bezugsfertige Büro- und Praxisflächen.",
      intro:
        "Bauendreinigung Hanau für bezugsfertige Übergaben in Büro-, Praxis- und Gewerbeflächen nach Bau- und Umbauarbeiten.",
    },
    {
      id: "fensterreinigung_kreis_offenbach",
      route: "/fensterreinigung-kreis-offenbach",
      regionId: "kreis_offenbach",
      serviceId: "fensterreinigung",
      h1: "Fensterreinigung Kreis Offenbach",
      seoTitle: "Fensterreinigung Kreis Offenbach für Büro und Gewerbe | Aktive Facility Management",
      seoDescription:
        "Fensterreinigung Kreis Offenbach für Büros, Praxen und Gewerbeobjekte. Saubere Fensterflächen innen und außen mit klaren Intervallen.",
      intro:
        "Fensterreinigung Kreis Offenbach für klare Sichtachsen, gepflegte Fassaden und saubere Rahmenflächen.",
    },
    {
      id: "praxisreinigung_kreis_offenbach",
      route: "/praxisreinigung-kreis-offenbach",
      regionId: "kreis_offenbach",
      serviceId: "praxisreinigung",
      h1: "Praxisreinigung Kreis Offenbach",
      seoTitle: "Praxisreinigung Kreis Offenbach für Arzt- und Therapiepraxen | Aktive Facility Management",
      seoDescription:
        "Praxisreinigung Kreis Offenbach für Behandlungsräume, Empfangsflächen und Sanitärzonen. Hygienische Standards mit festen Reinigungsfenstern.",
      intro:
        "Praxisreinigung Kreis Offenbach mit klaren Hygieneabläufen für medizinische Einrichtungen.",
    },
    {
      id: "sonderreinigung_kreis_offenbach",
      route: "/sonderreinigung-kreis-offenbach",
      regionId: "kreis_offenbach",
      serviceId: "sonderreinigung",
      h1: "Sonderreinigung Kreis Offenbach",
      seoTitle: "Sonderreinigung Kreis Offenbach für spezielle Objektanforderungen | Aktive Facility Management",
      seoDescription:
        "Sonderreinigung Kreis Offenbach für Sonderfälle, sensible Bereiche und objektbezogene Zusatzleistungen. Präzise geplant und sauber ausgeführt.",
      intro:
        "Sonderreinigung Kreis Offenbach für Sonderlagen in Kanzleien, Praxen und Gewerbeobjekten mit sauber dokumentierter Ausführung.",
    },
    {
      id: "kanzleireinigung_kreis_offenbach",
      route: "/kanzleireinigung-kreis-offenbach",
      regionId: "kreis_offenbach",
      serviceId: "kanzleireinigung",
      h1: "Kanzleireinigung Kreis Offenbach",
      seoTitle: "Kanzleireinigung Kreis Offenbach für diskrete Büroreinigung | Aktive Facility Management",
      seoDescription:
        "Kanzleireinigung Kreis Offenbach für Arbeitsplätze, Besprechungsräume und Mandantenempfang. Diskrete Reinigung mit festen Qualitätsstandards.",
      intro:
        "Kanzleireinigung Kreis Offenbach für saubere, diskret gepflegte Arbeitsumgebungen in beratungsnahen Büros.",
    },
    {
      id: "bauendreinigung_kreis_offenbach",
      route: "/bauendreinigung-kreis-offenbach",
      regionId: "kreis_offenbach",
      serviceId: "bauendreinigung",
      h1: "Bauendreinigung Kreis Offenbach",
      seoTitle: "Bauendreinigung Kreis Offenbach für bezugsfertige Übergaben | Aktive Facility Management",
      seoDescription:
        "Bauendreinigung Kreis Offenbach nach Neu-, Um- und Ausbauprojekten. Rückstandsfreie Reinigung für bezugsfertige Büro- und Praxisflächen.",
      intro:
        "Bauendreinigung Kreis Offenbach für bezugsfertige Übergaben in Büro-, Praxis- und Gewerbeflächen nach Bau- und Umbauarbeiten.",
    },
    {
      id: "fensterreinigung_neu_isenburg",
      route: "/fensterreinigung-neu-isenburg",
      regionId: "neu_isenburg",
      serviceId: "fensterreinigung",
      h1: "Fensterreinigung Neu-Isenburg",
      seoTitle: "Fensterreinigung Neu-Isenburg für Büro und Gewerbe | Aktive Facility Management",
      seoDescription:
        "Fensterreinigung Neu-Isenburg für Büros, Praxen und Gewerbeobjekte. Saubere Fensterflächen innen und außen mit klaren Intervallen.",
      intro:
        "Fensterreinigung Neu-Isenburg für klare Sichtachsen, gepflegte Fassaden und saubere Rahmenflächen.",
    },
    {
      id: "praxisreinigung_neu_isenburg",
      route: "/praxisreinigung-neu-isenburg",
      regionId: "neu_isenburg",
      serviceId: "praxisreinigung",
      h1: "Praxisreinigung Neu-Isenburg",
      seoTitle: "Praxisreinigung Neu-Isenburg für Arzt- und Therapiepraxen | Aktive Facility Management",
      seoDescription:
        "Praxisreinigung Neu-Isenburg für Behandlungsräume, Empfangsflächen und Sanitärzonen. Hygienische Standards mit festen Reinigungsfenstern.",
      intro:
        "Praxisreinigung Neu-Isenburg mit klaren Hygieneabläufen für medizinische Einrichtungen.",
    },
    {
      id: "buero_reinigung_neu_isenburg",
      route: "/buero-reinigung-neu-isenburg",
      regionId: "neu_isenburg",
      serviceId: "buero_reinigung",
      h1: "Büroreinigung Neu-Isenburg",
      seoTitle: "Büroreinigung Neu-Isenburg für Büroflächen und Kanzleien | Aktive Facility Management",
      seoDescription:
        "Büroreinigung Neu-Isenburg für Arbeitsplätze, Konferenzräume und Gemeinschaftszonen. Feste Reinigungsintervalle für laufenden Betrieb.",
      intro:
        "Büroreinigung Neu-Isenburg mit klaren Leistungsplänen für Arbeitsplätze, Besprechungsräume, Küchen und Sanitärflächen.",
    },
    {
      id: "glasreinigung_neu_isenburg",
      route: "/glasreinigung-neu-isenburg",
      regionId: "neu_isenburg",
      serviceId: "glasreinigung",
      h1: "Glasreinigung Neu-Isenburg",
      seoTitle: "Glasreinigung Neu-Isenburg für Fenster und Glasfassaden | Aktive Facility Management",
      seoDescription:
        "Glasreinigung Neu-Isenburg für Fensterflächen, Glasfronten und Eingangsbereiche. Streifenfreie Ergebnisse für Büro- und Gewerbestandorte.",
      intro:
        "Glasreinigung Neu-Isenburg mit abgestimmten Einsätzen für saubere Fensterflächen und repräsentative Eingangsbereiche.",
    },
    {
      id: "treppenhausreinigung_neu_isenburg",
      route: "/treppenhausreinigung-neu-isenburg",
      regionId: "neu_isenburg",
      serviceId: "treppenhausreinigung",
      h1: "Treppenhausreinigung Neu-Isenburg",
      seoTitle: "Treppenhausreinigung Neu-Isenburg für Wohn- und Gewerbeobjekte | Aktive Facility Management",
      seoDescription:
        "Treppenhausreinigung Neu-Isenburg für Eingänge, Laufwege und Allgemeinflächen. Verbindliche Reinigungsintervalle für stark genutzte Objekte.",
      intro:
        "Treppenhausreinigung Neu-Isenburg mit festen Takten für Treppenhäuser, Flure und Eingangsbereiche.",
    },
    {
      id: "fensterreinigung_langen",
      route: "/fensterreinigung-langen",
      regionId: "langen",
      serviceId: "fensterreinigung",
      h1: "Fensterreinigung Langen",
      seoTitle: "Fensterreinigung Langen für Büro und Gewerbe | Aktive Facility Management",
      seoDescription:
        "Fensterreinigung Langen für Büros, Praxen und Gewerbeobjekte. Saubere Fensterflächen innen und außen mit klaren Intervallen.",
      intro:
        "Fensterreinigung Langen für klare Sichtachsen, gepflegte Fassaden und saubere Rahmenflächen.",
    },
    {
      id: "buero_reinigung_langen",
      route: "/buero-reinigung-langen",
      regionId: "langen",
      serviceId: "buero_reinigung",
      h1: "Büroreinigung Langen",
      seoTitle: "Büroreinigung Langen für Büroflächen und Kanzleien | Aktive Facility Management",
      seoDescription:
        "Büroreinigung Langen für Arbeitsplätze, Konferenzräume und Gemeinschaftszonen. Feste Reinigungsintervalle für laufenden Betrieb.",
      intro:
        "Büroreinigung Langen mit klaren Leistungsplänen für Arbeitsplätze, Besprechungsräume, Küchen und Sanitärflächen.",
    },
    {
      id: "glasreinigung_langen",
      route: "/glasreinigung-langen",
      regionId: "langen",
      serviceId: "glasreinigung",
      h1: "Glasreinigung Langen",
      seoTitle: "Glasreinigung Langen für Fenster und Glasfassaden | Aktive Facility Management",
      seoDescription:
        "Glasreinigung Langen für Fensterflächen, Glasfronten und Eingangsbereiche. Streifenfreie Ergebnisse für Büro- und Gewerbestandorte.",
      intro:
        "Glasreinigung Langen mit abgestimmten Einsätzen für saubere Fensterflächen und repräsentative Eingangsbereiche.",
    },
    {
      id: "treppenhausreinigung_langen",
      route: "/treppenhausreinigung-langen",
      regionId: "langen",
      serviceId: "treppenhausreinigung",
      h1: "Treppenhausreinigung Langen",
      seoTitle: "Treppenhausreinigung Langen für Wohn- und Gewerbeobjekte | Aktive Facility Management",
      seoDescription:
        "Treppenhausreinigung Langen für Eingänge, Laufwege und Allgemeinflächen. Verbindliche Reinigungsintervalle für stark genutzte Objekte.",
      intro:
        "Treppenhausreinigung Langen mit festen Takten für Treppenhäuser, Flure und Eingangsbereiche.",
    },
    {
      id: "praxisreinigung_langen",
      route: "/praxisreinigung-langen",
      regionId: "langen",
      serviceId: "praxisreinigung",
      h1: "Praxisreinigung Langen",
      seoTitle: "Praxisreinigung Langen für Arzt- und Therapiepraxen | Aktive Facility Management",
      seoDescription:
        "Praxisreinigung Langen für Behandlungsräume, Empfangsflächen und Sanitärzonen. Hygienische Standards mit festen Reinigungsfenstern.",
      intro:
        "Praxisreinigung Langen mit klaren Hygieneabläufen für medizinische Einrichtungen.",
    },
  ] satisfies RegionalServiceRoute[],
} as const;

export const getCopyrightLine = (year = new Date().getFullYear()) =>
  `© ${year} ${companyConfig.brand.legalName}. Alle Rechte vorbehalten.`;



