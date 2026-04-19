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

export default function ServiceStructuredData({ services }: ServiceStructuredDataProps) {
  const structuredData = useMemo(() => {
    const serviceList = services.map((service) => ({
      "@type": "Service",
      name: service.title,
      description: service.fullDesc || service.shortDesc,
      provider: {
        "@type": "LocalBusiness",
        name: companyConfig.brand.legalName,
        url: companyConfig.brand.siteUrl,
      },
      areaServed: companyConfig.regions
        .map((region) => ({
          "@type": "City",
          name: region.label,
        })),
      serviceType: service.title,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: serviceList.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: service,
      })),
    };
  }, [services]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
