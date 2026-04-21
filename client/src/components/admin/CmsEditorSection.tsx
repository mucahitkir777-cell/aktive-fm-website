import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Eye, ImagePlus, Monitor, Search, Smartphone, Tablet } from "lucide-react";
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
  CmsPreviewViewport,
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
  previewViewport: CmsPreviewViewport;
  previewRefreshKey: number;
  previewWidthClass: string;
  pagePath: string;
  pageTitle: string;
  onSelectViewport: (viewport: CmsPreviewViewport) => void;
  onRefreshPreview: () => void;
  onOpenFullPreview: () => void;
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
  previewViewport,
  previewRefreshKey,
  previewWidthClass,
  pagePath,
  pageTitle,
  onSelectViewport,
  onRefreshPreview,
  onOpenFullPreview,
}: CmsEditorSectionProps) {
  const navigationSection = (cmsDraft.navigation ?? {}) as CmsDraftSection;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [expandedImageFieldKey, setExpandedImageFieldKey] = useState<string>("");
  const [mediaSearchQuery, setMediaSearchQuery] = useState("");
  const [visibleFieldMediaCount, setVisibleFieldMediaCount] = useState(24);
  const hasImagePlacementOptions = imagePlacementOptions.length > 0;

  const selectedImagePlacement = useMemo(
    () => imagePlacementOptions.find((option) => option.key === selectedImagePlacementKey) ?? null,
    [imagePlacementOptions, selectedImagePlacementKey],
  );

  useEffect(() => {
    setExpandedImageFieldKey("");
    setMediaSearchQuery("");
    setVisibleFieldMediaCount(24);
  }, [selectedCmsSectionKey, selectedCmsSlug]);

  const currentSectionDraft = (cmsDraft[cmsSelectedSection.key] ?? {}) as CmsDraftSection;

  const imageFieldsInCurrentSection = useMemo(
    () =>
      cmsSelectedSection.fields.filter(
        (field) => field.input === "text" && String(field.key).toLowerCase().includes("imageurl"),
      ),
    [cmsSelectedSection.fields],
  );

  const activePlacementForSection = useMemo(
    () => imagePlacementOptions.find((option) => option.key === selectedImagePlacementKey) ?? null,
    [imagePlacementOptions, selectedImagePlacementKey],
  );

  const activeInlineImageField = useMemo(() => {
    if (!expandedImageFieldKey) {
      return null;
    }

    return imageFieldsInCurrentSection.find((field) => String(field.key) === expandedImageFieldKey) ?? null;
  }, [expandedImageFieldKey, imageFieldsInCurrentSection]);

  const filteredMediaItems = useMemo(() => {
    const query = mediaSearchQuery.trim().toLowerCase();
    if (!query) {
      return mediaItems;
    }

    return mediaItems.filter((media) => {
      const filename = media.filename.toLowerCase();
      const url = media.url.toLowerCase();
      return filename.includes(query) || url.includes(query);
    });
  }, [mediaItems, mediaSearchQuery]);

  const visibleFieldMediaItems = useMemo(
    () => filteredMediaItems.slice(0, visibleFieldMediaCount),
    [filteredMediaItems, visibleFieldMediaCount],
  );
  const remainingFieldMediaCount = Math.max(0, filteredMediaItems.length - visibleFieldMediaItems.length);

  const activePlacementUrl = useMemo(() => {
    if (!activePlacementForSection) {
      return "";
    }

    const sectionValue = (cmsDraft[activePlacementForSection.sectionKey] ?? {}) as CmsDraftSection;
    const fieldValue = sectionValue[activePlacementForSection.fieldKey];
    return typeof fieldValue === "string" ? fieldValue : "";
  }, [activePlacementForSection, cmsDraft]);

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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_430px]">
        <aside className={`${surfacePanelClass} order-1 h-fit lg:sticky lg:top-24 lg:order-2`}>
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Vorschau im Bearbeitungsfluss</h3>
              <p className="mt-1 text-sm text-slate-500">Sichtbar während der Bearbeitung, ohne Wechsel in einen anderen Bereich.</p>
            </div>
            <button type="button" onClick={onOpenFullPreview} className={secondaryButtonClass}>
              <Eye size={16} /> Vollansicht
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onSelectViewport("desktop")}
              className={previewViewport === "desktop" ? secondaryButtonClass : "rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"}
            >
              <Monitor size={14} /> Desktop
            </button>
            <button
              type="button"
              onClick={() => onSelectViewport("tablet")}
              className={previewViewport === "tablet" ? secondaryButtonClass : "rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"}
            >
              <Tablet size={14} /> Tablet
            </button>
            <button
              type="button"
              onClick={() => onSelectViewport("mobile")}
              className={previewViewport === "mobile" ? secondaryButtonClass : "rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"}
            >
              <Smartphone size={14} /> Mobil
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {cmsSections.map((section) => (
              <button
                key={`preview-section-${section.key}`}
                type="button"
                onClick={() => onSelectSection(section.key)}
                className={
                  section.key === selectedCmsSectionKey
                    ? "rounded-lg border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                    : "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                }
              >
                {section.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <span>Aktive Sektion: {cmsSelectedSection.label}</span>
            <button type="button" onClick={onRefreshPreview} className="font-semibold text-slate-700 hover:text-slate-900">
              Neu laden
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <div className={`${previewWidthClass} max-w-full`}>
              <iframe
                key={`inline-preview-${selectedCmsSlug}-${previewViewport}-${previewRefreshKey}`}
                src={pagePath}
                title={`Inline Vorschau ${pageTitle}`}
                className="h-[52vh] min-h-[420px] w-full bg-white lg:h-[calc(100vh-260px)]"
              />
            </div>
          </div>
        </aside>

        <div className="order-2 space-y-4 lg:order-1">
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
                    const sectionValue = currentSectionDraft;
                    const fieldKey = String(field.key);
                    const inputType = field.input;
                    const rawValue = sectionValue[fieldKey];
                    const textValue = typeof rawValue === "string" ? rawValue : rawValue == null ? "" : String(rawValue);
                    const isImageField = inputType === "text" && fieldKey.toLowerCase().includes("imageurl");
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

                        {isImageField ? (
                          <div className="mt-2 space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                            {textValue ? (
                              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                                <img src={textValue} alt={field.label} className="h-28 w-full object-cover" loading="lazy" />
                              </div>
                            ) : (
                              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-xs text-slate-500">
                                Kein Bild zugewiesen.
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                className={secondaryButtonClass}
                                onClick={() => {
                                  onSelectImagePlacementKey(`${cmsSelectedSection.key}.${fieldKey}`);
                                  setMediaSearchQuery("");
                                  setVisibleFieldMediaCount(24);
                                  setExpandedImageFieldKey((current) =>
                                    current === fieldKey ? "" : fieldKey,
                                  );
                                }}
                              >
                                <ImagePlus size={16} /> Bild aus Bibliothek
                              </button>
                              <button
                                type="button"
                                className={secondaryButtonClass}
                                onClick={() => {
                                  onSelectImagePlacementKey(`${cmsSelectedSection.key}.${fieldKey}`);
                                  setExpandedImageFieldKey(fieldKey);
                                  void openMediaPicker();
                                }}
                              >
                                Direkt hochladen
                              </button>
                            </div>
                          </div>
                        ) : null}
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

          <div className={surfacePanelClass}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Feldnahe Medienzuweisung</h3>
                <p className="text-xs text-slate-500">
                  {activeInlineImageField
                    ? `${activeInlineImageField.label} aktiv`
                    : "Wähle bei einem Bildfeld \"Bild aus Bibliothek\"."}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!activeInlineImageField || uploadingMedia}
                  onClick={() => {
                    if (!activeInlineImageField) {
                      return;
                    }
                    onSelectImagePlacementKey(`${cmsSelectedSection.key}.${String(activeInlineImageField.key)}`);
                    void openMediaPicker();
                  }}
                  className={secondaryButtonClass}
                >
                  {uploadingMedia ? "Upload läuft..." : "Bild hochladen"}
                </button>
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <label className="flex items-center gap-2 text-xs text-slate-500">
                <Search size={14} />
                <input
                  value={mediaSearchQuery}
                  onChange={(event) => {
                    setMediaSearchQuery(event.target.value);
                    setVisibleFieldMediaCount(24);
                  }}
                  placeholder="Medien suchen (Dateiname oder URL)"
                  className="w-full border-0 bg-transparent p-0 text-sm text-slate-900 outline-none"
                />
              </label>
            </div>

            {!activeInlineImageField ? (
              <p className="mt-4 text-sm text-slate-500">Noch kein Bildfeld ausgewählt.</p>
            ) : loadingMedia ? (
              <p className="mt-4 text-sm text-slate-500">Medien werden geladen...</p>
            ) : filteredMediaItems.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">Keine Medien gefunden.</p>
            ) : (
              <>
                <div className="mt-4 grid max-h-[420px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                  {visibleFieldMediaItems.map((media) => (
                    <button
                      key={`field-media-${media.filename}`}
                      type="button"
                      onClick={() => {
                        const targetFieldKey = String(activeInlineImageField.key);
                        onUpdateCmsField(cmsSelectedSection.key, targetFieldKey, media.url);
                        onSelectImagePlacementKey(`${cmsSelectedSection.key}.${targetFieldKey}`);
                        onCopyMediaUrl(media.url);
                      }}
                      className="overflow-hidden rounded-lg border border-slate-200 bg-white text-left transition hover:border-slate-400"
                    >
                      <img src={media.url} alt={media.filename} className="h-24 w-full object-cover" loading="lazy" />
                      <div className="px-2 py-1.5">
                        <p className="truncate text-xs font-medium text-slate-700">{media.filename}</p>
                        <p className="text-[11px] text-slate-500">{formatFileSize(media.size)}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {remainingFieldMediaCount > 0 && (
                  <div className="mt-3 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisibleFieldMediaCount((current) => current + 24)}
                      className={secondaryButtonClass}
                    >
                      Weitere Medien laden ({remainingFieldMediaCount})
                    </button>
                  </div>
                )}
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleMediaInputChange}
              disabled={uploadingMedia}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
