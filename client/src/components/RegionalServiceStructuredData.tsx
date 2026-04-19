import { useMemo } from "react";
import { companyConfig } from "@/config/company";

interface RegionalServiceStructuredDataProps {
  regionLabel: string;
  serviceName: string;
  description: string;
  pagePath: string;
  nearbyAreas?: string[];
}

export default function RegionalServiceStructuredData({
  regionLabel,
  serviceName,
  description,
  pagePath,
  nearbyAreas = [],
}: RegionalServiceStructuredDataProps) {
  const structuredData = useMemo(() => {
    const data = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: `${serviceName} ${regionLabel}`,
      description,
      url: `${companyConfig.brand.siteUrl}${pagePath}`,
      telephone: companyConfig.contact.phoneInternational,
      email: companyConfig.contact.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: companyConfig.address.street,
        postalCode: companyConfig.address.postalCode,
        addressLocality: companyConfig.address.city,
        addressCountry: companyConfig.address.countryCode,
      },
      areaServed: nearbyAreas.map((area) => ({
        "@type": "City",
        name: area,
      })),
      priceRange: "$$",
      service: {
        "@type": "Service",
        name: serviceName,
        description,
      },
      openingHoursSpecification: companyConfig.openingHours.schema.map((entry) => ({
        "@type": "OpeningHoursSpecification",
        ...entry,
      })),
    };

    return data;
  }, [regionLabel, serviceName, description, pagePath, nearbyAreas]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
