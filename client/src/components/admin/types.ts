import type { LucideIcon } from "lucide-react";
import type { AdminSessionUser } from "@shared/admin";
import type { CmsNavigationItem, CmsPageSlug } from "@shared/cms";
import type { LeadStatus } from "@shared/lead";

export interface SessionState {
  token: string;
  user: AdminSessionUser;
  expiresAt: string;
}

export interface DecodedAdminToken extends AdminSessionUser {
  iat: number;
  exp: number;
}

export interface AdminMediaItem {
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export type ActivePanel = "lead-edit" | "change-password" | "users" | null;
export type AdminSection = "dashboard" | "leads" | "settings" | "pages" | "content" | "preview";
export type CmsSectionKey = string;
export type CmsPreviewViewport = "desktop" | "tablet" | "mobile";
export type LeadFilterValue =
  | "all"
  | "new"
  | "in-progress"
  | "completed"
  | "without-status"
  | "due-today"
  | "overdue"
  | "with-follow-up"
  | "without-follow-up";
export type LeadSortValue = "newest" | "oldest" | "follow-up-asc" | "follow-up-desc";
export type LeadDueState = "none" | "today" | "overdue" | "upcoming";
export type SiteStatus = "live" | "maintenance";

export type SidebarNavigationItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  access: boolean;
  activate?: () => void;
};

export type SidebarNavigationGroup = {
  title: string;
  items: SidebarNavigationItem[];
};

export interface LeadDraft {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  internalNote: string;
  followUpDate: string;
  status: LeadStatus;
}

export type CmsDraftValue = string | number | boolean | CmsNavigationItem[];
export type CmsDraftSection = Record<string, CmsDraftValue>;
export type CmsDraft = Record<string, CmsDraftSection>;

export interface AdminSectionMeta {
  title: string;
  description: string;
}

export interface CmsPageSelection {
  slug: CmsPageSlug;
  title: string;
  path: string;
  updatedAt: string;
}
