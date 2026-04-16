interface ApplyPageSeoOptions {
  title: string;
  description: string;
}

export function applyPageSeo({ title, description }: ApplyPageSeoOptions) {
  document.title = title;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute("content", description);
  }
}

export function resolveSeoValue(primary: string | undefined, fallback: string) {
  const normalizedPrimary = primary?.trim();
  if (normalizedPrimary) {
    return normalizedPrimary;
  }

  return fallback;
}

