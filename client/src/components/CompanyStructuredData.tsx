import { useEffect, useMemo, useState } from "react";
import { getDefaultCmsPageContent, normalizeCmsPageContent, type CmsGlobalContent } from "@shared/cms";
import { companyConfig } from "@/config/company";
import { fetchPublicCmsPage } from "@/lib/cms";

function normalizeValue(value: string | undefined | null) {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseAddressFromLines(lines: string[]) {
  const [streetAddress = "", secondLine = ""] = lines;
  const match = secondLine.match(/^(\d{4,5})\s+(.+)$/);

  return {
    streetAddress: normalizeValue(streetAddress),
    postalCode: normalizeValue(match?.[1]),
    addressLocality: normalizeValue(match?.[2]),
  };
}

function getUniqueValues(values: Array<string | null>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

export default function CompanyStructuredData() {
  const [cmsContent, setCmsContent] = useState<CmsGlobalContent>(() => getDefaultCmsPageContent("global"));
  const resolvedCmsContent = normalizeCmsPageContent("global", cmsContent);

  useEffect(() => {
    let active = true;

    void fetchPublicCmsPage("global")
      .then((page) => {
        if (page && active) {
          setCmsContent(normalizeCmsPageContent("global", page.content));
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const structuredData = useMemo(() => {
    const addressLines = splitLines(resolvedCmsContent.footerContact.addressLines);
    const cmsAddress = parseAddressFromLines(addressLines);

    const businessName = normalizeValue(companyConfig.brand.legalName) ?? normalizeValue(companyConfig.brand.name);
    const businessUrl = normalizeValue(companyConfig.brand.siteUrl);
    const businessDescription = normalizeValue(
      `Professionelle ${companyConfig.brand.descriptor} für Unternehmen in ${companyConfig.regionMessaging.primaryLabel}`,
    );

    const phoneInternational = normalizeValue(companyConfig.contact.phoneInternational);
    const phoneFallback = normalizeValue(resolvedCmsContent.footerContact.phoneDisplay)?.replace(/\s+/g, "");
    const telephone = phoneInternational ?? phoneFallback;

    const email =
      normalizeValue(companyConfig.contact.email)
      ?? normalizeValue(resolvedCmsContent.footerContact.emailDisplay);

    const streetAddress = cmsAddress.streetAddress ?? normalizeValue(companyConfig.address.street);
    const postalCode = cmsAddress.postalCode ?? normalizeValue(companyConfig.address.postalCode);
    const addressLocality = cmsAddress.addressLocality ?? normalizeValue(companyConfig.address.city);
    const addressCountry = normalizeValue(companyConfig.address.countryCode);

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

    const areaServed = getUniqueValues(companyConfig.regions.map((region) => normalizeValue(region.label)));
    const serviceType = getUniqueValues(companyConfig.services.map((service) => normalizeValue(service.label)));

    const data: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": ["HouseCleaningService", "LocalBusiness"],
      name: businessName,
      description: businessDescription,
      url: businessUrl,
      telephone,
      email,
      address:
        streetAddress || postalCode || addressLocality || addressCountry
          ? {
              "@type": "PostalAddress",
              ...(streetAddress ? { streetAddress } : {}),
              ...(postalCode ? { postalCode } : {}),
              ...(addressLocality ? { addressLocality } : {}),
              ...(addressCountry ? { addressCountry } : {}),
            }
          : undefined,
      ...(openingHoursSpecification.length > 0 ? { openingHoursSpecification } : {}),
      ...(areaServed.length > 0 ? { areaServed } : {}),
      ...(serviceType.length > 0 ? { serviceType } : {}),
    };

    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined && value !== null && value !== ""),
    );
  }, [resolvedCmsContent.footerContact.addressLines, resolvedCmsContent.footerContact.emailDisplay, resolvedCmsContent.footerContact.phoneDisplay]);

  if (!structuredData.name || !structuredData.url) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
