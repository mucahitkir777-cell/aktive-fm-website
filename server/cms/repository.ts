import {
  cmsPageDefinitions,
  cmsPageSlugs,
  getDefaultCmsPageContent,
  normalizeCmsPageContent,
  type CmsPage,
  type CmsPageContentMap,
  type CmsPageSlug,
  type CmsPageStatus,
  type CmsPageSummary,
} from "../../shared/cms";
import { getDbPool } from "../db";

interface CmsPageRow {
  slug: string;
  title: string;
  path: string;
  content: unknown;
  status: string;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: Date | string;
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function parseCmsPageContent<TSlug extends CmsPageSlug>(
  slug: TSlug,
  content: unknown,
): CmsPageContentMap[TSlug] {
  return normalizeCmsPageContent(slug, content);
}

function normalizePageStatus(value: string | null | undefined): CmsPageStatus {
  return value === "draft" ? "draft" : "published";
}

function extractSeoFromContent<TSlug extends CmsPageSlug>(
  slug: TSlug,
  content: CmsPageContentMap[TSlug],
): { seoTitle: string; seoDescription: string } {
  const fallback = { seoTitle: "", seoDescription: "" };
  if (slug === "global") {
    return fallback;
  }

  const typedContent = content as unknown as { seo?: { seoTitle?: string; seoDescription?: string } };
  const seoSection = typedContent.seo;
  return {
    seoTitle: typeof seoSection?.seoTitle === "string" ? seoSection.seoTitle : "",
    seoDescription: typeof seoSection?.seoDescription === "string" ? seoSection.seoDescription : "",
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
    seoTitle: row.seo_title ?? extractSeoFromContent(slug, parsedContent).seoTitle,
    seoDescription: row.seo_description ?? extractSeoFromContent(slug, parsedContent).seoDescription,
  };
}

export async function ensureCmsPageDefaults() {
  const db = getDbPool();

  for (const slug of cmsPageSlugs) {
    const definition = cmsPageDefinitions[slug];
    const defaultContent = getDefaultCmsPageContent(slug);
    const seo = extractSeoFromContent(slug, defaultContent);
    await db.query(
      `
        INSERT INTO cms_pages (slug, title, path, content, status, seo_title, seo_description)
        VALUES ($1, $2, $3, $4::jsonb, 'published', $5, $6)
        ON CONFLICT (slug) DO NOTHING
      `,
      [slug, definition.title, definition.path, JSON.stringify(defaultContent), seo.seoTitle, seo.seoDescription],
    );

    const rowResult = await db.query<CmsPageRow>(
      `
        SELECT slug, title, path, content, status, seo_title, seo_description, updated_at
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

    const normalizedContent = normalizeCmsPageContent(slug, row.content);
    const normalizedSeo = extractSeoFromContent(slug, normalizedContent);
    const nextSeoTitle = row.seo_title ?? normalizedSeo.seoTitle;
    const nextSeoDescription = row.seo_description ?? normalizedSeo.seoDescription;
    const needsMigration =
      JSON.stringify(row.content) !== JSON.stringify(normalizedContent)
      || normalizePageStatus(row.status) !== row.status
      || row.seo_title === null
      || row.seo_description === null;

    if (needsMigration) {
      await db.query(
        `
          UPDATE cms_pages
          SET
            title = $2,
            path = $3,
            content = $4::jsonb,
            status = $5,
            seo_title = $6,
            seo_description = $7,
            updated_at = NOW()
          WHERE slug = $1
        `,
        [
          slug,
          definition.title,
          definition.path,
          JSON.stringify(normalizedContent),
          normalizePageStatus(row.status),
          nextSeoTitle,
          nextSeoDescription,
        ],
      );
    }
  }
}

export async function listCmsPages(): Promise<CmsPageSummary[]> {
  const db = getDbPool();
  const result = await db.query<CmsPageRow>(
    `
      SELECT slug, title, path, content, status, seo_title, seo_description, updated_at
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
      };
    })
    .filter((page): page is CmsPageSummary => page !== null);
}

export async function getCmsPage<TSlug extends CmsPageSlug>(slug: TSlug): Promise<CmsPage<TSlug> | null> {
  const db = getDbPool();
  const result = await db.query<CmsPageRow>(
    `
      SELECT slug, title, path, content, status, seo_title, seo_description, updated_at
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

export async function updateCmsPageContent<TSlug extends CmsPageSlug>(
  slug: TSlug,
  content: CmsPageContentMap[TSlug],
): Promise<CmsPage<TSlug>> {
  const db = getDbPool();
  const definition = cmsPageDefinitions[slug];
  const seo = extractSeoFromContent(slug, content);
  const result = await db.query<CmsPageRow>(
    `
      INSERT INTO cms_pages (slug, title, path, content, status, seo_title, seo_description, updated_at)
      VALUES ($1, $2, $3, $4::jsonb, 'published', $5, $6, NOW())
      ON CONFLICT (slug)
      DO UPDATE SET
        title = EXCLUDED.title,
        path = EXCLUDED.path,
        content = EXCLUDED.content,
        status = COALESCE(cms_pages.status, EXCLUDED.status),
        seo_title = EXCLUDED.seo_title,
        seo_description = EXCLUDED.seo_description,
        updated_at = NOW()
      RETURNING slug, title, path, content, status, seo_title, seo_description, updated_at
    `,
    [slug, definition.title, definition.path, JSON.stringify(content), seo.seoTitle, seo.seoDescription],
  );

  return mapCmsPageRow(result.rows[0], slug);
}
