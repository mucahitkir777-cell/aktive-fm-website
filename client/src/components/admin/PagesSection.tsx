import type { CmsPageSlug, CmsPageSummary } from "@shared/cms";
import { neutralBadgeClass, secondaryButtonClass, surfacePanelClass } from "./styles";

interface PagesSectionProps {
  pages: CmsPageSummary[];
  formatDate: (value: string) => string;
  onEditContent: (slug: CmsPageSlug) => void;
  onOpenPreview: (slug: CmsPageSlug) => void;
}

export default function PagesSection({ pages, formatDate, onEditContent, onOpenPreview }: PagesSectionProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {pages.map((page) => (
        <div key={page.slug} className={surfacePanelClass}>
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">{page.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{page.path}</p>
              <p className="mt-3 text-sm text-slate-500">
                {page.updatedAt ? `Zuletzt aktualisiert: ${formatDate(page.updatedAt)}` : "Noch nicht gespeichert."}
              </p>
            </div>
            <span className={neutralBadgeClass}>{page.slug}</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => onEditContent(page.slug)} className={secondaryButtonClass}>
              Inhalte bearbeiten
            </button>
            <button type="button" onClick={() => onOpenPreview(page.slug)} className={secondaryButtonClass}>
              Vorschau öffnen
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
