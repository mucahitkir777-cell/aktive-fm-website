import type { CmsPageSlug, CmsPageSummary } from "@shared/cms";
import type { CmsPreviewViewport } from "./types";
import { fieldControlClass, fieldLabelClass, secondaryButtonClass, surfaceClass } from "./styles";

interface PreviewSectionProps {
  cmsPageOptions: CmsPageSummary[];
  selectedCmsSlug: CmsPageSlug;
  previewViewport: CmsPreviewViewport;
  previewRefreshKey: number;
  previewWidthClass: string;
  pagePath: string;
  pageTitle: string;
  onSelectSlug: (slug: CmsPageSlug) => void;
  onSelectViewport: (viewport: CmsPreviewViewport) => void;
  onEditContent: () => void;
  onRefreshPreview: () => void;
}

export default function PreviewSection({
  cmsPageOptions,
  selectedCmsSlug,
  previewViewport,
  previewRefreshKey,
  previewWidthClass,
  pagePath,
  pageTitle,
  onSelectSlug,
  onSelectViewport,
  onEditContent,
  onRefreshPreview,
}: PreviewSectionProps) {
  return (
    <div className="space-y-4">
      <div className={`${surfaceClass} flex flex-col gap-4 p-4 lg:flex-row lg:items-end lg:justify-between`}>
        <div className="grid gap-3 md:grid-cols-2">
          <label className={fieldLabelClass}>
            Seite
            <select
              value={selectedCmsSlug}
              onChange={(event) => onSelectSlug(event.target.value as CmsPageSlug)}
              className={fieldControlClass}
            >
              {cmsPageOptions.map((page) => (
                <option key={page.slug} value={page.slug}>
                  {page.title}
                </option>
              ))}
            </select>
          </label>

          <label className={fieldLabelClass}>
            Ansicht
            <select
              value={previewViewport}
              onChange={(event) => onSelectViewport(event.target.value as CmsPreviewViewport)}
              className={fieldControlClass}
            >
              <option value="desktop">Desktop</option>
              <option value="tablet">Tablet</option>
              <option value="mobile">Mobil</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onEditContent} className={secondaryButtonClass}>
            Inhalte bearbeiten
          </button>
          <button type="button" onClick={onRefreshPreview} className={secondaryButtonClass}>
            Vorschau neu laden
          </button>
        </div>
      </div>

      <div className={`${surfaceClass} p-4`}>
        <div className={`overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${previewWidthClass}`}>
          <iframe
            key={`${selectedCmsSlug}-${previewViewport}-${previewRefreshKey}`}
            src={pagePath}
            title={`Vorschau ${pageTitle}`}
            className="h-[780px] w-full bg-white"
          />
        </div>
      </div>
    </div>
  );
}
