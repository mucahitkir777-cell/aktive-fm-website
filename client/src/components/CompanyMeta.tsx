import { useEffect } from "react";
import { useLocation } from "wouter";
import { companyConfig } from "@/config/company";

function setMeta(selector: string, attribute: "content" | "href", value: string) {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute(attribute, value);
  }
}

function setOrCreateMetaByName(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function normalizeSiteUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function resolveCanonicalUrl(siteUrl: string, location: string) {
  const path = location.startsWith("/") ? location : `/${location}`;
  return path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`;
}

export default function CompanyMeta() {
  const [location] = useLocation();

  useEffect(() => {
    const siteUrl = normalizeSiteUrl(companyConfig.brand.siteUrl);
    const cmsManagedSeoRoutes = new Set(["/", "/leistungen", "/ueber-uns", "/faq", "/kontakt", "/impressum", "/datenschutz"]);

    const isRegionalRoute =
      companyConfig.regions.some((region) => region.route === location) ||
      companyConfig.regionalServiceRoutes.some((route) => route.route === location);

    const isAdminRoute = location.startsWith("/admin");
    const isNotFoundRoute = location === "/404" || (!cmsManagedSeoRoutes.has(location) && !isRegionalRoute && !isAdminRoute);
    const canonicalLocation = isNotFoundRoute ? "/404" : location;
    const canonicalUrl = resolveCanonicalUrl(siteUrl, canonicalLocation);
    const isIndexableRoute = !isAdminRoute && !isNotFoundRoute;

    setMeta('link[rel="canonical"]', "href", canonicalUrl);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:site_name"]', "content", companyConfig.brand.legalName);
    setOrCreateMetaByName("robots", isIndexableRoute ? "index, follow" : "noindex, nofollow");

    if (cmsManagedSeoRoutes.has(location) || isRegionalRoute) {
      return;
    }

    if (isAdminRoute) {
      const adminTitle = `Admin | ${companyConfig.brand.legalName}`;
      const adminDescription = "Geschuetzter Administrationsbereich.";

      document.title = adminTitle;
      setMeta('meta[name="description"]', "content", adminDescription);
      setMeta('meta[property="og:title"]', "content", adminTitle);
      setMeta('meta[property="og:description"]', "content", adminDescription);
      setMeta('meta[name="twitter:title"]', "content", adminTitle);
      setMeta('meta[name="twitter:description"]', "content", adminDescription);
      return;
    }

    if (isNotFoundRoute) {
      const notFoundTitle = `Seite nicht gefunden | ${companyConfig.brand.legalName}`;
      const notFoundDescription = "Die aufgerufene Seite konnte nicht gefunden werden.";

      document.title = notFoundTitle;
      setMeta('meta[name="description"]', "content", notFoundDescription);
      setMeta('meta[property="og:title"]', "content", notFoundTitle);
      setMeta('meta[property="og:description"]', "content", notFoundDescription);
      setMeta('meta[name="twitter:title"]', "content", notFoundTitle);
      setMeta('meta[name="twitter:description"]', "content", notFoundDescription);
      return;
    }

    document.title = companyConfig.seo.title;
    setMeta('meta[name="description"]', "content", companyConfig.seo.description);
    setMeta('meta[name="keywords"]', "content", companyConfig.seo.keywords);
    setMeta('meta[name="author"]', "content", companyConfig.brand.legalName);
    setMeta('meta[property="og:title"]', "content", companyConfig.seo.ogTitle);
    setMeta('meta[property="og:description"]', "content", companyConfig.seo.ogDescription);
    setMeta('meta[name="twitter:title"]', "content", companyConfig.seo.ogTitle);
    setMeta('meta[name="twitter:description"]', "content", companyConfig.seo.twitterDescription);
  }, [location]);

  return null;
}
