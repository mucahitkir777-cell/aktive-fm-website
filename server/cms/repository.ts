import {
  cmsPageDefinitions,
  cmsPageSlugs,
  getDefaultCmsPageContent,
  normalizeCmsPageContent,
  type CmsGlobalContent,
  type CmsNavigationItem,
  type CmsPage,
  type CmsPageContentMap,
  type CmsPageSlug,
  type CmsPageStatus,
  type CmsPageSummary,
} from "@shared/cms";
import { getDbPool } from "../db";

interface CmsPageRow {
  slug: string;
  title: string;
  path: string;
  content: unknown;
  status: string;
  updated_at: Date | string;
}

const legacyNavigationMapping = [
  { id: "home", label: "Startseite", href: "/", keyPrefix: "home" },
  { id: "services", label: "Leistungen", href: "/leistungen", keyPrefix: "services" },
  { id: "about", label: "Über uns", href: "/ueber-uns", keyPrefix: "about" },
  { id: "faq", label: "FAQ", href: "/faq", keyPrefix: "faq" },
  { id: "contact", label: "Kontakt", href: "/kontakt", keyPrefix: "contact" },
] as const;

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function normalizePageStatus(value: string | null | undefined): CmsPageStatus {
  return value === "draft" ? "draft" : "published";
}

function sortNavigationItems(items: CmsNavigationItem[]) {
  return [...items].sort((left, right) => {
    if (left.sortOrder === right.sortOrder) {
      return left.id.localeCompare(right.id);
    }
    return left.sortOrder - right.sortOrder;
  });
}

function withSortedGlobalNavigation(content: CmsGlobalContent): CmsGlobalContent {
  return {
    ...content,
    navigation: {
      ...content.navigation,
      items: sortNavigationItems(content.navigation.items),
    },
  };
}

function parseCmsPageContent<TSlug extends CmsPageSlug>(
  slug: TSlug,
  content: unknown,
): CmsPageContentMap[TSlug] {
  const normalized = normalizeCmsPageContent(slug, content);
  if (slug === "global") {
    return withSortedGlobalNavigation(normalized as CmsGlobalContent) as CmsPageContentMap[TSlug];
  }

  return normalized;
}

function hasLegacyGlobalNavigation(content: unknown): boolean {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return false;
  }

  const typedContent = content as Record<string, unknown>;
  const navigation =
    typedContent.navigation && typeof typedContent.navigation === "object" && !Array.isArray(typedContent.navigation)
      ? (typedContent.navigation as Record<string, unknown>)
      : null;

  if (!navigation) {
    return false;
  }

  return legacyNavigationMapping.some((item) =>
    Object.prototype.hasOwnProperty.call(navigation, `${item.keyPrefix}Label`),
  );
}

function migrateLegacyGlobalNavigation(content: unknown): CmsGlobalContent {
  const fallback = normalizeCmsPageContent("global", content);

  if (!hasLegacyGlobalNavigation(content)) {
    return withSortedGlobalNavigation(fallback);
  }

  const typedContent = content as Record<string, unknown>;
  const navigation = typedContent.navigation as Record<string, unknown>;
  const existingItemsById = new Map(
    fallback.navigation.items.map((item) => [item.id, item] as const),
  );

  const migratedItems: CmsNavigationItem[] = legacyNavigationMapping.map((legacyItem, index) => {
    const existing = existingItemsById.get(legacyItem.id);
    const label = navigation[`${legacyItem.keyPrefix}Label`];
    const href = navigation[`${legacyItem.keyPrefix}Href`];
    const visible = navigation[`${legacyItem.keyPrefix}Visible`];
    const sortOrder = navigation[`${legacyItem.keyPrefix}SortOrder`];

    return {
      id: legacyItem.id,
      label:
        typeof label === "string" && label.trim()
          ? label.trim()
          : (existing?.label ?? legacyItem.label),
      href:
        typeof href === "string" && href.trim()
          ? href.trim()
          : (existing?.href ?? legacyItem.href),
      visible: typeof visible === "boolean" ? visible : (existing?.visible ?? true),
      sortOrder:
        typeof sortOrder === "number" && Number.isFinite(sortOrder)
          ? Math.max(1, Math.floor(sortOrder))
          : (existing?.sortOrder ?? index + 1),
      type: existing?.type ?? "page",
      target: existing?.target ?? "_self",
    };
  });

  return {
    ...fallback,
    navigation: {
      ...fallback.navigation,
      items: sortNavigationItems(migratedItems),
      ctaLabel:
        typeof navigation.ctaLabel === "string" && navigation.ctaLabel.trim()
          ? navigation.ctaLabel.trim()
          : fallback.navigation.ctaLabel,
      ctaHref:
        typeof navigation.ctaHref === "string" && navigation.ctaHref.trim()
          ? navigation.ctaHref.trim()
          : fallback.navigation.ctaHref,
    },
  };
}

