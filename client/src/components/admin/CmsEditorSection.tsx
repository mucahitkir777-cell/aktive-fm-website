import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type {
  CmsNavigationItem,
  CmsPage,
  CmsPageSlug,
  CmsPageStatus,
  CmsPageSummary,
  CmsSectionDefinition,
} from "@shared/cms";
import type {
  AdminMediaItem,
  CmsDraft,
  CmsDraftSection,
  CmsDraftValue,
  CmsImagePlacementOption,
  CmsSectionKey,
} from "./types";
import CmsNavigationEditor from "./CmsNavigationEditor";
import {
  fieldControlClass,
  fieldLabelClass,
  primaryButtonClass,
  secondaryButtonClass,
  subtleSurfaceClass,
  surfacePanelClass,
} from "./styles";

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
  imagePlacementOptions: CmsImagePlacementOption[];
  selectedImagePlacementKey: string;
  autoApplyUploadedMedia: boolean;
  onSelectSlug: (slug: CmsPageSlug) => void;
  onSelectSection: (key: CmsSectionKey) => void;
  onSelectImagePlacementKey: (value: string) => void;
  onSetAutoApplyUploadedMedia: (value: boolean) => void;
  onPickMediaFile: (file: File, placementKey?: string) => Promise<void> | void;
  onCopyMediaUrl: (url: string) => void;
  onApplyMediaToPlacement: (url: string, placementKey?: string) => void;
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
  imagePlacementOptions,
  selectedImagePlacementKey,
  autoApplyUploadedMedia,
  onSelectSlug,
  onSelectSection,
  onSelectImagePlacementKey,
  onSetAutoApplyUploadedMedia,
  onPickMediaFile,
  onCopyMediaUrl,
  onApplyMediaToPlacement,
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [visibleMediaCount, setVisibleMediaCount] = useState(24);
  const hasImagePlacementOptions = imagePlacementOptions.length > 0;

  const selectedImagePlacement = useMemo(
    () => imagePlacementOptions.find((option) => option.key === selectedImagePlacementKey) ?? null,
    [imagePlacementOptions, selectedImagePlacementKey],
  );

  const visibleMediaItems = useMemo(
    () => mediaItems.slice(0, visibleMediaCount),
    [mediaItems, visibleMediaCount],
  );
  const remainingMediaCount = Math.max(0, mediaItems.length - visibleMediaItems.length);

  useEffect(() => {
    setVisibleMediaCount(24);
  }, [selectedCmsSlug]);

  const placementKeyForNextUpload = autoApplyUploadedMedia ? selectedImagePlacementKey : undefined;

  const handleMediaInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    void onPickMediaFile(file, placementKeyForNextUpload);
  };

  const openMediaPicker = async () => {
    if (uploadingMedia) {
      return;
    }

    type PickerFileHandle = { getFile: () => Promise<File> };
    type PickerWindow = Window & {
      showOpenFilePicker?: (options?: unknown) => Promise<PickerFileHandle[]>;
    };

    const picker = (window as PickerWindow).showOpenFilePicker;

    if (picker) {
      try {
        const handles = await picker({
          multiple: false,
          types: [
            {
              description: "Bilddateien",
              accept: {
                "image/jpeg": [".jpg", ".jpeg"],
                "image/png": [".png"],
                "image/webp": [".webp"],
                "image/gif": [".gif"],
              },
            },
          ],
        });
        const selectedFile = await handles[0]?.getFile();
        if (selectedFile) {
          void onPickMediaFile(selectedFile, placementKeyForNextUpload);
        }
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    window.requestAnimationFrame(() => {
      fileInputRef.current?.click();
    });
  };

  return (
    <div className="space-y-4">
      <div className={surfacePanelClass}>
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
                      ? "rounded-lg border border-slate-900 bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_-18px_rgba(15,33,55,0.95)]"
                      : "rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50"
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
        <div className={surfacePanelClass}>
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Medienverwaltung</h3>
              <p className="mt-1 text-sm text-slate-500">Bilder hochladen und URLs direkt in CMS-Felder übernehmen.</p>
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={fieldLabelClass}>
                  Ziel-Platzierung
                  <select
                    value={selectedImagePlacementKey}
                    onChange={(event) => onSelectImagePlacementKey(event.target.value)}
                    disabled={!hasImagePlacementOptions}
                    className={fieldControlClass}
                  >
                    {hasImagePlacementOptions ? (
                      imagePlacementOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))
                    ) : (
                      <option value="">Keine Bildfelder verfügbar</option>
                    )}
                  </select>
                </label>

                <label className="mt-6 flex items-center gap-2 text-sm text-slate-700 sm:mt-7">
                  <input
                    type="checkbox"
                    checked={autoApplyUploadedMedia}
                    onChange={(event) => onSetAutoApplyUploadedMedia(event.target.checked)}
                    disabled={!selectedImagePlacement}
                  />
                  Nach Upload direkt zuweisen
                </label>
              </div>

              <div className="flex flex-wrap items-start justify-start gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    void openMediaPicker();
                  }}
                  disabled={uploadingMedia}
                  className={secondaryButtonClass}
                >
                  {uploadingMedia ? "Upload läuft..." : "Bild hochladen"}
                </button>
              </div>
            </div>

            <div className={subtleSurfaceClass}>
              <p className="text-xs text-slate-500">
                {selectedImagePlacement
                  ? `Aktives Ziel: ${selectedImagePlacement.label}`
                  : "Wählen Sie ein Bildfeld als Ziel aus."}
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleMediaInputChange}
              disabled={uploadingMedia}
              className="hidden"
            />
          </div>

          {loadingMedia ? (
            <div className="py-6 text-sm text-slate-500">Medien werden geladen...</div>
          ) : mediaItems.length === 0 ? (
            <div className="py-6 text-sm text-slate-500">Noch keine Bilder hochgeladen.</div>
          ) : (
            <>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visibleMediaItems.map((media) => (
                  <div key={media.filename} className={subtleSurfaceClass}>
                    <div className="aspect-[16/10] overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <img src={media.url} alt={media.filename} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <p className="mt-3 truncate text-xs font-semibold text-slate-900">{media.filename}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatFileSize(media.size)} · {formatDate(media.uploadedAt)}
                    </p>
                    <input
                      value={media.url}
                      readOnly
                      className={`${fieldControlClass} mt-2 px-2.5 py-2 text-xs`}
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onCopyMediaUrl(media.url)}
                        className={secondaryButtonClass}
                      >
                        URL kopieren
                      </button>
                      {selectedImagePlacement && (
                        <button
                          type="button"
                          onClick={() => onApplyMediaToPlacement(media.url)}
                          className={secondaryButtonClass}
                        >
                          In Ziel übernehmen
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {remainingMediaCount > 0 && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleMediaCount((current) => current + 24)}
                    className={secondaryButtonClass}
                  >
                    Weitere Medien laden ({remainingMediaCount})
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <form onSubmit={onSubmit} className={surfacePanelClass}>
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">{cmsDefinitionTitle}</h3>
              <p className="mt-1 text-sm text-slate-500">{cmsSelectedSection.label} bearbeiten</p>
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
                          <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
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

          <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
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
