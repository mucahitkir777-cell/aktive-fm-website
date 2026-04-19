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
}

function normalizeValue(value: string | undefined | null) {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

export default function ServiceStructuredData({ services }: ServiceStructuredDataProps) {
  const structuredData = useMemo(() => {
    const providerName = normalizeValue(companyConfig.brand.legalName) ?? normalizeValue(companyConfig.brand.name);
    const providerUrl = normalizeValue(companyConfig.brand.siteUrl);

    const areaServed = companyConfig.regions
      .map((region) => normalizeValue(region.label))
      .filter((name): name is string => Boolean(name))
      .map((name) => ({
        "@type": "City",
        name,
      }));

    const itemListElement = services
      .map((service, index) => {
        const name = normalizeValue(service.title);
        const description = normalizeValue(service.fullDesc) ?? normalizeValue(service.shortDesc);

        if (!name || !description) {
          return null;
        }

        const item: Record<string, unknown> = {
          "@type": "Service",
          name,
          description,
          ...(providerName && providerUrl
            ? {
                provider: {
                  "@type": "LocalBusiness",
                  name: providerName,
                  url: providerUrl,
                },
              }
            : {}),
          serviceType: name,
          ...(areaServed.length > 0 ? { areaServed } : {}),
        };

        return {
          "@type": "ListItem",
          position: index + 1,
          item,
        };
      })
      .filter((entry): entry is { "@type": "ListItem"; position: number; item: Record<string, unknown> } => Boolean(entry));

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement,
    };
  }, [services]);

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
