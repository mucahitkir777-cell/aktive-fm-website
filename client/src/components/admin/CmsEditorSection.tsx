import type { ChangeEvent, FormEvent } from "react";
import type {
  CmsNavigationItem,
  CmsPage,
  CmsPageSlug,
  CmsPageStatus,
  CmsPageSummary,
  CmsSectionDefinition,
} from "@shared/cms";
import type { AdminMediaItem, CmsDraft, CmsDraftSection, CmsDraftValue, CmsSectionKey } from "./types";
import CmsNavigationEditor from "./CmsNavigationEditor";
import { fieldControlClass, fieldLabelClass, primaryButtonClass, secondaryButtonClass, surfaceClass } from "./styles";

interface CmsEditorSectionProps {
  cmsPageOptions: CmsPageSummary[];
  selectedCmsSlug: CmsPageSlug;
  cmsSections: readonly CmsSectionDefinition[];
  selectedCmsSectionKey: CmsSectionKey;
  cmsSelectedSection: CmsSectionDefinition;
  cmsDefinitionTitle: string;
  cmsPageStatus: CmsPageStatus;
  cmsPage: CmsPage | null;
  cmsDraft: CmsDraft;
  isGlobalNavigationSection: boolean;
  navigationDraftItems: CmsNavigationItem[];
  loadingCms: boolean;
  savingCms: boolean;
  mediaItems: AdminMediaItem[];
  loadingMedia: boolean;
  uploadingMedia: boolean;
  activeImageFieldKey: string | null;
  onSelectSlug: (slug: CmsPageSlug) => void;
  onSelectSection: (key: CmsSectionKey) => void;
  onMediaUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onCopyMediaUrl: (url: string) => void;
  onApplyMediaToActiveField: (url: string) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onSetCmsPageStatus: (status: CmsPageStatus) => void;
  onUpdateCmsField: (section: string, field: string, value: CmsDraftValue) => void;
  onUpdateNavigationItem: (index: number, nextValue: Partial<CmsNavigationItem>) => void;
  onRemoveNavigationItem: (id: string) => void;
  onAddNavigationItem: () => void;
  formatDate: (value: string) => string;
  formatFileSize: (bytes: number) => string;
}

