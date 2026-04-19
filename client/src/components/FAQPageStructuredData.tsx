import { useMemo } from "react";
import { companyConfig } from "@/config/company";

interface FAQCategory {
  category: string;
  items: Array<{ q: string; a: string }>;
}

interface FAQPageStructuredDataProps {
  faqCategories: FAQCategory[];
}

function normalizeValue(value: string | undefined | null) {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

export default function FAQPageStructuredData({ faqCategories }: FAQPageStructuredDataProps) {
  const structuredData = useMemo(() => {
    const mainEntity = faqCategories
      .flatMap((category) =>
        category.items.map((item) => {
          const question = normalizeValue(item.q);
          const answer = normalizeValue(item.a);

          if (!question || !answer) {
            return null;
          }

          return {
            "@type": "Question",
            name: question,
            acceptedAnswer: {
              "@type": "Answer",
              text: answer,
            },
          };
        }),
      )
      .filter((entry): entry is { "@type": "Question"; name: string; acceptedAnswer: { "@type": "Answer"; text: string } } => Boolean(entry));

    const publisherName = normalizeValue(companyConfig.brand.legalName);
    const publisherUrl = normalizeValue(companyConfig.brand.siteUrl);

    const data: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity,
      ...(publisherName && publisherUrl
        ? {
            publisher: {
              "@type": "Organization",
              name: publisherName,
              url: publisherUrl,
            },
          }
        : {}),
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
