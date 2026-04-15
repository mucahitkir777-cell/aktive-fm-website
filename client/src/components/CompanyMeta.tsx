import { useEffect } from "react";
import { useLocation } from "wouter";
import { companyConfig } from "@/config/company";

function setMeta(selector: string, attribute: "content" | "href", value: string) {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute(attribute, value);
  }
}

export default function CompanyMeta() {
  const [location] = useLocation();

  useEffect(() => {
    const isRegionalRoute =
      companyConfig.regions.some((region) => region.route === location) ||
      companyConfig.regionalServiceRoutes.some((route) => route.route === location);

    if (isRegionalRoute) return;

    document.title = companyConfig.seo.title;

    setMeta('meta[name="description"]', "content", companyConfig.seo.description);
    setMeta('meta[name="keywords"]', "content", companyConfig.seo.keywords);
    setMeta('meta[name="author"]', "content", companyConfig.brand.legalName);
    setMeta('link[rel="canonical"]', "href", `${companyConfig.brand.siteUrl}/`);
    setMeta('meta[property="og:url"]', "content", `${companyConfig.brand.siteUrl}/`);
    setMeta('meta[property="og:title"]', "content", companyConfig.seo.ogTitle);
    setMeta('meta[property="og:description"]', "content", companyConfig.seo.ogDescription);
    setMeta('meta[property="og:site_name"]', "content", companyConfig.brand.legalName);
    setMeta('meta[name="twitter:title"]', "content", companyConfig.seo.ogTitle);
    setMeta('meta[name="twitter:description"]', "content", companyConfig.seo.twitterDescription);
  }, [location]);

  return null;
}
