import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  BarChart3,
  Eye,
  FileText,
  KeyRound,
  LayoutDashboard,
  LogOut,
  PencilLine,
  PanelTop,
  RefreshCw,
  Settings,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLocation } from "wouter";
import type { AdminDashboardStats, AdminRole, AdminSessionUser, AdminUser } from "@shared/admin";
import {
  cmsPageDefinitions,
  getDefaultCmsPageContent,
  type CmsGlobalContent,
  type CmsNavigationItem,
  type CmsPage,
  type CmsPageStatus,
  type CmsPageSlug,
  type CmsPageSummary,
} from "@shared/cms";
import type { AdminLead, LeadStatus } from "@shared/lead";

const ADMIN_TOKEN_KEY = "proclean_admin_token";
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
const leadStatuses: LeadStatus[] = ["new", "contacted", "qualified", "done", "archived"];
const userCreationRoles: AdminRole[] = ["admin", "editor"];

interface LeadListResponse {
  success: boolean;
  leads?: AdminLead[];
  message?: string;
  code?: string;
}

interface LeadResponse {
  success: boolean;
  lead?: AdminLead;
  message?: string;
  code?: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  expiresAt?: string;
  user?: AdminSessionUser;
  message?: string;
  code?: string;
}

interface ChangePasswordResponse extends LoginResponse {}

interface UserListResponse {
  success: boolean;
  users?: AdminUser[];
  message?: string;
  code?: string;
}

interface CreateUserResponse {
  success: boolean;
  user?: AdminUser;
  message?: string;
  code?: string;
}

interface StatsResponse {
  success: boolean;
  stats?: AdminDashboardStats;
  message?: string;
  code?: string;
}

interface CmsPageListResponse {
  success: boolean;
  pages?: CmsPageSummary[];
  message?: string;
  code?: string;
}

interface CmsPageResponse {
  success: boolean;
  page?: CmsPage;
  message?: string;
  code?: string;
}

interface AdminMediaItem {
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
}

interface AdminMediaListResponse {
  success: boolean;
  media?: AdminMediaItem[];
  message?: string;
  code?: string;
}

interface AdminMediaUploadResponse {
  success: boolean;
  media?: AdminMediaItem;
  message?: string;
  code?: string;
}

interface SessionState {
  token: string;
  user: AdminSessionUser;
  expiresAt: string;
}

interface DecodedAdminToken extends AdminSessionUser {
  iat: number;
  exp: number;
}

type ActivePanel = "lead-edit" | "change-password" | "users" | null;
type AdminSection = "dashboard" | "leads" | "settings" | "pages" | "content" | "preview";
type CmsSectionKey = string;
type CmsPreviewViewport = "desktop" | "tablet" | "mobile";
type LeadFilterValue =
  | "all"
  | "new"
  | "in-progress"
  | "completed"
  | "without-status"
  | "due-today"
  | "overdue"
  | "with-follow-up"
  | "without-follow-up";
type LeadSortValue = "newest" | "oldest" | "follow-up-asc" | "follow-up-desc";
type LeadDueState = "none" | "today" | "overdue" | "upcoming";

type SiteStatus = "live" | "maintenance";

type SidebarNavigationItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  access: boolean;
  activate?: () => void;
};

type SidebarNavigationGroup = {
  title: string;
  items: SidebarNavigationItem[];
};

interface LeadDraft {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  internalNote: string;
  followUpDate: string;
  status: LeadStatus;
}

type CmsDraftValue = string | number | boolean | CmsNavigationItem[];
type CmsDraftSection = Record<string, CmsDraftValue>;
type CmsDraft = Record<string, CmsDraftSection>;

const buttonBaseClass = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors";
const secondaryButtonClass = `${buttonBaseClass} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60`;
const primaryButtonClass = `${buttonBaseClass} border border-[#1D6FA4] bg-[#1D6FA4] text-white hover:bg-[#155d8e] disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300`;
const dangerButtonClass = `${buttonBaseClass} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60`;
const shellClass = "min-h-screen bg-[#F2F4F7] px-4 py-6 md:px-6 md:py-8";
const shellContainerClass = "mx-auto max-w-[1460px]";
const surfaceClass = "rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_-24px_rgba(15,33,55,0.65)]";
const surfaceMutedClass = "rounded-2xl border border-slate-200 bg-slate-50/70";
const fieldLabelClass = "block text-sm font-medium text-slate-800";
const fieldControlClass = "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-[#1D6FA4] focus:outline-none focus:ring-4 focus:ring-[#1D6FA4]/15";
const helperTextClass = "text-sm text-slate-500";
const tableHeadClass = "bg-slate-50 text-xs uppercase text-slate-500";
const tableHeaderCellClass = "px-4 py-3 font-semibold tracking-wide";
const tableCellClass = "px-4 py-3 text-sm text-slate-700";
const successAlertClass = "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700";
const errorAlertClass = "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700";
const emptyStateClass = "rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500";
const neutralBadgeClass = "inline-flex rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700";
const infoPanelClass = "rounded-xl border border-slate-200 bg-slate-50 p-4";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatDateOnly(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
  }).format(new Date(`${value}T00:00:00`));
}

function formatFileSize(bytes: number) {
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

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Datei konnte nicht gelesen werden."));
    reader.readAsDataURL(file);
  });
}

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return window.atob(padded);
}

function parseToken(token: string) {
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

function getStoredSession(): SessionState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const token = window.localStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
  const decoded = parseToken(token);
  if (!decoded) {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    return null;
  }

  const expiresAt = new Date(decoded.exp * 1000).toISOString();
  if (new Date(expiresAt).getTime() <= Date.now()) {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    return null;
  }

  return {
    token,
    user: {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    },
    expiresAt,
  };
}

function storeToken(token: string) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

function clearStoredToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