function mapCmsPageRow<TSlug extends CmsPageSlug>(row: CmsPageRow, slug: TSlug): CmsPage<TSlug> {
  const parsedContent = parseCmsPageContent(slug, row.content);
  return {
    slug,
    title: row.title,
    path: row.path,
    content: parsedContent,
    updatedAt: toIsoString(row.updated_at),
    status: normalizePageStatus(row.status),
  };
}

export async function ensureCmsPageDefaults() {
  const db = getDbPool();

  for (const slug of cmsPageSlugs) {
    const definition = cmsPageDefinitions[slug];
    const defaultContent = getDefaultCmsPageContent(slug);

    await db.query(
      `
        INSERT INTO cms_pages (slug, title, path, content, status)
        VALUES ($1, $2, $3, $4::jsonb, 'published')
        ON CONFLICT (slug) DO NOTHING
      `,
      [slug, definition.title, definition.path, JSON.stringify(defaultContent)],
    );

    const rowResult = await db.query<CmsPageRow>(
      `
        SELECT slug, title, path, content, status, updated_at
        FROM cms_pages
        WHERE slug = $1
        LIMIT 1
      `,
      [slug],
    );

    const row = rowResult.rows[0];
    if (!row) {
      continue;
    }

    const normalizedContent =
      slug === "global"
        ? migrateLegacyGlobalNavigation(row.content)
        : parseCmsPageContent(slug, row.content);
    const normalizedStatus = normalizePageStatus(row.status);

    const needsMigration =
      JSON.stringify(row.content) !== JSON.stringify(normalizedContent)
      || row.status !== normalizedStatus
      || row.title !== definition.title
      || row.path !== definition.path;

    if (!needsMigration) {
      continue;
    }

    await db.query(
      `
        UPDATE cms_pages
        SET
          title = $2,
          path = $3,
          content = $4::jsonb,
          status = $5,
          updated_at = NOW()
        WHERE slug = $1
      `,
      [
        slug,
        definition.title,
        definition.path,
        JSON.stringify(normalizedContent),
        normalizedStatus,
      ],
    );
  }
}

export async function listCmsPages(): Promise<CmsPageSummary[]> {
  const db = getDbPool();
  const result = await db.query<CmsPageRow>(
    `
      SELECT slug, title, path, content, status, updated_at
      FROM cms_pages
      ORDER BY path ASC
    `,
  );

  return result.rows
    .map((row) => {
      const parsedSlug = cmsPageSlugs.find((value) => value === row.slug);
      if (!parsedSlug) {
        return null;
      }

      const page = mapCmsPageRow(row, parsedSlug);
      return {
        slug: page.slug,
        title: page.title,
        path: page.path,
        updatedAt: page.updatedAt,
        status: page.status,
      };
    })
    .filter((page): page is CmsPageSummary => page !== null);
}

export async function getCmsPage<TSlug extends CmsPageSlug>(slug: TSlug): Promise<CmsPage<TSlug> | null> {
  const db = getDbPool();
  const result = await db.query<CmsPageRow>(
    `
      SELECT slug, title, path, content, status, updated_at
      FROM cms_pages
      WHERE slug = $1
      LIMIT 1
    `,
    [slug],
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  return mapCmsPageRow(row, slug);
}

interface UpdateCmsPageInput<TSlug extends CmsPageSlug> {
  content: CmsPageContentMap[TSlug];
  status: CmsPageStatus;
}

export async function updateCmsPageContent<TSlug extends CmsPageSlug>(
  slug: TSlug,
  input: UpdateCmsPageInput<TSlug>,
): Promise<CmsPage<TSlug>> {
  const db = getDbPool();
  const definition = cmsPageDefinitions[slug];
  const normalizedContent = parseCmsPageContent(slug, input.content);
  const normalizedStatus = normalizePageStatus(input.status);

  const result = await db.query<CmsPageRow>(
    `
      INSERT INTO cms_pages (slug, title, path, content, status, updated_at)
      VALUES ($1, $2, $3, $4::jsonb, $5, NOW())
      ON CONFLICT (slug)
      DO UPDATE SET
        title = EXCLUDED.title,
        path = EXCLUDED.path,
        content = EXCLUDED.content,
        status = EXCLUDED.status,
        updated_at = NOW()
      RETURNING slug, title, path, content, status, updated_at
    `,
    [slug, definition.title, definition.path, JSON.stringify(normalizedContent), normalizedStatus],
  );

  return mapCmsPageRow(result.rows[0], slug);
}
