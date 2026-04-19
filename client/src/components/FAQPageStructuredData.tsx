import { useMemo } from "react";
import { companyConfig } from "@/config/company";

interface FAQCategory {
  category: string;
  items: Array<{ q: string; a: string }>;
}

interface FAQPageStructuredDataProps {
  faqCategories: FAQCategory[];
}

export default function FAQPageStructuredData({ faqCategories }: FAQPageStructuredDataProps) {
  const structuredData = useMemo(() => {
    const mainEntity = faqCategories.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    );

    const data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity,
      publisher: {
        "@type": "Organization",
        name: companyConfig.brand.legalName,
        url: companyConfig.brand.siteUrl,
      },
    };

    return data;
  }, [faqCategories]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
