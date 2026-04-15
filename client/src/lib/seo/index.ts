import { companyConfig } from "@/config/company";

export interface SeoPageDefinition {
  path: string;
  title: string;
  description: string;
  canonical?: string;
  serviceType?: string;
  location?: string;
  keywords?: string[];
}

export const SEO_MANAGER_CONFIG = {
  baseUrl: import.meta.env.VITE_SITE_URL ?? companyConfig.brand.siteUrl,
  searchConsoleVerificationCode:
    import.meta.env.VITE_GOOGLE_SITE_VERIFICATION ?? "GOOGLE_SEARCH_CONSOLE_PLACEHOLDER",
  enableRuntimeMetaUpdates: import.meta.env.VITE_SEO_RUNTIME_META_ENABLED === "true",
} as const;

export function buildCanonicalUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SEO_MANAGER_CONFIG.baseUrl}${normalizedPath}`;
}

export function buildSeoPageDefinition(definition: SeoPageDefinition): SeoPageDefinition {
  return {
    ...definition,
    canonical: definition.canonical ?? buildCanonicalUrl(definition.path),
  };
}
