import type { CmsPageSlug, CmsPageStatus, CmsSectionDefinition } from "./types";
import type { CmsAboutContent, CmsContactContent, CmsFaqContent, CmsGlobalContent, CmsHomeContent, CmsServicesContent } from "./schemas";

export const cmsPageDefinitions = {
  global: {
    title: "Globale Inhalte",
    path: "/",
    sections: [
      {
        key: "navigation",
        label: "Navigation",
        fields: [
          { key: "items", label: "Navigationspunkte", input: "textarea", rows: 10 },
          { key: "ctaLabel", label: "CTA Label", input: "text" },
          { key: "ctaHref", label: "CTA Pfad", input: "text" },
        ],
      },
      {
        key: "footer",
        label: "Footer",
        fields: [
          { key: "footerText", label: "Footer-Text", input: "textarea", rows: 4 },
          { key: "membershipLabel", label: "Mitgliedschaft", input: "text" },
        ],
      },
      {
        key: "footerContact",
        label: "Footer Kontakt",
        fields: [
          { key: "phoneLabel", label: "Telefon Label", input: "text" },
          { key: "phoneDisplay", label: "Telefon Anzeige", input: "text" },
          { key: "phoneHref", label: "Telefon Link", input: "text" },
          { key: "phoneMeta", label: "Telefon Zusatzinfo", input: "text" },
          { key: "emailLabel", label: "E-Mail Label", input: "text" },
          { key: "emailDisplay", label: "E-Mail Anzeige", input: "text" },
          { key: "emailHref", label: "E-Mail Link", input: "text" },
          { key: "addressLabel", label: "Adresse Label", input: "text" },
          { key: "addressLines", label: "Adresse Zeilen", input: "textarea", rows: 3 },
          { key: "hoursLabel", label: "Öffnungszeiten Label", input: "text" },
          { key: "hoursLines", label: "Öffnungszeiten Zeilen", input: "textarea", rows: 3 },
        ],
      },
      {
        key: "legal",
        label: "Rechtliches",
        fields: [
          { key: "impressumLabel", label: "Impressum Label", input: "text" },
          { key: "impressumHref", label: "Impressum Pfad", input: "text" },
          { key: "datenschutzLabel", label: "Datenschutz Label", input: "text" },
          { key: "datenschutzHref", label: "Datenschutz Pfad", input: "text" },
        ],
      },
    ],
  },
  home: {
    title: "Startseite",
    path: "/",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: [
          { key: "title", label: "Hero-Titel", input: "text" },
          { key: "accentTitle", label: "Hero-Akzenttitel", input: "text" },
          { key: "subtitle", label: "Hero-Untertitel", input: "textarea", rows: 4 },
          { key: "primaryButtonText", label: "Hero-Button-Text", input: "text" },
          { key: "imageUrl", label: "Hero-Bild URL", input: "text" },
        ],
      },
      {
        key: "services",
        label: "Leistungen",
        fields: [
          { key: "title", label: "Bereichstitel", input: "text" },
          { key: "subtitle", label: "Bereichsbeschreibung", input: "textarea", rows: 4 },
          { key: "buttonText", label: "Button-Text", input: "text" },
          { key: "imageUrl", label: "Bereichsbild URL", input: "text" },
        ],
      },
      {
        key: "usps",
        label: "USPs",
        fields: [
          { key: "title", label: "Bereichstitel", input: "text" },
          { key: "subtitle", label: "Bereichsbeschreibung", input: "textarea", rows: 4 },
          { key: "imageUrl", label: "Bereichsbild URL", input: "text" },
        ],
      },
      {
        key: "reviews",
        label: "Bewertungen",
        fields: [
          { key: "title", label: "Bereichstitel", input: "text" },
          { key: "subtitle", label: "Bereichsbeschreibung", input: "textarea", rows: 4 },
          { key: "googleImageUrl", label: "Google Logo URL", input: "text" },
          { key: "googleScore", label: "Google Score", input: "text" },
          { key: "googleLabel", label: "Google Label", input: "text" },
          { key: "trustpilotImageUrl", label: "Trustpilot Logo URL", input: "text" },
          { key: "trustpilotScore", label: "Trustpilot Score", input: "text" },
          { key: "trustpilotLabel", label: "Trustpilot Label", input: "text" },
          { key: "provenexpertImageUrl", label: "ProvenExpert Logo URL", input: "text" },
          { key: "provenexpertScore", label: "ProvenExpert Score", input: "text" },
          { key: "provenexpertLabel", label: "ProvenExpert Label", input: "text" },
          { key: "oneOneEightEightZeroImageUrl", label: "11880 Logo URL", input: "text" },
          { key: "oneOneEightEightZeroScore", label: "11880 Score", input: "text" },
          { key: "oneOneEightEightZeroLabel", label: "11880 Label", input: "text" },
          { key: "trustlocalImageUrl", label: "Trustlocal Logo URL", input: "text" },
          { key: "trustlocalScore", label: "Trustlocal Score", input: "text" },
          { key: "trustlocalLabel", label: "Trustlocal Label", input: "text" },
        ],
      },
      {
        key: "finalCta",
        label: "Kontaktbereich",
        fields: [
          { key: "title", label: "CTA-Titel", input: "text" },
          { key: "body", label: "CTA-Text", input: "textarea", rows: 4 },
          { key: "primaryButtonText", label: "CTA-Button-Text", input: "text" },
          { key: "imageUrl", label: "CTA-Bild URL", input: "text" },
        ],
      },
      {
        key: "seo",
        label: "SEO",
        fields: [
          { key: "seoTitle", label: "SEO-Titel", input: "text" },
          { key: "seoDescription", label: "SEO-Beschreibung", input: "textarea", rows: 4 },
        ],
      },
    ],
  },
  leistungen: {
    title: "Leistungen",
    path: "/leistungen",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: [
          { key: "title", label: "Hero-Titel", input: "text" },
          { key: "subtitle", label: "Hero-Untertitel", input: "textarea", rows: 4 },
          { key: "buttonText", label: "Hero-Button-Text", input: "text" },
          { key: "imageUrl", label: "Hero-Bild URL", input: "text" },
        ],
      },
      {
        key: "overview",
        label: "Leistungsübersicht",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "subtitle", label: "Beschreibung", input: "textarea", rows: 4 },
          { key: "imageUrl1", label: "Leistungsbild URL 1", input: "text" },
          { key: "imageUrl2", label: "Leistungsbild URL 2", input: "text" },
        ],
      },
      {
        key: "benefits",
        label: "Vorteile",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "subtitle", label: "Beschreibung", input: "textarea", rows: 4 },
        ],
      },
      {
        key: "finalCta",
        label: "Kontaktbereich",
        fields: [
          { key: "title", label: "CTA-Titel", input: "text" },
          { key: "body", label: "CTA-Text", input: "textarea", rows: 4 },
          { key: "primaryButtonText", label: "CTA-Button-Text", input: "text" },
        ],
      },
      {
        key: "seo",
        label: "SEO",
        fields: [
          { key: "seoTitle", label: "SEO-Titel", input: "text" },
          { key: "seoDescription", label: "SEO-Beschreibung", input: "textarea", rows: 4 },
        ],
      },
    ],
  },
  "ueber-uns": {
    title: "Über uns",
    path: "/ueber-uns",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: [
          { key: "title", label: "Hero-Titel", input: "text" },
          { key: "subtitle", label: "Hero-Untertitel", input: "textarea", rows: 4 },
          { key: "buttonText", label: "Hero-Button-Text", input: "text" },
          { key: "imageUrl", label: "Hero-Bild URL", input: "text" },
        ],
      },
      {
        key: "companyInfo",
        label: "Unternehmensinfo",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "storyParagraph1", label: "Text Absatz 1", input: "textarea", rows: 4 },
          { key: "storyParagraph2", label: "Text Absatz 2", input: "textarea", rows: 4 },
          { key: "storyParagraph3", label: "Text Absatz 3", input: "textarea", rows: 4 },
          { key: "statsYearsLabel", label: "Statistik Jahre Label", input: "text" },
          { key: "statsCustomersLabel", label: "Statistik Kunden Label", input: "text" },
          { key: "statsStaffLabel", label: "Statistik Mitarbeiter Label", input: "text" },
          { key: "statsEmployeesLabel", label: "Statistik Festangestellt Label", input: "text" },
          { key: "teamImageUrl", label: "Story-Bild URL", input: "text" },
          { key: "teamImageAlt", label: "Story-Bild Alt-Text", input: "text" },
          { key: "teamBadgeLabel", label: "Story-Badge Label", input: "text" },
        ],
      },
      {
        key: "values",
        label: "Werte / Vorteile",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "subtitle", label: "Beschreibung", input: "textarea", rows: 4 },
          { key: "value1Title", label: "Wert 1 Titel", input: "text" },
          { key: "value1Desc", label: "Wert 1 Text", input: "textarea", rows: 3 },
          { key: "value2Title", label: "Wert 2 Titel", input: "text" },
          { key: "value2Desc", label: "Wert 2 Text", input: "textarea", rows: 3 },
          { key: "value3Title", label: "Wert 3 Titel", input: "text" },
          { key: "value3Desc", label: "Wert 3 Text", input: "textarea", rows: 3 },
          { key: "value4Title", label: "Wert 4 Titel", input: "text" },
          { key: "value4Desc", label: "Wert 4 Text", input: "textarea", rows: 3 },
        ],
      },
      {
        key: "team",
        label: "Team-Bereich",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "paragraph1", label: "Text Absatz 1", input: "textarea", rows: 4 },
          { key: "paragraph2", label: "Text Absatz 2", input: "textarea", rows: 4 },
          { key: "bullet1", label: "Bullet 1", input: "text" },
          { key: "bullet2", label: "Bullet 2", input: "text" },
          { key: "bullet3", label: "Bullet 3", input: "text" },
          { key: "bullet4", label: "Bullet 4", input: "text" },
          { key: "buttonText", label: "Button-Text", input: "text" },
          { key: "imageUrl", label: "Team-Bild URL", input: "text" },
          { key: "imageAlt", label: "Team-Bild Alt-Text", input: "text" },
        ],
      },
      {
        key: "finalCta",
        label: "Kontaktbereich",
        fields: [
          { key: "title", label: "CTA-Titel", input: "text" },
          { key: "body", label: "CTA-Text", input: "textarea", rows: 4 },
          { key: "primaryButtonText", label: "CTA-Button-Text", input: "text" },
        ],
      },
      {
        key: "seo",
        label: "SEO",
        fields: [
          { key: "seoTitle", label: "SEO-Titel", input: "text" },
          { key: "seoDescription", label: "SEO-Beschreibung", input: "textarea", rows: 4 },
        ],
      },
    ],
  },
  faq: {
    title: "FAQ",
    path: "/faq",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: [
          { key: "title", label: "Hero-Titel", input: "text" },
          { key: "subtitle", label: "Hero-Untertitel", input: "textarea", rows: 4 },
          { key: "buttonText", label: "Hero-Button-Text", input: "text" },
          { key: "imageUrl", label: "Hero-Bild URL", input: "text" },
        ],
      },
      {
        key: "questions",
        label: "Fragenbereich",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "subtitle", label: "Beschreibung", input: "textarea", rows: 4 },
          { key: "faqText", label: "FAQ-Inhalt (Kategorie|Frage|Antwort je Zeile)", input: "textarea", rows: 14 },
        ],
      },
      {
        key: "finalCta",
        label: "Kontaktbereich",
        fields: [
          { key: "title", label: "CTA-Titel", input: "text" },
          { key: "body", label: "CTA-Text", input: "textarea", rows: 4 },
          { key: "primaryButtonText", label: "CTA-Button-Text", input: "text" },
        ],
      },
      {
        key: "seo",
        label: "SEO",
        fields: [
          { key: "seoTitle", label: "SEO-Titel", input: "text" },
          { key: "seoDescription", label: "SEO-Beschreibung", input: "textarea", rows: 4 },
        ],
      },
    ],
  },
  kontakt: {
    title: "Kontakt",
    path: "/kontakt",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: [
          { key: "title", label: "Hero-Titel", input: "text" },
          { key: "subtitle", label: "Hero-Untertitel", input: "textarea", rows: 4 },
          { key: "buttonText", label: "Hero-Button-Text", input: "text" },
          { key: "imageUrl", label: "Hero-Bild URL", input: "text" },
        ],
      },
      {
        key: "contactInfo",
        label: "Kontaktinfos",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "subtitle", label: "Beschreibung", input: "textarea", rows: 4 },
        ],
      },
      {
        key: "formSection",
        label: "Formularbereich",
        fields: [
          { key: "title", label: "Titel", input: "text" },
          { key: "subtitle", label: "Untertitel", input: "textarea", rows: 4 },
          { key: "buttonText", label: "Button-Text", input: "text" },
        ],
      },
      {
        key: "seo",
        label: "SEO",
        fields: [
          { key: "seoTitle", label: "SEO-Titel", input: "text" },
          { key: "seoDescription", label: "SEO-Beschreibung", input: "textarea", rows: 4 },
        ],
      },
    ],
  },
} as const satisfies Record<
  CmsPageSlug,
  {
    title: string;
    path: string;
    sections: readonly CmsSectionDefinition[];
  }
>;

export interface CmsPageContentMap {
  global: CmsGlobalContent;
  home: CmsHomeContent;
  leistungen: CmsServicesContent;
  "ueber-uns": CmsAboutContent;
  faq: CmsFaqContent;
  kontakt: CmsContactContent;
}


export interface CmsPageSummary<TSlug extends CmsPageSlug = CmsPageSlug> {
  slug: TSlug;
  title: string;
  path: string;
  updatedAt: string;
  status: CmsPageStatus;
}

export interface CmsPage<TSlug extends CmsPageSlug = CmsPageSlug> extends CmsPageSummary<TSlug> {
  content: CmsPageContentMap[TSlug];
}




