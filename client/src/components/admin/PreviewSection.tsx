import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CmsPageSlug, CmsPageSummary, CmsSectionDefinition } from "@shared/cms";
import type { CmsDraft, CmsDraftValue, CmsPreviewViewport, CmsSectionKey } from "./types";
import {
  fieldControlClass,
  fieldLabelClass,
  helperTextClass,
  secondaryButtonClass,
  subtleSurfaceClass,
  surfacePanelClass,
} from "./styles";

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
  cmsSections: readonly CmsSectionDefinition[];
  cmsDraft: CmsDraft;
  onSelectSection: (key: CmsSectionKey) => void;
  onUpdateCmsField: (section: string, field: string, value: CmsDraftValue) => void;
}

type EditableSourceType = "text" | "image";

interface PreviewEditableField {
  sectionKey: string;
  sectionLabel: string;
  fieldKey: string;
  fieldLabel: string;
  input: "text" | "textarea";
  sourceType: EditableSourceType;
  value: string;
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function looksLikeImageField(fieldKey: string, fieldLabel: string, value: string) {
  const key = fieldKey.toLowerCase();
  const label = fieldLabel.toLowerCase();
  const normalized = value.toLowerCase();
  return (
    key.includes("image")
    || key.includes("bild")
    || label.includes("bild")
    || /\.(png|jpe?g|webp|gif|svg)(\?|$)/.test(normalized)
    || normalized.startsWith("data:image/")
  );
}

function normalizeUrl(value: string) {
  if (!value.trim()) {
    return "";
  }

  try {
    return new URL(value, window.location.origin).toString();
  } catch {
    return value.trim();
  }
}

function getPathname(value: string) {
  try {
    return new URL(value).pathname;
  } catch {
    return "";
  }
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
  cmsSections,
  cmsDraft,
  onSelectSection,
  onUpdateCmsField,
}: PreviewSectionProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [activeField, setActiveField] = useState<PreviewEditableField | null>(null);
  const [activeValue, setActiveValue] = useState("");
  const previewPagePath = useMemo(() => {
    const separator = pagePath.includes("?") ? "&" : "?";
    return `${pagePath}${separator}previewLogoResize=1`;
  }, [pagePath]);

  const previewEditableFields = useMemo<PreviewEditableField[]>(() => {
    return cmsSections.flatMap((section) => {
      const sectionDraft = (cmsDraft[section.key] ?? {}) as Record<string, unknown>;
      return section.fields
        .filter((field) => field.input === "text" || field.input === "textarea")
        .map((field) => {
          const rawValue = sectionDraft[field.key];
          const value = typeof rawValue === "string" ? rawValue : "";
          if (!value.trim()) {
            return null;
          }

          return {
            sectionKey: section.key,
            sectionLabel: section.label,
            fieldKey: field.key,
            fieldLabel: field.label,
            input: field.input === "textarea" ? "textarea" : "text",
            sourceType: looksLikeImageField(field.key, field.label, value) ? "image" : "text",
            value,
          } satisfies PreviewEditableField;
        })
        .filter((field): field is PreviewEditableField => field !== null);
    });
  }, [cmsDraft, cmsSections]);

  const openEditorForField = useCallback(
    (field: PreviewEditableField) => {
      onSelectSection(field.sectionKey as CmsSectionKey);
      setActiveField(field);
      setActiveValue(field.value);
    },
    [onSelectSection],
  );

  const findTextFieldByClickedText = useCallback(
    (clickedText: string) => {
      const normalizedClickedText = normalizeText(clickedText);
      if (normalizedClickedText.length < 3) {
        return null;
      }

      let bestMatch: PreviewEditableField | null = null;
      let bestScore = 0;

      for (const field of previewEditableFields) {
        if (field.sourceType !== "text") {
          continue;
        }

        const normalizedValue = normalizeText(field.value);
        if (normalizedValue.length < 3) {
          continue;
        }

        let score = 0;
        if (normalizedClickedText === normalizedValue) {
          score = 100;
        } else if (normalizedClickedText.includes(normalizedValue)) {
          score = 75 + Math.min(20, normalizedValue.length / 10);
        } else if (normalizedValue.includes(normalizedClickedText)) {
          score = 60 + Math.min(20, normalizedClickedText.length / 10);
        }

        if (score > bestScore) {
          bestScore = score;
          bestMatch = field;
        }
      }

      return bestScore >= 60 ? bestMatch : null;
    },
    [previewEditableFields],
  );