function createLeadDraft(lead: AdminLead): LeadDraft {
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

function createCmsDraft(page?: CmsPage | null, slug: CmsPageSlug = "home") {
  if (!page) {
    return getDefaultCmsPageContent(slug) as CmsDraft;
  }

  return page.content as CmsDraft;
}

function toNavigationItems(value: CmsDraftValue | undefined): CmsNavigationItem[] {
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

function createNavigationItemId() {
  if (typeof globalThis !== "undefined" && globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  throw new Error("Navigation-ID konnte nicht erzeugt werden: crypto.randomUUID ist nicht verfügbar.");
}

function getLeadFilterBucket(lead: AdminLead): LeadFilterValue {
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

function getLeadDueState(lead: AdminLead): LeadDueState {
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

function matchesLeadFilter(lead: AdminLead, filterValue: LeadFilterValue) {
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

function matchesLeadSearch(lead: AdminLead, searchTerm: string) {
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

function hasCmsAccess(role: AdminRole | null | undefined) {
  return role === "admin" || role === "editor" || role === "staff";
}

function hasSectionAccess(role: AdminRole | null | undefined, section: AdminSection) {
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

function getDefaultSectionForRole(role: AdminRole | null | undefined) {
  if (role === "admin") {
    return "/admin/dashboard";
  }

  if (hasCmsAccess(role)) {
    return "/admin/content";
  }

  return "/admin/settings";
}

function formatRoleLabel(role: AdminRole) {
  if (role === "admin") return "admin";
  if (role === "editor") return "editor";
  return "staff (legacy)";
}

function getLeadStatusLabel(status: LeadStatus | string | null | undefined) {
  if (!status) return "Ohne Status";
  if (status === "new") return "Neu";
  if (status === "contacted") return "Kontaktiert";
  if (status === "qualified") return "Qualifiziert";
  if (status === "done") return "Abgeschlossen";
  if (status === "archived") return "Archiviert";
  return status;
}

function getLeadStatusBadgeClass(status: LeadStatus | string | null | undefined) {
  if (!status) return neutralBadgeClass;
  if (status === "new") return "inline-flex rounded-lg border border-[#1D6FA4]/30 bg-[#1D6FA4]/10 px-2.5 py-1 text-xs font-semibold text-[#1D6FA4]";
  if (status === "contacted" || status === "qualified") {
    return "inline-flex rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700";
  }
  if (status === "done") return "inline-flex rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700";
  return neutralBadgeClass;
}

function getLeadDueStateLabel(state: LeadDueState) {
  if (state === "overdue") return "Überfällig";
  if (state === "today") return "Heute fällig";
  if (state === "upcoming") return "Geplant";
  return "-";
}

function getLeadDueStateBadgeClass(state: LeadDueState) {
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

export default function Admin() {
  const [location, setLocation] = useLocation();
  const [session, setSession] = useState<SessionState | null>(getStoredSession);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [cmsPages, setCmsPages] = useState<CmsPageSummary[]>([]);
  const [selectedCmsSlug, setSelectedCmsSlug] = useState<CmsPageSlug>("home");
  const [selectedCmsSection, setSelectedCmsSection] = useState<CmsSectionKey>("hero");
  const [cmsPage, setCmsPage] = useState<CmsPage | null>(null);
  const [cmsPageStatus, setCmsPageStatus] = useState<CmsPageStatus>("published");
  const [cmsDraft, setCmsDraft] = useState<CmsDraft>(() => getDefaultCmsPageContent("home") as CmsDraft);
  const [globalCmsContent, setGlobalCmsContent] = useState<CmsGlobalContent | null>(null);
  const [siteStatus, setSiteStatus] = useState<SiteStatus>("live");
  const [siteStatusLoading, setSiteStatusLoading] = useState(false);
  const [siteStatusSaving, setSiteStatusSaving] = useState(false);
  const [loadingCms, setLoadingCms] = useState(false);
  const [savingCms, setSavingCms] = useState(false);
  const [mediaItems, setMediaItems] = useState<AdminMediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [previewViewport, setPreviewViewport] = useState<CmsPreviewViewport>("desktop");
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [submittingLogin, setSubmittingLogin] = useState(false);
  const [submittingPanel, setSubmittingPanel] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [leadFilter, setLeadFilter] = useState<LeadFilterValue>("all");
  const [leadSearch, setLeadSearch] = useState("");
  const [leadSort, setLeadSort] = useState<LeadSortValue>("newest");
  const [selectedLead, setSelectedLead] = useState<LeadDraft | null>(null);
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [userCreateForm, setUserCreateForm] = useState({
    username: "",
    password: "",
    role: "editor" as AdminRole,
  });

  const settingsRef = useRef<HTMLDivElement | null>(null);
  const leadCount = leads.length;
  const userRole = session?.user.role ?? null;
  const isAdmin = userRole === "admin";
  const canAccessLeads = userRole === "admin";
  const canAccessDashboard = userRole === "admin";
  const canAccessCmsSection = hasCmsAccess(userRole);
  const currentSection: AdminSection = useMemo(() => {
    const rawSection = location.replace(/^\/admin\/?/, "").split("/")[0];

    if (rawSection === "pages") return "pages";
    if (rawSection === "content") return "content";
    if (rawSection === "preview") return "preview";
    if (rawSection === "leads") return "leads";
    if (rawSection === "settings") return "settings";
    if (rawSection === "dashboard") return "dashboard";
    return "dashboard";
  }, [location]);

  const filteredLeads = useMemo(() => {
    const nextLeads = leads.filter((lead) => {
      const matchesFilter = matchesLeadFilter(lead, leadFilter);
      return matchesFilter && matchesLeadSearch(lead, leadSearch);
    });

    nextLeads.sort((leftLead, rightLead) => {
      if (leadSort === "follow-up-asc" || leadSort === "follow-up-desc") {
        const leftFollowUp = leftLead.followUpDate ?? "";
        const rightFollowUp = rightLead.followUpDate ?? "";

        if (!leftFollowUp && !rightFollowUp) {
          return 0;
        }

        if (!leftFollowUp) {
          return 1;
        }

        if (!rightFollowUp) {
          return -1;
        }

        return leadSort === "follow-up-asc"
          ? leftFollowUp.localeCompare(rightFollowUp)
          : rightFollowUp.localeCompare(leftFollowUp);
      }

      const leftTime = new Date(leftLead.createdAt).getTime();
      const rightTime = new Date(rightLead.createdAt).getTime();

      return leadSort === "oldest" ? leftTime - rightTime : rightTime - leftTime;
    });

    return nextLeads;
  }, [leadFilter, leadSearch, leadSort, leads]);

  const cmsDefinition = cmsPageDefinitions[selectedCmsSlug] ?? cmsPageDefinitions.home;
  const cmsPageOptions = cmsPages.length > 0
    ? cmsPages
    : (Object.entries(cmsPageDefinitions).map(([slug, definition]) => ({
        slug: slug as CmsPageSlug,
        title: definition.title,
        path: definition.path,
        updatedAt: "",
      })) as CmsPageSummary[]);
  const cmsSections = cmsDefinition.sections;
  const cmsSelectedSection = cmsSections.find((section) => section.key === selectedCmsSection) ?? cmsSections[0];
  const isGlobalNavigationSection = selectedCmsSlug === "global" && cmsSelectedSection.key === "navigation";
  const navigationDraftItems = useMemo(() => {
    if (!isGlobalNavigationSection) {
      return [];
    }
    const sectionValue = (cmsDraft.navigation ?? {}) as CmsDraftSection;
    return toNavigationItems(sectionValue.items);
  }, [cmsDraft.navigation, isGlobalNavigationSection]);
  const activeImageField = useMemo(
    () => cmsSelectedSection.fields.find((field) => field.input === "text" && field.key.toLowerCase().includes("imageurl")) ?? null,
    [cmsSelectedSection],
  );
  const previewWidthClass = useMemo(() => {
    if (previewViewport === "mobile") return "mx-auto w-[390px] max-w-full";
    if (previewViewport === "tablet") return "mx-auto w-[768px] max-w-full";
    return "w-full";
  }, [previewViewport]);

  function applySession(token: string) {
    const decoded = parseToken(token);
    if (!decoded) {
      return null;
    }

    const nextSession = {
      token,
      user: {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      },
      expiresAt: new Date(decoded.exp * 1000).toISOString(),
    } satisfies SessionState;

    storeToken(token);
    setSession(nextSession);

    return nextSession;
  }

  function handleLogout(message = "") {
    clearStoredToken();
    setSession(null);
    setLeads([]);
    setUsers([]);
    setStats(null);
    setCmsPages([]);
    setCmsPage(null);
    setCmsDraft(getDefaultCmsPageContent("home"));
    setMediaItems([]);
    setSelectedCmsSlug("home");
    setSelectedCmsSection("hero");
    setPreviewRefreshKey(0);
    setSelectedLead(null);
    setActivePanel(null);
    setSettingsOpen(false);
    setPassword("");
    setChangePasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setUserCreateForm({ username: "", password: "", role: "editor" });
    setSuccessMessage("");
    if (message) {
      setError(message);
    }
  }

  async function requestJson<T>(input: string, init?: RequestInit) {
    const response = await fetch(input, init);
    const result = (await response.json().catch(() => null)) as (T & {
      success?: boolean;
      message?: string;
      code?: string;
    }) | null;

    if (response.status === 401) {
      const sessionMessage =
        result?.code === "token_expired"
          ? "Sitzung abgelaufen. Bitte erneut anmelden."
          : result?.message ?? "Bitte erneut anmelden.";
      handleLogout(sessionMessage);
      return { response, result: null };
    }

    return { response, result };
  }

  async function loadLeads(activeSession = session) {
    if (!activeSession || activeSession.user.role !== "admin") {
      return;
    }

    setLoadingLeads(true);
    setError("");

    const { response, result } = await requestJson<LeadListResponse>("/api/leads", {
      headers: {
        Authorization: `Bearer ${activeSession.token}`,
      },
    });

    setLoadingLeads(false);

    if (!result) {
      return;
    }

    if (!response.ok || !result.success) {
      setError(result.message ?? "Leads konnten nicht geladen werden.");
      return;
    }

    setLeads(result.leads ?? []);
  }

  async function loadUsers(activeSession = session) {
    if (!activeSession || activeSession.user.role !== "admin") {
      return;
    }

    const { response, result } = await requestJson<UserListResponse>("/api/admin/users", {
      headers: {
        Authorization: `Bearer ${activeSession.token}`,
      },
    });

    if (!result) {
      return;
    }

    if (!response.ok || !result.success) {
      setError(result.message ?? "Benutzer konnten nicht geladen werden.");
      return;
    }

    setUsers(result.users ?? []);
  }

  async function loadStats(activeSession = session) {
    if (!activeSession || activeSession.user.role !== "admin") {
      return;
    }

    setLoadingStats(true);

    const { response, result } = await requestJson<StatsResponse>("/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${activeSession.token}`,
      },
    });

    setLoadingStats(false);

    if (!result) {
      return;
    }

    if (!response.ok || !result.success || !result.stats) {
      setError(result.message ?? "Statistiken konnten nicht geladen werden.");
      return;
    }

    setStats(result.stats);
  }

  async function loadCmsPages(activeSession = session) {
    if (!activeSession || !hasCmsAccess(activeSession.user.role)) {
      return;
    }

    const { response, result } = await requestJson<CmsPageListResponse>("/api/admin/cms/pages", {
      headers: {
        Authorization: `Bearer ${activeSession.token}`,
      },
    });

    if (!result) {
      return;
    }

    if (!response.ok || !result.success) {
      setError(result.message ?? "CMS-Seiten konnten nicht geladen werden.");
      return;
    }

    setCmsPages(result.pages ?? []);
  }

  async function loadCmsPage(slug = selectedCmsSlug, activeSession = session) {
    if (!activeSession || !hasCmsAccess(activeSession.user.role)) {
      return;
    }

    setLoadingCms(true);

    const { response, result } = await requestJson<CmsPageResponse>(`/api/admin/cms/pages/${encodeURIComponent(slug)}`, {
      headers: {
        Authorization: `Bearer ${activeSession.token}`,
      },
    });

    setLoadingCms(false);

    if (!result) {
      return;
    }

    if (!response.ok || !result.success || !result.page) {
      setError(result.message ?? "CMS-Seite konnte nicht geladen werden.");
      return;
    }

    setCmsPage(result.page);
    setCmsPageStatus(result.page.status);
    setCmsDraft(createCmsDraft(result.page));

    if (slug === "global") {
      const globalContent = result.page.content as CmsGlobalContent;
      setGlobalCmsContent(globalContent);
      setSiteStatus(globalContent.siteStatus ?? "live");
    }
  }

  async function loadGlobalSiteStatus(activeSession = session): Promise<CmsGlobalContent | null> {
    if (!activeSession || !hasCmsAccess(activeSession.user.role)) {
      return null;
    }

    setSiteStatusLoading(true);
    setError("");

    const { response, result } = await requestJson<CmsPageResponse>(`/api/admin/cms/pages/global`, {
      headers: {
        Authorization: `Bearer ${activeSession.token}`,
      },
    });

    setSiteStatusLoading(false);

    if (!result) {
      return null;
    }

    if (!response.ok || !result.success || !result.page) {
      setError(result.message ?? "CMS-Seite konnte nicht geladen werden.");
      return null;
    }

    const globalContent = result.page.content as CmsGlobalContent;
    setGlobalCmsContent(globalContent);
    setSiteStatus(globalContent.siteStatus ?? "live");
    return globalContent;
  }

  async function loadMedia(activeSession = session) {
    if (!activeSession || !hasCmsAccess(activeSession.user.role)) {
      return;
    }

    setLoadingMedia(true);

    const { response, result } = await requestJson<AdminMediaListResponse>("/api/admin/media", {
      headers: {
        Authorization: `Bearer ${activeSession.token}`,
      },
    });

    setLoadingMedia(false);

    if (!result) {
      return;
    }

    if (!response.ok || !result.success) {
      setError(result.message ?? "Medien konnten nicht geladen werden.");
      return;
    }

    setMediaItems(result.media ?? []);
  }

  async function handleMediaUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !session) {
      return;
    }

    event.target.value = "";

    if (!file.type.startsWith("image/")) {
      setError("Nur Bilddateien sind erlaubt.");
      return;
    }

    setUploadingMedia(true);
    setError("");
    setSuccessMessage("");

    try {
      const dataUrl = await fileToDataUrl(file);

      const { response, result } = await requestJson<AdminMediaUploadResponse>("/api/admin/media/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          dataUrl,
        }),
      });

      if (!result) {
        return;
      }

      if (!response.ok || !result.success || !result.media) {
        setError(result.message ?? "Bild konnte nicht hochgeladen werden.");
        return;
      }

      setMediaItems((current) => [result.media!, ...current.filter((item) => item.filename !== result.media!.filename)]);
      setSuccessMessage(result.message ?? "Bild wurde hochgeladen.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bild konnte nicht hochgeladen werden.");
    } finally {
      setUploadingMedia(false);
    }
  }

  async function copyMediaUrl(url: string) {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setError("Kopieren wird von diesem Browser nicht unterstützt.");
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setSuccessMessage("Bild-URL wurde kopiert.");
    } catch {
      setError("Bild-URL konnte nicht kopiert werden.");
    }
  }

  function updateCmsField(section: string, field: string, value: CmsDraftValue) {
    setCmsDraft((current) => ({
      ...current,
      [section]: {
        ...(current[section] ?? {}),
        [field]: value,
      },
    }));
  }

  function updateNavigationItem(index: number, nextValue: Partial<CmsNavigationItem>) {
    setCmsDraft((current) => {
      const navigationSection = (current.navigation ?? {}) as CmsDraftSection;
      const items = toNavigationItems(navigationSection.items);
      const nextItems = items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...nextValue } : item))
        .map((item, itemIndex) => ({ ...item, sortOrder: itemIndex + 1 }));

      return {
        ...current,
        navigation: {
          ...navigationSection,
          items: nextItems,
        },
      };
    });
  }

  function removeNavigationItem(id: string) {
    setCmsDraft((current) => {
      const navigationSection = (current.navigation ?? {}) as CmsDraftSection;
      const items = toNavigationItems(navigationSection.items)
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, sortOrder: index + 1 }));

      return {
        ...current,
        navigation: {
          ...navigationSection,
          items,
        },
      };
    });
  }

  function addNavigationItem() {
    setCmsDraft((current) => {
      const navigationSection = (current.navigation ?? {}) as CmsDraftSection;
      const items = toNavigationItems(navigationSection.items);
      const nextItemId = createNavigationItemId();
      const nextItem: CmsNavigationItem = {
        id: nextItemId,
        label: "Neuer Link",
        href: "/",
        visible: true,
        sortOrder: items.length + 1,
        type: "custom",
        target: "_self",
      };

      return {
        ...current,
        navigation: {
          ...navigationSection,
          items: [...items, nextItem],
        },
      };
    });
  }

  useEffect(() => {
    if (!session) {
      return;
    }

    if (session.user.role === "admin") {
      void loadLeads(session);
      void loadStats(session);
    }
  }, [session]);

  useEffect(() => {
    if (!session || !hasSectionAccess(session.user.role, currentSection)) {
      return;
    }

    if (currentSection !== "pages" && currentSection !== "content" && currentSection !== "preview") {
      return;
    }

    setCmsDraft(getDefaultCmsPageContent(selectedCmsSlug) as CmsDraft);
    setCmsPageStatus("published");
    void loadCmsPages(session);
    void loadCmsPage(selectedCmsSlug, session);
  }, [currentSection, selectedCmsSlug, session]);

  useEffect(() => {
    if (!session || currentSection !== "content" || !hasSectionAccess(session.user.role, currentSection)) {
      return;
    }

    void loadMedia(session);
  }, [currentSection, session]);

  useEffect(() => {
    const firstSection = cmsPageDefinitions[selectedCmsSlug].sections[0];
    if (selectedCmsSection !== firstSection.key && !cmsPageDefinitions[selectedCmsSlug].sections.some((section) => section.key === selectedCmsSection)) {
      setSelectedCmsSection(firstSection.key);
    }
  }, [selectedCmsSection, selectedCmsSlug]);

  useEffect(() => {
    if (!session || activePanel !== "users" || session.user.role !== "admin") {
      return;
    }

    void loadUsers(session);
  }, [activePanel, session]);

  useEffect(() => {
    if (!session || currentSection !== "settings" || !canAccessCmsSection || globalCmsContent) {
      return;
    }

    void loadGlobalSiteStatus(session);
  }, [currentSection, session, canAccessCmsSection, globalCmsContent]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const expiryTimeoutMs = new Date(session.expiresAt).getTime() - Date.now();
    if (expiryTimeoutMs <= 0) {
      handleLogout("Sitzung abgelaufen. Bitte erneut anmelden.");
      return;
    }

    const timeout = window.setTimeout(() => {
      handleLogout("Sitzung abgelaufen. Bitte erneut anmelden.");
    }, expiryTimeoutMs);

    return () => window.clearTimeout(timeout);
  }, [session]);

  useEffect(() => {
    if (!session) {
      return;
    }

    let timeoutId = 0;

    const resetTimeout = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        handleLogout("Sitzung wegen Inaktivität beendet.");
      }, INACTIVITY_TIMEOUT_MS);
    };

    const events: Array<keyof WindowEventMap> = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];

    resetTimeout();
    events.forEach((eventName) => window.addEventListener(eventName, resetTimeout, { passive: true }));

    return () => {
      window.clearTimeout(timeoutId);
      events.forEach((eventName) => window.removeEventListener(eventName, resetTimeout));
    };
  }, [session]);

  useEffect(() => {
    if (!settingsOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [settingsOpen]);

  useEffect(() => {
    if (session && location === "/admin") {
      setLocation(getDefaultSectionForRole(session.user.role));
    }
  }, [location, session, setLocation]);

  useEffect(() => {
    if (!session || location === "/admin") {
      return;
    }

    if (!hasSectionAccess(session.user.role, currentSection)) {
      setError("Keine Berechtigung für diesen Bereich.");
      setLocation(getDefaultSectionForRole(session.user.role));
    }
  }, [currentSection, location, session, setLocation]);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setSubmittingLogin(true);
    setError("");
    setSuccessMessage("");

    const { response, result } = await requestJson<LoginResponse>("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    setSubmittingLogin(false);

    if (!result) {
      return;
    }

    if (!response.ok || !result.success || !result.token) {
      setError(result.message ?? "Login fehlgeschlagen.");
      return;
    }

    const nextSession = applySession(result.token);
    setPassword("");
    setSuccessMessage("");

    setLocation(getDefaultSectionForRole(nextSession?.user.role));
  }

  async function handleStatusChange(id: string, status: LeadStatus) {
    if (!session) {
      return;
    }

    setError("");

    const { response, result } = await requestJson<LeadResponse>(`/api/leads/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!result) {
      return;
    }

    if (!response.ok || !result.success || !result.lead) {
      setError(result.message ?? "Status konnte nicht geändert werden.");
      return;
    }

    setLeads((current) => current.map((lead) => (lead.id === id ? result.lead! : lead)));
    void loadStats(session);
  }

  function openLeadEditor(lead: AdminLead) {
    setSelectedLead(createLeadDraft(lead));
    setActivePanel("lead-edit");
    setSuccessMessage("");
    setError("");
  }

  async function openLeadEditorById(id: string) {
    const existingLead = leads.find((lead) => lead.id === id);
    if (existingLead) {
      openLeadEditor(existingLead);
      return;
    }

    if (!session) {
      return;
    }

    const { response, result } = await requestJson<LeadResponse>(`/api/leads/${encodeURIComponent(id)}`, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    if (!result) {
      return;
    }

    if (!response.ok || !result.success || !result.lead) {
      setError(result.message ?? "Lead konnte nicht geladen werden.");
      return;
    }

    openLeadEditor(result.lead);
  }

  async function handleLeadSave(event: FormEvent) {
    event.preventDefault();
    if (!session || !selectedLead) {
      return;
    }

    setSubmittingPanel(true);
    setError("");
    setSuccessMessage("");

    const { response, result } = await requestJson<LeadResponse>(`/api/leads/${encodeURIComponent(selectedLead.id)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: selectedLead.name,
        email: selectedLead.email,
        phone: selectedLead.phone,
        message: selectedLead.message.trim() ? selectedLead.message : null,
        internalNote: selectedLead.internalNote.trim() ? selectedLead.internalNote : null,
        followUpDate: selectedLead.followUpDate || null,
        status: selectedLead.status,
      }),
    });

    setSubmittingPanel(false);

    if (!result) {
      return;
    }

    if (!response.ok || !result.success || !result.lead) {
      setError(result.message ?? "Lead konnte nicht gespeichert werden.");
      return;
    }

    setLeads((current) => current.map((lead) => (lead.id === selectedLead.id ? result.lead! : lead)));
    setSelectedLead(createLeadDraft(result.lead));
    setSuccessMessage("Lead wurde gespeichert.");
    void loadStats(session);
  }

  async function handleChangePassword(event: FormEvent) {
    event.preventDefault();
    if (!session) {
      return;
    }

    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      setError("Die neuen Passwörter stimmen nicht überein.");
      return;
    }

    setSubmittingPanel(true);
    setError("");
    setSuccessMessage("");

    const { response, result } = await requestJson<ChangePasswordResponse>("/api/admin/change-password", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword: changePasswordForm.currentPassword,
        newPassword: changePasswordForm.newPassword,
      }),
    });

    setSubmittingPanel(false);

    if (!result) {
      return;
    }

    if (!response.ok || !result.success || !result.token) {
      setError(result.message ?? "Passwort konnte nicht aktualisiert werden.");
      return;
    }

    applySession(result.token);
    setChangePasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setSuccessMessage(result.message ?? "Passwort erfolgreich aktualisiert.");
    setActivePanel(null);
  }

  async function handleCreateUser(event: FormEvent) {
    event.preventDefault();
    if (!session) {
      return;
    }

    setSubmittingPanel(true);
    setError("");
    setSuccessMessage("");

    const { response, result } = await requestJson<CreateUserResponse>("/api/admin/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCreateForm),
    });

    setSubmittingPanel(false);

    if (!result) {
      return;
    }

    if (!response.ok || !result.success || !result.user) {
      setError(result.message ?? "Benutzer konnte nicht angelegt werden.");
      return;
    }

    setUsers((current) => [...current, result.user!]);
    setUserCreateForm({ username: "", password: "", role: "editor" });
    setSuccessMessage(result.message ?? "Benutzer wurde angelegt.");
  }

  async function handleCmsSave(event: FormEvent) {
    event.preventDefault();
    if (!session) {
      return;
    }

    setSavingCms(true);
    setError("");
    setSuccessMessage("");

    const { response, result } = await requestJson<CmsPageResponse>(`/api/admin/cms/pages/${encodeURIComponent(selectedCmsSlug)}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: cmsDraft, status: cmsPageStatus }),
    });

    setSavingCms(false);

    if (!result) {
      return;
    }

    if (!response.ok || !result.success || !result.page) {
      setError(result.message ?? "CMS-Inhalte konnten nicht gespeichert werden.");
      return;
    }

    setCmsPage(result.page);
    setCmsPageStatus(result.page.status);
    setCmsDraft(createCmsDraft(result.page));
    setPreviewRefreshKey((current) => current + 1);

    if (selectedCmsSlug === "global") {
      const globalContent = result.page.content as CmsGlobalContent;
      setGlobalCmsContent(globalContent);
      setSiteStatus(globalContent.siteStatus ?? "live");
    }

    setSuccessMessage(result.message ?? "CMS-Inhalte wurden gespeichert.");
    void loadCmsPages(session);
  }

  async function handleSiteStatusSave(event: FormEvent) {
    event.preventDefault();
    if (!session) {
      return;
    }

    let currentGlobalCmsContent = globalCmsContent;
    if (!currentGlobalCmsContent) {
      currentGlobalCmsContent = await loadGlobalSiteStatus(session);
      if (!currentGlobalCmsContent) {
        setError("CMS-Inhalte konnten nicht geladen werden.");
        return;
      }
    }

    setSiteStatusSaving(true);
    setError("");
    setSuccessMessage("");

    const nextContent = {
      ...currentGlobalCmsContent,
      siteStatus,
    };

    const { response, result } = await requestJson<CmsPageResponse>(`/api/admin/cms/pages/global`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: nextContent }),
    });

    setSiteStatusSaving(false);

    if (!result) {
      return;
    }

    if (!response.ok || !result.success || !result.page) {
      setError(result.message ?? "Website-Status konnte nicht gespeichert werden.");
      return;
    }

    const globalContent = result.page.content as CmsGlobalContent;
    setGlobalCmsContent(globalContent);
    setSiteStatus(globalContent.siteStatus ?? "live");
    setSuccessMessage(result.message ?? "Website-Status wurde gespeichert.");
  }

  const currentPanelTitle = useMemo(() => {
    if (activePanel === "lead-edit") return "Lead bearbeiten";
    if (activePanel === "change-password") return "Passwort ändern";
    if (activePanel === "users") return "Benutzer verwalten";
    return "";
  }, [activePanel]);

  const navigationGroups = useMemo(() => {
    const baseContent = {
      href: "/admin/content",
      icon: PanelTop,
      access: canAccessCmsSection,
    };

    return [
      {
        title: "Übersicht",
        items: [
          {
            id: "dashboard",
            label: "Dashboard",
            href: "/admin/dashboard",
            icon: LayoutDashboard,
            access: canAccessDashboard,
          },
          {
            id: "leads",
            label: "Leads",
            href: "/admin/leads",
            icon: BarChart3,
            access: canAccessLeads,
          },
        ],
      },
      {
        title: "Website",
        items: [
          {
            id: "pages",
            label: "Seiten",
            href: "/admin/pages",
            icon: FileText,
            access: canAccessCmsSection,
          },
          {
            id: "navigation",
            label: "Navigation",
            href: baseContent.href,
            icon: baseContent.icon,
            access: baseContent.access,
            activate: () => setSelectedCmsSection("navigation"),
          },
          {
            id: "media",
            label: "Medien",
            href: baseContent.href,
            icon: baseContent.icon,
            access: baseContent.access,
          },
          {
            id: "preview",
            label: "Vorschau",
            href: "/admin/preview",
            icon: Eye,
            access: canAccessCmsSection,
          },
        ],
      },
      {
        title: "Einstellungen",
        items: [
          {
            id: "settings",
            label: "Einstellungen",
            href: "/admin/settings",
            icon: Settings,
            access: true,
          },
        ],
      },
    ];
  }, [canAccessCmsSection, canAccessDashboard, canAccessLeads]);

  const currentSectionMeta = useMemo(() => {
    if (currentSection === "leads") {
      return {
        title: "Leads",
        description: "Alle Anfragen mit Bearbeitung und Statuswechsel.",
      };
    }

    if (currentSection === "settings") {
      return {
        title: "Einstellungen",
        description: "Passwort, Benutzer und Sitzung verwalten.",
      };
    }

    if (currentSection === "pages") {
      return {
        title: "Seiten",
        description: "Verfügbare Seiten und CMS-Anbindung verwalten.",
      };
    }

    if (currentSection === "content") {
      return {
        title: "Inhalte",
        description: "Strukturierte Inhalte pro Seite und Sektion bearbeiten.",
      };
    }

    if (currentSection === "preview") {
      return {
        title: "Vorschau",
        description: "Angeschlossene Seite in Desktop-, Tablet- und Mobilbreite prüfen.",
      };
    }

    return {
      title: "Dashboard",
      description: "Kernzahlen für Leads und Seitenaufrufe.",
    };
  }, [currentSection]);

  if (!session) {
    return (
      <main className={shellClass}>
        <section className={`${shellContainerClass} max-w-md ${surfaceClass} p-7`}>
          <h1 className="mb-2 text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className={`mb-6 ${helperTextClass}`}>Melden Sie sich an, um Leads und Benutzer zu verwalten.</p>

          {error && <div className={`mb-4 ${errorAlertClass}`}>{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <label className={fieldLabelClass}>
              Benutzername
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className={fieldControlClass}
                autoComplete="username"
              />
            </label>

            <label className={fieldLabelClass}>
              Passwort
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className={fieldControlClass}
                autoComplete="current-password"
              />
            </label>

            <button type="submit" disabled={submittingLogin} className={`w-full ${primaryButtonClass}`}>
              {submittingLogin ? "Anmeldung läuft..." : "Einloggen"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className={shellClass}>
      <section className={shellContainerClass}>
        <div className="grid items-start gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className={`${surfaceClass} max-h-[calc(100vh-3rem)] overflow-y-auto p-5 text-sm text-slate-800 lg:sticky lg:top-6`}>
            <div className="mb-6 border-b border-slate-200 pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Admin</p>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">Workspace</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Strukturierte Verwaltung für CMS, Leads und Benutzer.</p>
            </div>

            <div className="space-y-6">
              {navigationGroups.map((group) => (
                <div key={group.title} className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {group.title}
                  </div>
                  <div className="space-y-2">
                    {group.items
                      .filter((item) => item.access)
                      .map((item) => {
                        const isActive =
                          item.id === currentSection ||
                          (currentSection === "content" && item.id === "navigation" && selectedCmsSection === "navigation");

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setError("");
                              setSuccessMessage("");
                              item.activate?.();
                              setLocation(item.href);
                            }}
                            className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${
                              isActive
                                ? "bg-slate-900 text-white shadow-[0_8px_20px_-16px_rgba(15,33,55,0.9)]"
                                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <item.icon size={16} />
                            {item.label}
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="min-w-0 space-y-6">
            <div className={`${surfaceClass} p-6`}>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{currentSectionMeta.title}</h1>
                  <p className={`mt-2 max-w-2xl ${helperTextClass}`}>{currentSectionMeta.description}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Eingeloggt als {session.user.username}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (canAccessLeads) {
                        void loadLeads();
                      }
                      if (canAccessDashboard) {
                        void loadStats();
                      }
                      if (canAccessCmsSection && (currentSection === "pages" || currentSection === "content" || currentSection === "preview")) {
                        void loadCmsPages();
                        void loadCmsPage();
                        if (currentSection === "content") {
                          void loadMedia();
                        }
                      }
                    }}
                    className={secondaryButtonClass}
                  >
                    <span className="inline-flex items-center gap-2">
                      <RefreshCw size={16} />
                      Aktualisieren
                    </span>
                  </button>

                  <div ref={settingsRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setSettingsOpen((current) => !current)}
                      className={secondaryButtonClass}
                      aria-label="Einstellungen"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Settings size={16} />
                        Einstellungen
                      </span>
                    </button>

                    {settingsOpen && (
                      <div className="absolute right-0 top-12 z-20 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setSettingsOpen(false);
                            setActivePanel("change-password");
                            setError("");
                            setSuccessMessage("");
                          }}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50"
                        >
                          <KeyRound size={16} />
                          Passwort ändern
                        </button>

                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              setSettingsOpen(false);
                              setActivePanel("users");
                              setError("");
                              setSuccessMessage("");
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50"
                          >
                            <Users size={16} />
                            Benutzer verwalten
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleLogout("Sie wurden abgemeldet.")}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
        {successMessage && (
          <div className={successAlertClass}>
            {successMessage}
          </div>
        )}

        {error && <div className={errorAlertClass}>{error}</div>}

        {currentSection === "dashboard" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
              <div className={`${surfaceClass} p-5`}>
                <p className="text-sm font-medium text-slate-500">Gesamtleads</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loadingStats && !stats ? "..." : stats?.leads.total ?? 0}
                </p>
              </div>
              <div className={`${surfaceClass} p-5`}>
                <p className="text-sm font-medium text-slate-500">Neue Leads heute</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loadingStats && !stats ? "..." : stats?.leads.today ?? 0}
                </p>
              </div>
              <div className={`${surfaceClass} p-5`}>
                <p className="text-sm font-medium text-slate-500">Leads diese Woche</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loadingStats && !stats ? "..." : stats?.leads.thisWeek ?? 0}
                </p>
              </div>
              <div className={`${surfaceClass} p-5`}>
                <p className="text-sm font-medium text-slate-500">Seitenaufrufe heute</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loadingStats && !stats ? "..." : stats?.pageViews.today ?? 0}
                </p>
              </div>
              <div className={`${surfaceClass} p-5`}>
                <p className="text-sm font-medium text-slate-500">Seitenaufrufe 7 Tage</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loadingStats && !stats ? "..." : stats?.pageViews.last7Days ?? 0}
                </p>
              </div>
              <div className={`${surfaceClass} p-5`}>
                <p className="text-sm font-medium text-slate-500">Heute fällig</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loadingStats && !stats ? "..." : stats?.leads.dueToday ?? 0}
                </p>
              </div>
              <div className={`${surfaceClass} p-5`}>
                <p className="text-sm font-medium text-slate-500">Überfällig</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loadingStats && !stats ? "..." : stats?.leads.overdue ?? 0}
                </p>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div className={`${surfaceClass} p-5`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Neu eingegangen</h3>
                    <p className="mt-1 text-sm text-slate-500">Leads von heute, sortiert nach Eingang.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocation("/admin/leads")}
                    className={secondaryButtonClass}
                  >
                    Leadliste
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {loadingStats && !stats && (
                    <div className={emptyStateClass}>
                      Dashboard wird geladen...
                    </div>
                  )}

                  {!loadingStats && (stats?.newLeadsToday.length ?? 0) === 0 && (
                    <div className={emptyStateClass}>
                      Heute sind noch keine neuen Leads eingegangen.
                    </div>
                  )}

                  {(stats?.newLeadsToday ?? []).map((lead) => (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => void openLeadEditorById(lead.id)}
                      className="block w-full rounded-lg border border-slate-100 bg-slate-50 p-4 text-left transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
                          <p className="mt-1 text-sm text-slate-500">Eingegangen am {formatDate(lead.createdAt)}</p>
                        </div>
                        <span className={getLeadStatusBadgeClass(lead.status)}>
                          {getLeadStatusLabel(lead.status)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className={`${surfaceClass} p-5`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Heute fällig</h3>
                    <p className="mt-1 text-sm text-slate-500">Leads mit Wiedervorlage für heute.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocation("/admin/leads")}
                    className={secondaryButtonClass}
                  >
                    Leadliste
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {loadingStats && !stats && (
                    <div className={emptyStateClass}>
                      Dashboard wird geladen...
                    </div>
                  )}

                  {!loadingStats && (stats?.dueTodayLeads.length ?? 0) === 0 && (
                    <div className={emptyStateClass}>
                      Keine Leads für heute fällig.
                    </div>
                  )}

                  {(stats?.dueTodayLeads ?? []).map((lead) => (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => void openLeadEditorById(lead.id)}
                      className="block w-full rounded-lg border border-slate-100 bg-slate-50 p-4 text-left transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
                          <p className="mt-1 text-sm text-slate-500">Fällig am {formatDateOnly(lead.followUpDate)}</p>
                        </div>
                        <span className={getLeadStatusBadgeClass(lead.status)}>
                          {getLeadStatusLabel(lead.status)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className={`${surfaceClass} p-5`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Überfällig</h3>
                    <p className="mt-1 text-sm text-slate-500">Offene Wiedervorlagen vor dem heutigen Datum.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocation("/admin/leads")}
                    className={secondaryButtonClass}
                  >
                    Leadliste
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {loadingStats && !stats && (
                    <div className={emptyStateClass}>
                      Dashboard wird geladen...
                    </div>
                  )}

                  {!loadingStats && (stats?.overdueLeads.length ?? 0) === 0 && (
                    <div className={emptyStateClass}>
                      Keine überfälligen Leads vorhanden.
                    </div>
                  )}

                  {(stats?.overdueLeads ?? []).map((lead) => (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => void openLeadEditorById(lead.id)}
                      className="block w-full rounded-lg border border-slate-100 bg-slate-50 p-4 text-left transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
                          <p className="mt-1 text-sm text-slate-500">Fällig am {formatDateOnly(lead.followUpDate)}</p>
                        </div>
                        <span className={getLeadStatusBadgeClass(lead.status)}>
                          {getLeadStatusLabel(lead.status)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={`${surfaceClass} p-5`}>
              <h3 className="text-base font-semibold text-slate-900">Leads nach Status</h3>
              <div className="mt-4 grid gap-3 lg:grid-cols-5">
                {leadStatuses.map((status) => {
                  const count = stats?.leads.byStatus[status] ?? 0;
                  const total = stats?.leads.total ?? 0;
                  const width = total > 0 ? Math.max((count / total) * 100, count > 0 ? 8 : 0) : 0;

                  return (
                    <div key={status} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-slate-900">{getLeadStatusLabel(status)}</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {loadingStats && !stats ? "..." : count}
                        </p>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                        <div
                          className="h-full rounded-full bg-[#1D6FA4] transition-[width]"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {currentSection === "leads" && (
          <div className="space-y-4">
            <div className={`${surfaceClass} p-4`}>
              <div className="grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)_240px_auto]">
                <label className={fieldLabelClass}>
                  Filter
                  <select
                    value={leadFilter}
                    onChange={(event) => setLeadFilter(event.target.value as LeadFilterValue)}
                    className={fieldControlClass}
                  >
                    <option value="all">Alle</option>
                    <option value="new">Neu</option>
                    <option value="in-progress">In Bearbeitung</option>
                    <option value="completed">Abgeschlossen</option>
                    <option value="without-status">Ohne Status</option>
                    <option value="due-today">Heute fällig</option>
                    <option value="overdue">Überfällig</option>
                    <option value="with-follow-up">Mit Wiedervorlage</option>
                    <option value="without-follow-up">Ohne Wiedervorlage</option>
                  </select>
                </label>

                <label className={fieldLabelClass}>
                  Suche
                  <input
                    value={leadSearch}
                    onChange={(event) => setLeadSearch(event.target.value)}
                    placeholder="Nach Name, E-Mail oder Telefon suchen"
                    className={fieldControlClass}
                  />
                </label>

                <label className={fieldLabelClass}>
                  Sortierung
                  <select
                    value={leadSort}
                    onChange={(event) => setLeadSort(event.target.value as LeadSortValue)}
                    className={fieldControlClass}
                  >
                    <option value="newest">Neueste zuerst</option>
                    <option value="oldest">Älteste zuerst</option>
                    <option value="follow-up-asc">Wiedervorlage aufsteigend</option>
                    <option value="follow-up-desc">Wiedervorlage absteigend</option>
                  </select>
                </label>

                <div className="flex items-end">
                  <div className={infoPanelClass}>
                    {filteredLeads.length} von {leadCount} Leads
                  </div>
                </div>
              </div>
            </div>

            <div className={`${surfaceClass} overflow-x-auto`}>
              <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
                <thead className={tableHeadClass}>
                  <tr>
                    <th className={tableHeaderCellClass}>Datum</th>
                    <th className={tableHeaderCellClass}>Wiedervorlage</th>
                    <th className={tableHeaderCellClass}>Name</th>
                    <th className={tableHeaderCellClass}>E-Mail</th>
                    <th className={tableHeaderCellClass}>Telefon</th>
                    <th className={tableHeaderCellClass}>Nachricht</th>
                    <th className={tableHeaderCellClass}>Status</th>
                    <th className={tableHeaderCellClass}>Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingLeads && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                        Leads werden geladen...
                      </td>
                    </tr>
                  )}

                  {!loadingLeads && leads.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                        Noch keine Leads vorhanden.
                      </td>
                    </tr>
                  )}

                  {!loadingLeads && leads.length > 0 && filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                        Keine Leads für die aktuelle Auswahl gefunden.
                      </td>
                    </tr>
                  )}

                  {!loadingLeads &&
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="border-t border-slate-100 align-top transition-colors hover:bg-slate-50/70">
                        <td className={tableCellClass}>{formatDate(lead.createdAt)}</td>
                        <td className={tableCellClass}>
                          {lead.followUpDate ? (
                            <div className="space-y-2">
                              <div className="font-medium text-slate-900">{formatDateOnly(lead.followUpDate)}</div>
                              <span className={getLeadDueStateBadgeClass(getLeadDueState(lead))}>
                                {getLeadDueStateLabel(getLeadDueState(lead))}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className={`${tableCellClass} font-medium text-slate-900`}>
                          {lead.name}
                          {lead.company && <span className="block text-xs font-normal text-slate-500">{lead.company}</span>}
                        </td>
                        <td className={tableCellClass}>
                          <a href={`mailto:${lead.email}`} className="text-[#1D6FA4]">
                            {lead.email}
                          </a>
                        </td>
                        <td className={tableCellClass}>
                          <a href={`tel:${lead.phone}`} className="text-[#1D6FA4]">
                            {lead.phone}
                          </a>
                        </td>
                        <td className="max-w-sm px-4 py-3 text-sm text-slate-500">
                          <div>{lead.message || "Keine Nachricht"}</div>
                          {(lead.regionLabel || lead.serviceLabel) && (
                            <div className="mt-2 text-xs">
                              {[lead.regionLabel, lead.serviceLabel].filter(Boolean).join(" / ")}
                            </div>
                          )}
                        </td>
                        <td className={tableCellClass}>
                          <select
                            value={lead.status}
                            onChange={(event) => void handleStatusChange(lead.id, event.target.value as LeadStatus)}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                          >
                            {leadStatuses.map((status) => (
                              <option key={status} value={status}>
                                {getLeadStatusLabel(status)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className={tableCellClass}>
                          <button type="button" onClick={() => openLeadEditor(lead)} className={secondaryButtonClass}>
                            <span className="inline-flex items-center gap-2">
                              <PencilLine size={15} />
                              Bearbeiten
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentSection === "pages" && (
          <div className="grid gap-4 lg:grid-cols-2">
            {cmsPageOptions.map((page) => (
              <div key={page.slug} className={`${surfaceClass} p-5`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{page.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{page.path}</p>
                    <p className="mt-3 text-sm text-slate-500">
                      {page.updatedAt ? `Zuletzt aktualisiert: ${formatDate(page.updatedAt)}` : "Noch nicht gespeichert."}
                    </p>
                  </div>
                  <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-900">
                    {page.slug}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCmsSlug(page.slug);
                      setError("");
                      setSuccessMessage("");
                      setLocation("/admin/content");
                    }}
                    className={secondaryButtonClass}
                  >
                    Inhalte bearbeiten
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCmsSlug(page.slug);
                      setError("");
                      setSuccessMessage("");
                      setLocation("/admin/preview");
                    }}
                    className={secondaryButtonClass}
                  >
                    Vorschau öffnen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentSection === "content" && (
          <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
            <div className="space-y-4 xl:sticky xl:top-6">
              <div className={`${surfaceClass} p-4`}>
                <label className={fieldLabelClass}>
                  Seite
                  <select
                    value={selectedCmsSlug}
                    onChange={(event) => setSelectedCmsSlug(event.target.value as CmsPageSlug)}
                    className={fieldControlClass}
                  >
                    {cmsPageOptions.map((page) => (
                      <option key={page.slug} value={page.slug}>
                        {page.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className={`${surfaceClass} p-4`}>
                <p className="text-sm font-medium text-slate-900">Sektionen</p>
                <div className="mt-3 space-y-2">
                  {cmsSections.map((section) => (
                    <button
                      key={section.key}
                      type="button"
                      onClick={() => setSelectedCmsSection(section.key as CmsSectionKey)}
                      className={
                        selectedCmsSection === section.key
                          ? "w-full rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-left text-sm font-medium text-white"
                          : "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-50"
                      }
                    >
                      {section.label}
                    </button>
                  ))}
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
                      onChange={handleMediaUpload}
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
                        <input value={media.url} readOnly className="mt-2 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900" />
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button type="button" onClick={() => void copyMediaUrl(media.url)} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-900 hover:bg-slate-50">
                            URL kopieren
                          </button>
                          {activeImageField && (
                            <button
                              type="button"
                              onClick={() => updateCmsField(cmsSelectedSection.key, activeImageField.key, media.url)}
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

              <form onSubmit={handleCmsSave} className={`${surfaceClass} p-5`}>
                <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{cmsDefinition.title}</h3>
                    <p className="text-sm text-slate-500">{cmsSelectedSection.label} bearbeiten</p>
                  </div>
                  <div className="flex flex-col items-start gap-2 text-sm text-slate-500 sm:items-end">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Status
                      <select
                        value={cmsPageStatus}
                        onChange={(event) => setCmsPageStatus(event.target.value as CmsPageStatus)}
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
                    <>
                      <div className="space-y-3">
                        {navigationDraftItems.map((item, index) => (
                          <div key={item.id} className={infoPanelClass}>
                            <div className="mb-3 flex items-center justify-between">
                              <p className="text-sm font-semibold text-slate-900">
                                {item.id}
                              </p>
                              <button
                                type="button"
                                onClick={() => removeNavigationItem(item.id)}
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
                                  onChange={(event) => updateNavigationItem(index, { label: event.target.value })}
                                  className={fieldControlClass}
                                />
                              </label>
                              <label className={fieldLabelClass}>
                                Pfad / URL
                                <input
                                  value={item.href}
                                  onChange={(event) => updateNavigationItem(index, { href: event.target.value })}
                                  className={fieldControlClass}
                                />
                              </label>
                              <label className={fieldLabelClass}>
                                Typ
                                <select
                                  value={item.type}
                                  onChange={(event) => updateNavigationItem(index, { type: event.target.value as CmsNavigationItem["type"] })}
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
                                  onChange={(event) => updateNavigationItem(index, { target: event.target.value as CmsNavigationItem["target"] })}
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
                                    onChange={(event) => updateNavigationItem(index, { visible: event.target.checked })}
                                  />
                                  <span className="text-sm text-slate-900">{item.visible ? "Ja" : "Nein"}</span>
                                </div>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={addNavigationItem} className={secondaryButtonClass}>
                        Link hinzufügen
                      </button>
                      <label className={fieldLabelClass}>
                        CTA Label
                        <input
                          value={String(((cmsDraft.navigation ?? {}) as CmsDraftSection).ctaLabel ?? "")}
                          onChange={(event) => updateCmsField("navigation", "ctaLabel", event.target.value)}
                          className={fieldControlClass}
                        />
                      </label>
                      <label className={fieldLabelClass}>
                        CTA Pfad
                        <input
                          value={String(((cmsDraft.navigation ?? {}) as CmsDraftSection).ctaHref ?? "")}
                          onChange={(event) => updateCmsField("navigation", "ctaHref", event.target.value)}
                          className={fieldControlClass}
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      {cmsSelectedSection.fields.map((field) => {
                        const sectionValue = (cmsDraft[cmsSelectedSection.key] ?? {}) as CmsDraftSection;
                        const fieldKey = String(field.key);
                        const inputType = field.input as "text" | "textarea" | "checkbox" | "number";
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
                                onChange={(event) => updateCmsField(cmsSelectedSection.key, fieldKey, event.target.value)}
                                rows={"rows" in field && typeof field.rows === "number" ? field.rows : 4}
                                className={fieldControlClass}
                              />
                            ) : inputType === "checkbox" ? (
                              <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                                <input
                                  type="checkbox"
                                  checked={checkedValue}
                                  onChange={(event) => updateCmsField(cmsSelectedSection.key, fieldKey, event.target.checked)}
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
                                  updateCmsField(cmsSelectedSection.key, fieldKey, nextValue);
                                }}
                                className={fieldControlClass}
                              />
                            ) : (
                              <input
                                value={textValue}
                                onChange={(event) => updateCmsField(cmsSelectedSection.key, fieldKey, event.target.value)}
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
                <button
                  type="button"
                  onClick={() => setCmsDraft(createCmsDraft(cmsPage, selectedCmsSlug))}
                  className={secondaryButtonClass}
                >
                  Reset
                </button>
                <button type="submit" disabled={savingCms || loadingCms} className={primaryButtonClass}>
                  {savingCms ? "Speichert..." : "Speichern"}
                </button>
              </div>
              </form>
            </div>
          </div>
        )}

        {currentSection === "preview" && (
          <div className="space-y-4">
            <div className={`${surfaceClass} flex flex-col gap-4 p-4 lg:flex-row lg:items-end lg:justify-between`}>
              <div className="grid gap-3 md:grid-cols-2">
                <label className={fieldLabelClass}>
                  Seite
                  <select
                    value={selectedCmsSlug}
                    onChange={(event) => setSelectedCmsSlug(event.target.value as CmsPageSlug)}
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
                    onChange={(event) => setPreviewViewport(event.target.value as CmsPreviewViewport)}
                    className={fieldControlClass}
                  >
                    <option value="desktop">Desktop</option>
                    <option value="tablet">Tablet</option>
                    <option value="mobile">Mobil</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setLocation("/admin/content")}
                  className={secondaryButtonClass}
                >
                  Inhalte bearbeiten
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewRefreshKey((current) => current + 1)}
                  className={secondaryButtonClass}
                >
                  Vorschau neu laden
                </button>
              </div>
            </div>

            <div className={`${surfaceClass} p-4`}>
              <div className={`overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${previewWidthClass}`}>
                <iframe
                  key={`${selectedCmsSlug}-${previewViewport}-${previewRefreshKey}`}
                  src={cmsDefinition.path}
                  title={`Vorschau ${cmsDefinition.title}`}
                  className="h-[780px] w-full bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {currentSection === "settings" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`${surfaceClass} p-5`}>
              <h3 className="text-base font-semibold text-slate-900">Passwort</h3>
              <p className="mt-2 text-sm text-slate-500">Aktuelles Passwort prüfen und sicher ändern.</p>
              <button
                type="button"
                onClick={() => {
                  setActivePanel("change-password");
                  setError("");
                  setSuccessMessage("");
                }}
                className={`mt-4 ${secondaryButtonClass}`}
              >
                Passwort ändern
              </button>
            </div>

            <div className={`${surfaceClass} p-5`}>
              <h3 className="text-base font-semibold text-slate-900">Benutzer</h3>
              <p className="mt-2 text-sm text-slate-500">
                {isAdmin ? "Benutzer ansehen und neue Zugänge anlegen." : "Nur Admins dürfen Benutzer verwalten."}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (!isAdmin) {
                    setError("Nur Admins dürfen Benutzer verwalten.");
                    return;
                  }

                  setActivePanel("users");
                  setError("");
                  setSuccessMessage("");
                }}
                className={`mt-4 ${secondaryButtonClass}`}
                disabled={!isAdmin}
              >
                Benutzer verwalten
              </button>
            </div>

            <div className={`${surfaceClass} p-5`}>
              <h3 className="text-base font-semibold text-slate-900">Website Status</h3>
              <p className="mt-2 text-sm text-slate-500">
                Besucher sehen bei aktivem Wartungsmodus die Wartungsseite. Der Admin-Bereich bleibt erreichbar.
              </p>
              <form onSubmit={handleSiteStatusSave} className="mt-4 space-y-4">
                <div className="space-y-3 text-sm text-slate-900">
                  <label className={`${infoPanelClass} flex items-center`}>
                    <input
                      type="radio"
                      name="siteStatus"
                      value="live"
                      checked={siteStatus === "live"}
                      onChange={() => setSiteStatus("live")}
                      disabled={!canAccessCmsSection}
                    />
                    <span className="ml-3 font-medium">Live</span>
                  </label>
                  <label className={`${infoPanelClass} flex items-center`}>
                    <input
                      type="radio"
                      name="siteStatus"
                      value="maintenance"
                      checked={siteStatus === "maintenance"}
                      onChange={() => setSiteStatus("maintenance")}
                      disabled={!canAccessCmsSection}
                    />
                    <span className="ml-3 font-medium">Wartung</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={!canAccessCmsSection || siteStatusSaving || siteStatusLoading}
                    className={primaryButtonClass}
                  >
                    {siteStatusSaving ? "Speichert..." : "Status speichern"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (session && canAccessCmsSection) {
                        void loadGlobalSiteStatus(session);
                      }
                    }}
                    disabled={!canAccessCmsSection || siteStatusLoading}
                    className={secondaryButtonClass}
                  >
                    {siteStatusLoading ? "Lädt..." : "Aktualisieren"}
                  </button>
                </div>
              </form>
            </div>

            <div className={`${surfaceClass} p-5`}>
              <h3 className="text-base font-semibold text-slate-900">Sitzung</h3>
              <p className="mt-2 text-sm text-slate-500">Aktuelle Sitzung gültig bis {formatDate(session.expiresAt)}.</p>
              <button
                type="button"
                onClick={() => handleLogout("Sie wurden abgemeldet.")}
                className={`mt-4 ${secondaryButtonClass}`}
              >
                Logout
              </button>
            </div>
          </div>
        )}
          </div>
        </div>
      </section>

      {activePanel && (
        <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/30 backdrop-blur-[1px]">
          <div className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{currentPanelTitle}</h2>
                <p className="text-sm text-slate-500">
                  {activePanel === "lead-edit" && "Lead-Daten in PostgreSQL aktualisieren."}
                  {activePanel === "change-password" && "Aktuelles Passwort prüfen und sicher ersetzen."}
                  {activePanel === "users" && "Interne Benutzer ansehen und neue Benutzer anlegen."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActivePanel(null);
                  setSelectedLead(null);
                  setError("");
                  setSuccessMessage("");
                }}
                className="rounded-xl border border-slate-200 p-2 text-slate-900 hover:bg-slate-50"
                aria-label="Panel schließen"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-6">
              {activePanel === "lead-edit" && selectedLead && (
                <form onSubmit={handleLeadSave} className="space-y-4">
                  <label className={fieldLabelClass}>
                    Name
                    <input
                      value={selectedLead.name}
                      onChange={(event) => setSelectedLead((current) => current ? { ...current, name: event.target.value } : current)}
                      className={fieldControlClass}
                    />
                  </label>

                  <label className={fieldLabelClass}>
                    E-Mail
                    <input
                      type="email"
                      value={selectedLead.email}
                      onChange={(event) => setSelectedLead((current) => current ? { ...current, email: event.target.value } : current)}
                      className={fieldControlClass}
                    />
                  </label>

                  <label className={fieldLabelClass}>
                    Telefon
                    <input
                      value={selectedLead.phone}
                      onChange={(event) => setSelectedLead((current) => current ? { ...current, phone: event.target.value } : current)}
                      className={fieldControlClass}
                    />
                  </label>

                  <label className={fieldLabelClass}>
                    Nachricht
                    <textarea
                      value={selectedLead.message}
                      onChange={(event) => setSelectedLead((current) => current ? { ...current, message: event.target.value } : current)}
                      rows={6}
                      className={fieldControlClass}
                    />
                  </label>

                  <label className={fieldLabelClass}>
                    Interne Notiz
                    <textarea
                      value={selectedLead.internalNote}
                      onChange={(event) => setSelectedLead((current) => current ? { ...current, internalNote: event.target.value } : current)}
                      rows={5}
                      className={fieldControlClass}
                    />
                  </label>

                  <label className={fieldLabelClass}>
                    Wiedervorlage
                    <input
                      type="date"
                      value={selectedLead.followUpDate}
                      onChange={(event) => setSelectedLead((current) => current ? { ...current, followUpDate: event.target.value } : current)}
                      className={fieldControlClass}
                    />
                  </label>

                  <label className={fieldLabelClass}>
                    Status
                    <select
                      value={selectedLead.status}
                      onChange={(event) => setSelectedLead((current) => current ? { ...current, status: event.target.value as LeadStatus } : current)}
                      className={fieldControlClass}
                    >
                      {leadStatuses.map((status) => (
                        <option key={status} value={status}>
                          {getLeadStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setActivePanel(null)} className={secondaryButtonClass}>
                      Schließen
                    </button>
                    <button type="submit" disabled={submittingPanel} className={primaryButtonClass}>
                      {submittingPanel ? "Speichert..." : "Speichern"}
                    </button>
                  </div>
                </form>
              )}

              {activePanel === "change-password" && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <label className={fieldLabelClass}>
                    Aktuelles Passwort
                    <input
                      type="password"
                      value={changePasswordForm.currentPassword}
                      onChange={(event) =>
                        setChangePasswordForm((current) => ({ ...current, currentPassword: event.target.value }))
                      }
                      className={fieldControlClass}
                      autoComplete="current-password"
                    />
                  </label>

                  <label className={fieldLabelClass}>
                    Neues Passwort
                    <input
                      type="password"
                      value={changePasswordForm.newPassword}
                      onChange={(event) =>
                        setChangePasswordForm((current) => ({ ...current, newPassword: event.target.value }))
                      }
                      className={fieldControlClass}
                      autoComplete="new-password"
                    />
                  </label>

                  <label className={fieldLabelClass}>
                    Neues Passwort wiederholen
                    <input
                      type="password"
                      value={changePasswordForm.confirmPassword}
                      onChange={(event) =>
                        setChangePasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))
                      }
                      className={fieldControlClass}
                      autoComplete="new-password"
                    />
                  </label>

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setActivePanel(null)} className={secondaryButtonClass}>
                      Abbrechen
                    </button>
                    <button type="submit" disabled={submittingPanel} className={primaryButtonClass}>
                      {submittingPanel ? "Speichert..." : "Passwort aktualisieren"}
                    </button>
                  </div>
                </form>
              )}

              {activePanel === "users" && (
                <div className="space-y-6">
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className={tableHeadClass}>
                        <tr>
                          <th className={tableHeaderCellClass}>Benutzer</th>
                          <th className={tableHeaderCellClass}>Rolle</th>
                          <th className={tableHeaderCellClass}>Status</th>
                          <th className={tableHeaderCellClass}>Erstellt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-t border-slate-100">
                            <td className={`${tableCellClass} font-medium text-slate-900`}>{user.username}</td>
                            <td className={tableCellClass}>{formatRoleLabel(user.role)}</td>
                            <td className={tableCellClass}>{user.isActive ? "aktiv" : "inaktiv"}</td>
                            <td className={tableCellClass}>{formatDate(user.createdAt)}</td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                              Keine Benutzer vorhanden.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <form onSubmit={handleCreateUser} className={`${surfaceMutedClass} p-4`}>
                    <div className="mb-4 flex items-center gap-2">
                      <UserPlus size={18} className="text-[#1D6FA4]" />
                      <h3 className="text-base font-semibold text-slate-900">Neuen Benutzer anlegen</h3>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <label className={fieldLabelClass}>
                        Benutzername
                        <input
                          value={userCreateForm.username}
                          onChange={(event) =>
                            setUserCreateForm((current) => ({ ...current, username: event.target.value }))
                          }
                          className={fieldControlClass}
                          autoComplete="off"
                        />
                      </label>

                      <label className={fieldLabelClass}>
                        Passwort
                        <input
                          type="password"
                          value={userCreateForm.password}
                          onChange={(event) =>
                            setUserCreateForm((current) => ({ ...current, password: event.target.value }))
                          }
                          className={fieldControlClass}
                          autoComplete="new-password"
                        />
                      </label>

                      <label className={fieldLabelClass}>
                        Rolle
                        <select
                          value={userCreateForm.role}
                          onChange={(event) =>
                            setUserCreateForm((current) => ({ ...current, role: event.target.value as AdminRole }))
                          }
                          className={fieldControlClass}
                        >
                          {userCreationRoles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button type="submit" disabled={submittingPanel} className={primaryButtonClass}>
                        {submittingPanel ? "Legt an..." : "Benutzer anlegen"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
