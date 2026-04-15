import { companyConfig } from "@/config/company";

export default function CompanyStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: companyConfig.brand.legalName,
    description: `Professionelle ${companyConfig.brand.descriptor} für Unternehmen im Rhein-Main-Gebiet`,
    url: companyConfig.brand.siteUrl,
    telephone: companyConfig.contact.phoneInternational,
    email: companyConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: companyConfig.address.street,
      addressLocality: companyConfig.address.city,
      postalCode: companyConfig.address.postalCode,
      addressCountry: companyConfig.address.countryCode,
    },
    openingHoursSpecification: companyConfig.openingHours.schema.map((entry) => ({
      "@type": "OpeningHoursSpecification",
      ...entry,
    })),
    priceRange: "€€",
    areaServed: companyConfig.regions.map((region) => region.label),
    serviceType: companyConfig.services.map((service) => service.label),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
