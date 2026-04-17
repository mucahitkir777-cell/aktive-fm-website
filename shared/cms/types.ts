export const cmsPageSlugs = [
  "global",
  "home",
  "leistungen",
  "ueber-uns",
  "faq",
  "kontakt",
] as const;

export type CmsPageSlug = (typeof cmsPageSlugs)[number];

export type CmsPageStatus = "draft" | "published";

export type CmsNavigationItem = {
  id: string;
  label: string;
  href: string;
  visible: boolean;
  sortOrder: number;
  type: "page" | "custom";
  target: "_self" | "_blank";
};

export type CmsNavigation = {
  items: CmsNavigationItem[];
  ctaLabel: string;
  ctaHref: string;
};

export interface CmsFieldDefinition {
  key: string;
  label: string;
  input: "text" | "textarea" | "checkbox" | "number";
  rows?: number;
}

export interface CmsSectionDefinition {
  key: string;
  label: string;
  fields: CmsFieldDefinition[];
}

