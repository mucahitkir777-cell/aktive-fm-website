import { companyConfig } from "@/config/company";

interface ApplyPageSeoOptions {
  title: string;
  description: string;
  path?: string;
}

function setMeta(selector: string, attribute: "content" | "href", value: string) {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute(attribute, value);
  }
}

function normalizeSiteUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function resolveCanonicalUrl(siteUrl: string, path?: string) {
  const locationPath = path?.trim() || window.location.pathname;
  const normalizedPath = locationPath.startsWith("/") ? locationPath : `/${locationPath}`;
  return normalizedPath === "/" ? `${siteUrl}/` : `${siteUrl}${normalizedPath}`;
}

export function applyPageSeo({ title, description, path }: ApplyPageSeoOptions) {
  const siteUrl = normalizeSiteUrl(companyConfig.brand.siteUrl);
  const canonicalUrl = resolveCanonicalUrl(siteUrl, path);

  document.title = title;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute("content", description);
  }

  setMeta('link[rel="canonical"]', "href", canonicalUrl);
  setMeta('meta[property="og:url"]', "content", canonicalUrl);
  setMeta('meta[property="og:title"]', "content", title);
  setMeta('meta[property="og:description"]', "content", description);
  setMeta('meta[name="twitter:title"]', "content", title);
  setMeta('meta[name="twitter:description"]', "content", description);
}

export function resolveSeoValue(primary: string | undefined, fallback: string) {
  const normalizedPrimary = primary?.trim();
  if (normalizedPrimary) {
    return normalizedPrimary;
  }

  return fallback;
}
