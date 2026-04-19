import { useMemo } from "react";
import { companyConfig } from "@/config/company";

interface RegionalServiceStructuredDataProps {
  regionLabel: string;
  serviceName: string;
  description: string;
  pagePath: string;
  nearbyAreas?: string[];
}

function normalizeValue(value: string | undefined | null) {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

export default function RegionalServiceStructuredData({
  regionLabel,
  serviceName,
  description,
  pagePath,
  nearbyAreas = [],
}: RegionalServiceStructuredDataProps) {
  const structuredData = useMemo(() => {
    const openingHoursSpecification = companyConfig.openingHours.schema
      .map((entry) => ({
        "@type": "OpeningHoursSpecification",
        ...entry,
      }))
      .filter((entry) => {
        const opens = normalizeValue(entry.opens);
        const closes = normalizeValue(entry.closes);
        if (!opens || !closes) {
          return false;
        }

        if (Array.isArray(entry.dayOfWeek)) {
          return entry.dayOfWeek.length > 0;
        }

        return typeof entry.dayOfWeek === "string" && Boolean(normalizeValue(entry.dayOfWeek));
      });

    const areaServed = nearbyAreas
      .map((area) => normalizeValue(area))
      .filter((area): area is string => Boolean(area))
      .map((area) => ({
        "@type": "City",
        name: area,
      }));

    const data: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: `${serviceName} ${regionLabel}`,
      description,
      url: `${companyConfig.brand.siteUrl}${pagePath}`,
      telephone: normalizeValue(companyConfig.contact.phoneInternational),
      email: normalizeValue(companyConfig.contact.email),
      address: {
        "@type": "PostalAddress",
        streetAddress: companyConfig.address.street,
        postalCode: companyConfig.address.postalCode,
        addressLocality: companyConfig.address.city,
        addressCountry: companyConfig.address.countryCode,
      },
      ...(areaServed.length > 0 ? { areaServed } : {}),
      service: {
        "@type": "Service",
        name: serviceName,
        description,
      },
      ...(openingHoursSpecification.length > 0 ? { openingHoursSpecification } : {}),
    };

    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined && value !== null && value !== ""),
    );
  }, [regionLabel, serviceName, description, pagePath, nearbyAreas]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
