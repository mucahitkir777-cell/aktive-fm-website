import type { AdminRole } from "@shared/admin";
import { getDefaultCmsPageContent, type CmsNavigationItem, type CmsPage, type CmsPageSlug } from "@shared/cms";
import type { AdminLead, LeadStatus } from "@shared/lead";
import { neutralBadgeClass } from "./styles";
import type {
  AdminSection,
  CmsDraft,
  CmsDraftValue,
  DecodedAdminToken,
  LeadDraft,
  LeadDueState,
  LeadFilterValue,
} from "./types";

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDateOnly(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
  }).format(new Date(`${value}T00:00:00`));
}

export function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return window.atob(padded);
}

export function parseToken(token: string) {
  if (!token || typeof window === "undefined") {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as DecodedAdminToken;
    if (!payload?.id || !payload?.username || !payload?.role || typeof payload.exp !== "number") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function createLeadDraft(lead: AdminLead): LeadDraft {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: lead.message ?? "",
    internalNote: lead.internalNote ?? "",
    followUpDate: lead.followUpDate ?? "",
    status: lead.status,
  };
}

export function createCmsDraft(page?: CmsPage | null, slug: CmsPageSlug = "home") {
  if (!page) {
    return getDefaultCmsPageContent(slug) as CmsDraft;
  }

  return page.content as CmsDraft;
}

export function toNavigationItems(value: CmsDraftValue | undefined): CmsNavigationItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is CmsNavigationItem => typeof item === "object" && item !== null)
    .map((item, index) => ({
      id: typeof item.id === "string" && item.id.trim() ? item.id.trim() : `item-${index + 1}`,
      label: typeof item.label === "string" ? item.label : "",
      href: typeof item.href === "string" ? item.href : "/",
      visible: typeof item.visible === "boolean" ? item.visible : true,
      sortOrder: typeof item.sortOrder === "number" ? item.sortOrder : index + 1,
      type: item.type === "custom" ? "custom" : "page",
      target: item.target === "_blank" ? "_blank" : "_self",
    }));
}

export function createNavigationItemId() {
  if (typeof globalThis !== "undefined" && globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  throw new Error("Navigation-ID konnte nicht erzeugt werden: crypto.randomUUID ist nicht verfügbar.");
}

export function getLeadFilterBucket(lead: AdminLead): LeadFilterValue {
  const currentStatus = (lead as AdminLead & { status?: string | null }).status;

  if (!currentStatus) {
    return "without-status";
  }

  if (currentStatus === "new") {
    return "new";
  }

  if (currentStatus === "contacted" || currentStatus === "qualified") {
    return "in-progress";
  }

  if (currentStatus === "done" || currentStatus === "archived") {
    return "completed";
  }

  return "without-status";
}

export function getLeadDueState(lead: AdminLead): LeadDueState {
  if (!lead.followUpDate) {
    return "none";
  }

  const today = getTodayDateString();
  if (lead.followUpDate === today) {
    return "today";
  }

  if (lead.followUpDate < today) {
    return "overdue";
  }

  return "upcoming";
}

export function matchesLeadFilter(lead: AdminLead, filterValue: LeadFilterValue) {
  if (filterValue === "all") {
    return true;
  }

  if (
    filterValue === "new"
    || filterValue === "in-progress"
    || filterValue === "completed"
    || filterValue === "without-status"
  ) {
    return getLeadFilterBucket(lead) === filterValue;
  }

  if (filterValue === "due-today") {
    return getLeadDueState(lead) === "today";
  }

  if (filterValue === "overdue") {
    return getLeadDueState(lead) === "overdue";
  }

  if (filterValue === "with-follow-up") {
    return Boolean(lead.followUpDate);
  }

  return !lead.followUpDate;
}

export function matchesLeadSearch(lead: AdminLead, searchTerm: string) {
  if (!searchTerm) {
    return true;
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) {
    return true;
  }

  return [lead.name, lead.email, lead.phone].some((value) =>
    value.toLowerCase().includes(normalizedSearch),
  );
}

export function hasCmsAccess(role: AdminRole | null | undefined) {
  return role === "admin" || role === "editor" || role === "staff";
}

export function hasSectionAccess(role: AdminRole | null | undefined, section: AdminSection) {
  if (!role) {
    return false;
  }

  if (section === "dashboard" || section === "leads") {
    return role === "admin";
  }

  if (section === "pages" || section === "content" || section === "preview") {
    return hasCmsAccess(role);
  }

  if (section === "settings") {
    return true;
  }

  return false;
}

export function getDefaultSectionForRole(role: AdminRole | null | undefined) {
  if (role === "admin") {
    return "/admin/dashboard";
  }

  if (hasCmsAccess(role)) {
    return "/admin/content";
  }

  return "/admin/settings";
}

export function formatRoleLabel(role: AdminRole) {
  if (role === "admin") return "admin";
  if (role === "editor") return "editor";
  return "staff (legacy)";
}

export function getLeadStatusLabel(status: LeadStatus | string | null | undefined) {
  if (!status) return "Ohne Status";
  if (status === "new") return "Neu";
  if (status === "contacted") return "Kontaktiert";
  if (status === "qualified") return "Qualifiziert";
  if (status === "done") return "Abgeschlossen";
  if (status === "archived") return "Archiviert";
  return status;
}

export function getLeadStatusBadgeClass(status: LeadStatus | string | null | undefined) {
  if (!status) return neutralBadgeClass;
  if (status === "new") return "inline-flex rounded-lg border border-[#1D6FA4]/30 bg-[#1D6FA4]/10 px-2.5 py-1 text-xs font-semibold text-[#1D6FA4]";
  if (status === "contacted" || status === "qualified") {
    return "inline-flex rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700";
  }
  if (status === "done") return "inline-flex rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700";
  return neutralBadgeClass;
}

export function getLeadDueStateLabel(state: LeadDueState) {
  if (state === "overdue") return "Überfällig";
  if (state === "today") return "Heute fällig";
  if (state === "upcoming") return "Geplant";
  return "-";
}

export function getLeadDueStateBadgeClass(state: LeadDueState) {
  if (state === "overdue") {
    return "inline-flex rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700";
  }
  if (state === "today") {
    return "inline-flex rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700";
  }
  if (state === "upcoming") {
    return neutralBadgeClass;
  }
  return "text-sm text-slate-500";
}