export default function CmsEditorSection({
  cmsPageOptions,
  selectedCmsSlug,
  cmsSections,
  selectedCmsSectionKey,
  cmsSelectedSection,
  cmsDefinitionTitle,
  cmsPageStatus,
  cmsPage,
  cmsDraft,
  isGlobalNavigationSection,
  navigationDraftItems,
  loadingCms,
  savingCms,
  mediaItems,
  loadingMedia,
  uploadingMedia,
  activeImageFieldKey,
  onSelectSlug,
  onSelectSection,
  onMediaUpload,
  onCopyMediaUrl,
  onApplyMediaToActiveField,
  onSubmit,
  onReset,
  onSetCmsPageStatus,
  onUpdateCmsField,
  onUpdateNavigationItem,
  onRemoveNavigationItem,
  onAddNavigationItem,
  formatDate,
  formatFileSize,
}: CmsEditorSectionProps) {
  const navigationSection = (cmsDraft.navigation ?? {}) as CmsDraftSection;

  return (
    <div className="space-y-4">
      <div className={`${surfaceClass} p-4`}>
        <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)] xl:items-end">
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

          <div>
            <p className={fieldLabelClass}>Sektion</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {cmsSections.map((section) => (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => onSelectSection(section.key)}
                  className={
                    selectedCmsSectionKey === section.key
                      ? "rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                      : "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                  }
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`${surfaceClass} p-5`}>
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Medienverwaltung</h3>
              <p className="text-sm text-slate-500">Bilder hochladen und URL direkt in CMS-Felder verwenden.</p>
            </div>
            <label className={`${secondaryButtonClass} inline-flex items-center justify-center`}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={onMediaUpload}
                disabled={uploadingMedia}
                className="hidden"
              />
              {uploadingMedia ? "Upload läuft..." : "Bild hochladen"}
            </label>
          </div>

          {loadingMedia ? (
            <div className="py-6 text-sm text-slate-500">Medien werden geladen...</div>
          ) : mediaItems.length === 0 ? (
            <div className="py-6 text-sm text-slate-500">Noch keine Bilder hochgeladen.</div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {mediaItems.map((media) => (
                <div key={media.filename} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="aspect-[16/10] overflow-hidden rounded-md border border-slate-200 bg-white">
                    <img src={media.url} alt={media.filename} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <p className="mt-3 truncate text-xs font-medium text-slate-900">{media.filename}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatFileSize(media.size)} · {formatDate(media.uploadedAt)}</p>
                  <input
                    value={media.url}
                    readOnly
                    className="mt-2 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onCopyMediaUrl(media.url)}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-900 hover:bg-slate-50"
                    >
                      URL kopieren
                    </button>
                    {activeImageFieldKey && (
                      <button
                        type="button"
                        onClick={() => onApplyMediaToActiveField(media.url)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-900 hover:bg-slate-50"
                      >
                        In Feld übernehmen
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className={`${surfaceClass} p-5`}>
          <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">{cmsDefinitionTitle}</h3>
              <p className="text-sm text-slate-500">{cmsSelectedSection.label} bearbeiten</p>
            </div>
            <div className="flex flex-col items-start gap-2 text-sm text-slate-500 sm:items-end">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
                <select
                  value={cmsPageStatus}
                  onChange={(event) => onSetCmsPageStatus(event.target.value as CmsPageStatus)}
                  className={fieldControlClass}
                >
                  <option value="published">Veröffentlicht</option>
                  <option value="draft">Entwurf</option>
                </select>
              </label>
              <div>
                {cmsPage?.updatedAt ? `Zuletzt gespeichert: ${formatDate(cmsPage.updatedAt)}` : "Noch keine Speicherung"}
              </div>
            </div>
          </div>

          {loadingCms ? (
            <div className="py-10 text-center text-sm text-slate-500">CMS-Inhalte werden geladen...</div>
          ) : (
            <div className="mt-5 space-y-4">
              {isGlobalNavigationSection ? (
                <CmsNavigationEditor
                  navigationDraftItems={navigationDraftItems}
                  navigationSection={navigationSection}
                  onUpdateItem={onUpdateNavigationItem}
                  onRemoveItem={onRemoveNavigationItem}
                  onAddItem={onAddNavigationItem}
                  onChangeCtaLabel={(value) => onUpdateCmsField("navigation", "ctaLabel", value)}
                  onChangeCtaHref={(value) => onUpdateCmsField("navigation", "ctaHref", value)}
                />
              ) : (
                <>
                  {cmsSelectedSection.fields.map((field) => {
                    const sectionValue = (cmsDraft[cmsSelectedSection.key] ?? {}) as CmsDraftSection;
                    const fieldKey = String(field.key);
                    const inputType = field.input;
                    const rawValue = sectionValue[fieldKey];
                    const textValue = typeof rawValue === "string" ? rawValue : rawValue == null ? "" : String(rawValue);
                    const checkedValue =
                      typeof rawValue === "boolean"
                        ? rawValue
                        : rawValue == null
                          ? true
                          : String(rawValue).trim().toLowerCase() !== "false";
                    const parsedNumber = typeof rawValue === "number" ? rawValue : Number.parseInt(String(rawValue ?? ""), 10);
                    const numberValue = Number.isNaN(parsedNumber) ? "" : parsedNumber;

                    return (
                      <label key={fieldKey} className={fieldLabelClass}>
                        {field.label}
                        {inputType === "textarea" ? (
                          <textarea
                            value={textValue}
                            onChange={(event) => onUpdateCmsField(cmsSelectedSection.key, fieldKey, event.target.value)}
                            rows={typeof field.rows === "number" ? field.rows : 4}
                            className={fieldControlClass}
                          />
                        ) : inputType === "checkbox" ? (
                          <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                            <input
                              type="checkbox"
                              checked={checkedValue}
                              onChange={(event) => onUpdateCmsField(cmsSelectedSection.key, fieldKey, event.target.checked)}
                            />
                            <span className="text-sm text-slate-900">{checkedValue ? "Ja" : "Nein"}</span>
                          </div>
                        ) : inputType === "number" ? (
                          <input
                            type="number"
                            min={1}
                            step={1}
                            value={numberValue}
                            onChange={(event) => {
                              const nextValue = Number.parseInt(event.target.value, 10);
                              if (Number.isNaN(nextValue)) {
                                return;
                              }
                              onUpdateCmsField(cmsSelectedSection.key, fieldKey, nextValue);
                            }}
                            className={fieldControlClass}
                          />
                        ) : (
                          <input
                            value={textValue}
                            onChange={(event) => onUpdateCmsField(cmsSelectedSection.key, fieldKey, event.target.value)}
                            className={fieldControlClass}
                          />
                        )}
                      </label>
                    );
                  })}
                </>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
            <button type="button" onClick={onReset} className={secondaryButtonClass}>
              Reset
            </button>
            <button type="submit" disabled={savingCms || loadingCms} className={primaryButtonClass}>
              {savingCms ? "Speichert..." : "Speichern"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
