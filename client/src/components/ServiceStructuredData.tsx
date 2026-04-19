import { useMemo } from "react";
import { companyConfig } from "@/config/company";

interface ServiceItem {
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc?: string;
}

interface ServiceStructuredDataProps {
  services: ServiceItem[];
  pagePath: string;
}

function normalizeValue(value: string | undefined | null) {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

export default function ServiceStructuredData({ services, pagePath }: ServiceStructuredDataProps) {
  const structuredData = useMemo(() => {
    const providerName = normalizeValue(companyConfig.brand.legalName) ?? normalizeValue(companyConfig.brand.name);
    const providerUrl = normalizeValue(companyConfig.brand.siteUrl);
    const providerId = providerUrl ? `${providerUrl}#organization` : undefined;
    const normalizedPagePath = normalizeValue(pagePath);
    const pageUrl =
      providerUrl && normalizedPagePath
        ? `${providerUrl}${normalizedPagePath}`
        : undefined;
    const itemListId = pageUrl ? `${pageUrl}#services` : undefined;

    const areaServed = companyConfig.regions
      .map((region) => normalizeValue(region.label))
      .filter((name): name is string => Boolean(name))
      .map((name) => ({
        "@type": "City",
        name,
      }));

    const validServices = services
      .map((service) => {
        const name = normalizeValue(service.title);
        const slug = normalizeValue(service.slug);
        const description = normalizeValue(service.fullDesc) ?? normalizeValue(service.shortDesc);

        if (!name || !description) {
          return null;
        }

        const url = pageUrl
          ? slug
            ? `${pageUrl}#${slug}`
            : pageUrl
          : undefined;

        return {
          name,
          description,
          url,
        };
      })
      .filter((entry): entry is { name: string; description: string; url?: string } => Boolean(entry));

    const itemListElement = validServices.map((service, index) => {
      const item: Record<string, unknown> = {
        "@type": "Service",
        ...(service.url ? { "@id": `${service.url}#service`, url: service.url } : {}),
        name: service.name,
        description: service.description,
        ...(providerName && providerUrl
          ? {
              provider: {
                "@type": "LocalBusiness",
                ...(providerId ? { "@id": providerId } : {}),
                name: providerName,
                url: providerUrl,
              },
            }
          : {}),
        serviceType: service.name,
        ...(areaServed.length > 0 ? { areaServed } : {}),
      };

      return {
        "@type": "ListItem",
        ...(service.url ? { "@id": `${service.url}#listitem` } : {}),
        position: index + 1,
        item,
      };
    });

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      ...(itemListId ? { "@id": itemListId } : {}),
      ...(pageUrl ? { url: pageUrl, mainEntityOfPage: pageUrl } : {}),
      itemListElement,
    };
  }, [services, pagePath]);

  if (structuredData.itemListElement.length === 0) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
