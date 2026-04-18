import type { CmsNavigationItem } from "@shared/cms";
import type { CmsDraftSection } from "./types";
import { fieldControlClass, fieldLabelClass, infoPanelClass, secondaryButtonClass } from "./styles";

interface CmsNavigationEditorProps {
  navigationDraftItems: CmsNavigationItem[];
  navigationSection: CmsDraftSection;
  onUpdateItem: (index: number, nextValue: Partial<CmsNavigationItem>) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: () => void;
  onChangeCtaLabel: (value: string) => void;
  onChangeCtaHref: (value: string) => void;
}

export default function CmsNavigationEditor({
  navigationDraftItems,
  navigationSection,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
  onChangeCtaLabel,
  onChangeCtaHref,
}: CmsNavigationEditorProps) {
  return (
    <>
      <div className="space-y-3">
        {navigationDraftItems.map((item, index) => (
          <div key={item.id} className={infoPanelClass}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">{item.id}</p>
              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-900 hover:bg-slate-50"
              >
                Entfernen
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className={fieldLabelClass}>
                Label
                <input
                  value={item.label}
                  onChange={(event) => onUpdateItem(index, { label: event.target.value })}
                  className={fieldControlClass}
                />
              </label>

              <label className={fieldLabelClass}>
                Pfad / URL
                <input
                  value={item.href}
                  onChange={(event) => onUpdateItem(index, { href: event.target.value })}
                  className={fieldControlClass}
                />
              </label>

              <label className={fieldLabelClass}>
                Typ
                <select
                  value={item.type}
                  onChange={(event) => onUpdateItem(index, { type: event.target.value as CmsNavigationItem["type"] })}
                  className={fieldControlClass}
                >
                  <option value="page">Seite</option>
                  <option value="custom">Eigener Link</option>
                </select>
              </label>

              <label className={fieldLabelClass}>
                Ziel
                <select
                  value={item.target}
                  onChange={(event) => onUpdateItem(index, { target: event.target.value as CmsNavigationItem["target"] })}
                  className={fieldControlClass}
                >
                  <option value="_self">Gleiches Tab</option>
                  <option value="_blank">Neues Tab</option>
                </select>
              </label>

              <label className={fieldLabelClass}>
                Sichtbar
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <input
                    type="checkbox"
                    checked={item.visible}
                    onChange={(event) => onUpdateItem(index, { visible: event.target.checked })}
                  />
                  <span className="text-sm text-slate-900">{item.visible ? "Ja" : "Nein"}</span>
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={onAddItem} className={secondaryButtonClass}>
        Link hinzufügen
      </button>

      <label className={fieldLabelClass}>
        CTA Label
        <input
          value={String(navigationSection.ctaLabel ?? "")}
          onChange={(event) => onChangeCtaLabel(event.target.value)}
          className={fieldControlClass}
        />
      </label>

      <label className={fieldLabelClass}>
        CTA Pfad
        <input
          value={String(navigationSection.ctaHref ?? "")}
          onChange={(event) => onChangeCtaHref(event.target.value)}
          className={fieldControlClass}
        />
      </label>
    </>
  );
}