  const findImageFieldByClickedSrc = useCallback(
    (clickedSrc: string) => {
      const normalizedClickedSrc = normalizeUrl(clickedSrc);
      if (!normalizedClickedSrc) {
        return null;
      }

      const clickedPathname = getPathname(normalizedClickedSrc);
      const clickedFilename = clickedPathname.split("/").pop() ?? "";

      let bestMatch: PreviewEditableField | null = null;
      let bestScore = 0;

      for (const field of previewEditableFields) {
        if (field.sourceType !== "image") {
          continue;
        }

        const normalizedFieldSrc = normalizeUrl(field.value);
        if (!normalizedFieldSrc) {
          continue;
        }

        const fieldPathname = getPathname(normalizedFieldSrc);
        const fieldFilename = fieldPathname.split("/").pop() ?? "";

        let score = 0;
        if (normalizedFieldSrc === normalizedClickedSrc) {
          score = 120;
        } else if (fieldPathname && fieldPathname === clickedPathname) {
          score = 100;
        } else if (fieldFilename && fieldFilename === clickedFilename) {
          score = 85;
        } else if (clickedPathname && normalizedFieldSrc.includes(clickedPathname)) {
          score = 70;
        }

        if (score > bestScore) {
          bestScore = score;
          bestMatch = field;
        }
      }

      return bestScore >= 70 ? bestMatch : null;
    },
    [previewEditableFields],
  );

  const handlePreviewFrameLoaded = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    const iframeWithCleanup = iframe as HTMLIFrameElement & { __previewCleanup?: () => void };
    iframeWithCleanup.__previewCleanup?.();
    delete iframeWithCleanup.__previewCleanup;

    let doc: Document | null = null;
    try {
      doc = iframe.contentDocument;
    } catch {
      return;
    }

    if (!doc) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      const clickedLink = target.closest("a");
      if (clickedLink) {
        event.preventDefault();
      }

      const clickedImage = target.closest("img") as HTMLImageElement | null;
      if (clickedImage) {
        const imageField = findImageFieldByClickedSrc(clickedImage.currentSrc || clickedImage.src || "");
        if (imageField) {
          event.preventDefault();
          event.stopPropagation();
          openEditorForField(imageField);
        }
        return;
      }

      const textField = findTextFieldByClickedText(target.innerText || target.textContent || "");
      if (textField) {
        event.preventDefault();
        event.stopPropagation();
        openEditorForField(textField);
      }
    };

    doc.addEventListener("click", handleClick, true);

    const cleanup = () => doc?.removeEventListener("click", handleClick, true);
    iframeWithCleanup.__previewCleanup = cleanup;
  }, [findImageFieldByClickedSrc, findTextFieldByClickedText, openEditorForField]);

  const handleInlineValueChange = (nextValue: string) => {
    setActiveValue(nextValue);
    if (!activeField) {
      return;
    }
    onUpdateCmsField(activeField.sectionKey, activeField.fieldKey, nextValue);
  };

  useEffect(() => {
    return () => {
      const iframe = iframeRef.current as (HTMLIFrameElement & { __previewCleanup?: () => void }) | null;
      if (!iframe) {
        return;
      }
      iframe.__previewCleanup?.();
      delete iframe.__previewCleanup;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className={`${surfacePanelClass} flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between`}>
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

      <div className={surfacePanelClass}>
        <p className={helperTextClass}>
          Klick auf ein Bild oder einen Text in der Vorschau öffnet die Schnellbearbeitung für das zugeordnete CMS-Feld.
        </p>

        {activeField ? (
          <div className={`${subtleSurfaceClass} mt-4`}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">{activeField.fieldLabel}</p>
                <p className="text-xs text-slate-500">
                  Sektion: {activeField.sectionLabel} · Feld: {activeField.fieldKey}
                </p>
              </div>
              <button type="button" onClick={onEditContent} className={secondaryButtonClass}>
                Im Inhalte-Editor öffnen
              </button>
            </div>

            {activeField.input === "textarea" ? (
              <textarea
                value={activeValue}
                onChange={(event) => handleInlineValueChange(event.target.value)}
                rows={4}
                className={fieldControlClass}
              />
            ) : (
              <input
                value={activeValue}
                onChange={(event) => handleInlineValueChange(event.target.value)}
                className={fieldControlClass}
              />
            )}
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate-500">Noch kein Element ausgewählt.</p>
        )}
      </div>

      <div className={surfacePanelClass}>
        <div className={`overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-inner ${previewWidthClass}`}>
          <iframe
            ref={iframeRef}
            key={`${selectedCmsSlug}-${previewViewport}-${previewRefreshKey}`}
            src={previewPagePath}
            title={`Vorschau ${pageTitle}`}
            className="h-[780px] w-full bg-white"
            onLoad={handlePreviewFrameLoaded}
          />
        </div>
      </div>
    </div>
  );
}
