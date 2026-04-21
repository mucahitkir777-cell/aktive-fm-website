import type { CmsPage, CmsPageSlug } from "@shared/cms";

interface CmsPageResponse<TSlug extends CmsPageSlug> {
  success: boolean;
  page?: CmsPage<TSlug>;
}

const PUBLIC_CMS_CACHE_PREFIX = "proclean:cms:public:v1:";
const inFlightPublicCmsRequests = new Map<CmsPageSlug, Promise<CmsPage<CmsPageSlug> | null>>();

function getCachedPublicCmsPage<TSlug extends CmsPageSlug>(slug: TSlug): CmsPage<TSlug> | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(`${PUBLIC_CMS_CACHE_PREFIX}${slug}`);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CmsPage<TSlug>;
  } catch {
    return null;
  }
}

function setCachedPublicCmsPage<TSlug extends CmsPageSlug>(slug: TSlug, page: CmsPage<TSlug>) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(`${PUBLIC_CMS_CACHE_PREFIX}${slug}`, JSON.stringify(page));
}

export async function fetchPublicCmsPage<TSlug extends CmsPageSlug>(slug: TSlug): Promise<CmsPage<TSlug> | null> {
  const cachedPage = getCachedPublicCmsPage(slug);
  if (cachedPage) {
    return cachedPage;
  }

  const inFlightRequest = inFlightPublicCmsRequests.get(slug) as Promise<CmsPage<TSlug> | null> | undefined;
  if (inFlightRequest) {
    return inFlightRequest;
  }

  const request = (async () => {
    const response = await fetch(`/api/content/pages/${slug}`);
    const result = (await response.json().catch(() => null)) as CmsPageResponse<TSlug> | null;

    if (!response.ok || !result?.success || !result.page) {
      return null;
    }

    setCachedPublicCmsPage(slug, result.page);
    return result.page;
  })();

  inFlightPublicCmsRequests.set(slug, request as Promise<CmsPage<CmsPageSlug> | null>);

  try {
    return await request;
  } finally {
    inFlightPublicCmsRequests.delete(slug);
  }
}
