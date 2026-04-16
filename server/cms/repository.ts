import {
  cmsPageDefinitions,
  cmsPageSchemas,
  cmsPageSlugs,
  getDefaultCmsPageContent,
  type CmsPage,
  type CmsPageContentMap,
  type CmsPageSlug,
  type CmsPageSummary,
} from "../../shared/cms";
import { getDbPool } from "../db";

interface CmsPageRow {
  slug: string;
  title: string;
  path: string;
  content: unknown;
  updated_at: Date | string;
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function parseCmsPageContent<TSlug extends CmsPageSlug>(
  slug: TSlug,
  content: unknown,
): CmsPageContentMap[TSlug] {
  const schema = cmsPageSchemas[slug];
  const parsed = schema.safeParse(content);
  if (parsed.success) {
    return parsed.data as CmsPageContentMap[TSlug];
  }

  return getDefaultCmsPageContent(slug);
}

function mapCmsPageRow<TSlug extends CmsPageSlug>(row: CmsPageRow, slug: TSlug): CmsPage<TSlug> {
  return {
    slug,
    title: row.title,
    path: row.path,
    content: parseCmsPageContent(slug, row.content),
    updatedAt: toIsoString(row.updated_at),
  };
}

export async function ensureCmsPageDefaults() {
  const db = getDbPool();

  for (const slug of cmsPageSlugs) {
    const definition = cmsPageDefinitions[slug];
    await db.query(
      `
        INSERT INTO cms_pages (slug, title, path, content)
        VALUES ($1, $2, $3, $4::jsonb)
        ON CONFLICT (slug) DO NOTHING
      `,
      [slug, definition.title, definition.path, JSON.stringify(getDefaultCmsPageContent(slug))],
    );
  }
}

export async function listCmsPages(): Promise<CmsPageSummary[]> {
  const db = getDbPool();
  const result = await db.query<CmsPageRow>(
    `
      SELECT slug, title, path, content, updated_at
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
      SELECT slug, title, path, content, updated_at
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
  const result = await db.query<CmsPageRow>(
    `
      INSERT INTO cms_pages (slug, title, path, content, updated_at)
      VALUES ($1, $2, $3, $4::jsonb, NOW())
      ON CONFLICT (slug)
      DO UPDATE SET
        title = EXCLUDED.title,
        path = EXCLUDED.path,
        content = EXCLUDED.content,
        updated_at = NOW()
      RETURNING slug, title, path, content, updated_at
    `,
    [slug, definition.title, definition.path, JSON.stringify(content)],
  );

  return mapCmsPageRow(result.rows[0], slug);
}
