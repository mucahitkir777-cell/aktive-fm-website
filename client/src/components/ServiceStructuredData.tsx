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

    const validServices = services
      .map((service) => {
        const name = normalizeValue(service.title);
        const slug = normalizeValue(service.slug);
        const description = normalizeValue(service.fullDesc) ?? normalizeValue(service.shortDesc);

        if (!name || !description) {
          return null;
        }

        const url = providerUrl
          ? slug
            ? `${providerUrl}/leistungen#${slug}`
            : `${providerUrl}/leistungen`
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
        name: service.name,
        description: service.description,
        ...(providerName && providerUrl
          ? {
              provider: {
                "@type": "LocalBusiness",
                name: providerName,
                url: providerUrl,
              },
            }
          : {}),
        ...(service.url ? { url: service.url } : {}),
        serviceType: service.name,
        ...(areaServed.length > 0 ? { areaServed } : {}),
      };

      return {
        "@type": "ListItem",
        position: index + 1,
        item,
      };
    });

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
