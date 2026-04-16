import { z } from "zod";

export const cmsPageSlugs = ["home"] as const;
export const cmsPageSlugSchema = z.enum(cmsPageSlugs);
export type CmsPageSlug = (typeof cmsPageSlugs)[number];

export const cmsHomeContentSchema = z.object({
  hero: z.object({
    title: z.string().trim().min(1, "Der Hero-Titel ist erforderlich.").max(120, "Der Hero-Titel ist zu lang."),
    accentTitle: z.string().trim().min(1, "Der Hero-Akzenttitel ist erforderlich.").max(120, "Der Hero-Akzenttitel ist zu lang."),
    subtitle: z.string().trim().min(1, "Der Hero-Untertitel ist erforderlich.").max(500, "Der Hero-Untertitel ist zu lang."),
    primaryButtonText: z.string().trim().min(1, "Der Hero-Button-Text ist erforderlich.").max(60, "Der Hero-Button-Text ist zu lang."),
  }),
  finalCta: z.object({
    title: z.string().trim().min(1, "Der CTA-Titel ist erforderlich.").max(120, "Der CTA-Titel ist zu lang."),
    body: z.string().trim().min(1, "Der CTA-Text ist erforderlich.").max(500, "Der CTA-Text ist zu lang."),
    primaryButtonText: z.string().trim().min(1, "Der CTA-Button-Text ist erforderlich.").max(60, "Der CTA-Button-Text ist zu lang."),
  }),
});

export type CmsHomeContent = z.infer<typeof cmsHomeContentSchema>;

export interface CmsFieldDefinition {
  key: string;
  label: string;
  input: "text" | "textarea";
  rows?: number;
}

export interface CmsSectionDefinition {
  key: string;
  label: string;
  fields: CmsFieldDefinition[];
}

export const cmsPageDefinitions = {
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
        ],
      },
      {
        key: "finalCta",
        label: "CTA",
        fields: [
          { key: "title", label: "CTA-Titel", input: "text" },
          { key: "body", label: "CTA-Text", input: "textarea", rows: 4 },
          { key: "primaryButtonText", label: "CTA-Button-Text", input: "text" },
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
  home: CmsHomeContent;
}

export const defaultCmsPageContent: CmsPageContentMap = {
  home: {
    hero: {
      title: "Sauberkeit,",
      accentTitle: "die ueberzeugt.",
      subtitle:
        "Zuverlaessige Gebaeudereinigung fuer Unternehmen im Rhein-Main-Gebiet - puenktlich, gruendlich und diskret. Damit Sie sich auf Ihr Kerngeschaeft konzentrieren koennen.",
      primaryButtonText: "Kostenloses Angebot",
    },
    finalCta: {
      title: "Bereit fuer saubere Ergebnisse?",
      body:
        "Fordern Sie jetzt Ihr kostenloses Angebot fuer Kreis Offenbach, Frankfurt am Main oder Hanau an. Wir melden uns innerhalb von 24 Stunden bei Ihnen.",
      primaryButtonText: "Jetzt Angebot anfragen",
    },
  },
};

export interface CmsPageSummary<TSlug extends CmsPageSlug = CmsPageSlug> {
  slug: TSlug;
  title: string;
  path: string;
  updatedAt: string;
}

export interface CmsPage<TSlug extends CmsPageSlug = CmsPageSlug> extends CmsPageSummary<TSlug> {
  content: CmsPageContentMap[TSlug];
}

export function getDefaultCmsPageContent<TSlug extends CmsPageSlug>(slug: TSlug): CmsPageContentMap[TSlug] {
  return JSON.parse(JSON.stringify(defaultCmsPageContent[slug])) as CmsPageContentMap[TSlug];
}
