import { useMemo } from "react";
import { companyConfig } from "@/config/company";

interface FAQCategory {
  category: string;
  items: Array<{ q: string; a: string }>;
}

interface FAQPageStructuredDataProps {
  faqCategories: FAQCategory[];
  pagePath: string;
}

function normalizeValue(value: string | undefined | null) {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

export default function FAQPageStructuredData({ faqCategories, pagePath }: FAQPageStructuredDataProps) {
  const structuredData = useMemo(() => {
    const seenEntries = new Set<string>();

    const publisherName = normalizeValue(companyConfig.brand.legalName) ?? normalizeValue(companyConfig.brand.name);
    const publisherUrl = normalizeValue(companyConfig.brand.siteUrl);
    const normalizedPagePath = normalizeValue(pagePath);
    const pageUrl =
      publisherUrl && normalizedPagePath
        ? `${publisherUrl}${normalizedPagePath}`
        : undefined;
    const pageId = pageUrl ? `${pageUrl}#faqpage` : undefined;

    const mainEntity = faqCategories
      .flatMap((category) =>
        category.items.map((item) => {
          const question = normalizeValue(item.q);
          const answer = normalizeValue(item.a);

          if (!question || !answer) {
            return null;
          }

          const entryKey = `${question}::${answer}`;
          if (seenEntries.has(entryKey)) {
            return null;
          }
          seenEntries.add(entryKey);

          return {
            entryKey,
            question,
            answer,
          };
        }),
      )
      .filter((entry): entry is { entryKey: string; question: string; answer: string } => Boolean(entry))
      .map((entry, index) => ({
        "@type": "Question",
        ...(pageUrl ? { "@id": `${pageUrl}#faq-${index + 1}` } : {}),
        name: entry.question,
        acceptedAnswer: {
          "@type": "Answer",
          ...(pageUrl ? { "@id": `${pageUrl}#answer-${index + 1}` } : {}),
          text: entry.answer,
        },
      }));

    const data: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      ...(pageId ? { "@id": pageId } : {}),
      ...(pageUrl ? { url: pageUrl, mainEntityOfPage: pageUrl } : {}),
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
  }, [faqCategories, pagePath]);

  if (structuredData.mainEntity.length === 0) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
