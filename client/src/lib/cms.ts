import type { CmsPage, CmsPageSlug } from "@shared/cms";

interface CmsPageResponse<TSlug extends CmsPageSlug> {
  success: boolean;
  page?: CmsPage<TSlug>;
}

export async function fetchPublicCmsPage<TSlug extends CmsPageSlug>(slug: TSlug): Promise<CmsPage<TSlug> | null> {
  const response = await fetch(`/api/content/pages/${slug}`);
  const result = (await response.json().catch(() => null)) as CmsPageResponse<TSlug> | null;

  if (!response.ok || !result?.success || !result.page) {
    return null;
  }

  return result.page;
}
