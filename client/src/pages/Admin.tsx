import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { BarChart3, Eye, FileText, LayoutDashboard, PanelTop, Settings } from "lucide-react";
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
import {
  AdminAlert,
  AdminHeader,
  AdminLogin,
  AdminPanel,
  AdminShell,
  AdminSidebar,
  ChangePasswordPanel,
  CmsEditorSection,
  DashboardSection,
  LeadDetailPanel,
  LeadsSection,
  PagesSection,
  PreviewSection,
  SettingsSection,
  UsersPanel,
  createCmsDraft,
  createLeadDraft,
  createNavigationItemId,
  formatDate,
  formatFileSize,
  formatRoleLabel,
  getDefaultSectionForRole,
  hasCmsAccess,
  hasSectionAccess,
  matchesLeadFilter,
  matchesLeadSearch,
  parseToken,
  toNavigationItems,
  type ActivePanel,
  type AdminMediaItem,
  type AdminSection,
  type CmsDraft,
  type CmsDraftSection,
  type CmsDraftValue,
  type CmsImagePlacementOption,
  type CmsPreviewViewport,
  type CmsSectionKey,
  type LeadDraft,
  type LeadFilterValue,
  type LeadSortValue,
  type SessionState,
  type SiteStatus,
  type SidebarNavigationItem,
} from "../components/admin";

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

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Datei konnte nicht gelesen werden."));
    reader.readAsDataURL(file);
  });
}

const MAX_UPLOAD_FILE_BYTES = 20 * 1024 * 1024;
const MAX_STORED_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_UPLOAD_IMAGE_DIMENSION = 1920;

function estimateDataUrlBytes(dataUrl: string) {
  const base64Start = dataUrl.indexOf(",");
  if (base64Start < 0) {
    return 0;
  }

  const base64Length = dataUrl.length - base64Start - 1;
  return Math.ceil((base64Length * 3) / 4);
}

function replaceFileExtension(filename: string, nextExtension: string) {
  const index = filename.lastIndexOf(".");
  if (index <= 0) {
    return `${filename}.${nextExtension}`;
  }
  return `${filename.slice(0, index)}.${nextExtension}`;
}

async function decodeImageDimensions(file: File) {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    const dimensions = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dimensions;
  }

  return await new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => {
      reject(new Error("Bild konnte nicht verarbeitet werden."));
      URL.revokeObjectURL(objectUrl);
    };
    image.src = objectUrl;
  });
}

async function createCompressedUploadData(file: File) {
  const dimensions = await decodeImageDimensions(file);
  const scale = Math.min(1, MAX_UPLOAD_IMAGE_DIMENSION / Math.max(dimensions.width, dimensions.height));

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(dimensions.width * scale));
  canvas.height = Math.max(1, Math.round(dimensions.height * scale));

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Bildkomprimierung konnte nicht initialisiert werden.");
  }

  const objectUrl = URL.createObjectURL(file);
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const nextImage = new Image();
    nextImage.onload = () => resolve(nextImage);
    nextImage.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Bild konnte nicht geladen werden."));
    };
    nextImage.src = objectUrl;
  });

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(objectUrl);

  let compressedDataUrl = "";
  for (const quality of [0.84, 0.76, 0.68]) {
    const candidate = canvas.toDataURL("image/webp", quality);
    compressedDataUrl = candidate;
    if (estimateDataUrlBytes(candidate) <= MAX_STORED_IMAGE_BYTES) {
      break;
    }
  }

  if (!compressedDataUrl) {
    throw new Error("Bild konnte nicht komprimiert werden.");
  }

  if (estimateDataUrlBytes(compressedDataUrl) > MAX_STORED_IMAGE_BYTES) {
    throw new Error("Bild ist auch nach Komprimierung zu groß. Bitte kleineres Bild wählen.");
  }

  return {
    filename: replaceFileExtension(file.name, "webp"),
    dataUrl: compressedDataUrl,
  };
}

async function prepareMediaUpload(file: File) {
  if (file.size > MAX_UPLOAD_FILE_BYTES) {
    throw new Error("Bild ist zu groß. Maximal 20 MB als Quelldatei erlaubt.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Nur Bilddateien sind erlaubt.");
  }

  if (file.size <= MAX_STORED_IMAGE_BYTES) {
    const dataUrl = await fileToDataUrl(file);
    return { filename: file.name, dataUrl };
  }

  if (file.type === "image/gif") {
    throw new Error("GIF-Dateien über 8 MB werden nicht unterstützt. Bitte JPG, PNG oder WEBP nutzen.");
  }

  return await createCompressedUploadData(file);
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
  const [selectedImagePlacementKey, setSelectedImagePlacementKey] = useState("");
  const [autoApplyUploadedMedia, setAutoApplyUploadedMedia] = useState(true);
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
  const imagePlacementOptions = useMemo<CmsImagePlacementOption[]>(
    () =>
      cmsSections.flatMap((section) =>
        section.fields
          .filter((field) => field.input === "text" && field.key.toLowerCase().includes("imageurl"))
          .map((field) => ({
            key: `${section.key}.${field.key}`,
            label: `${section.label}: ${field.label}`,
            sectionKey: section.key,
            fieldKey: field.key,
          })),
      ),
    [cmsSections],
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
    setSelectedImagePlacementKey("");
    setAutoApplyUploadedMedia(true);
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

  function resolveImagePlacement(placementKey?: string) {
    const resolvedKey = placementKey ?? selectedImagePlacementKey;
    if (!resolvedKey) {
      return null;
    }
    return imagePlacementOptions.find((option) => option.key === resolvedKey) ?? null;
  }

  function applyMediaToPlacement(url: string, placementKey?: string) {
    const target = resolveImagePlacement(placementKey);
    if (!target) {
      return null;
    }

    updateCmsField(target.sectionKey, target.fieldKey, url);
    return target;
  }

  async function handleMediaUpload(file: File, placementKey?: string) {
    if (!file || !session) {
      return;
    }

    setUploadingMedia(true);
    setError("");
    setSuccessMessage("");

    try {
      const upload = await prepareMediaUpload(file);

      const { response, result } = await requestJson<AdminMediaUploadResponse>("/api/admin/media/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: upload.filename,
          dataUrl: upload.dataUrl,
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
      const appliedPlacement = applyMediaToPlacement(result.media.url, placementKey);
      const message = result.message ?? "Bild wurde hochgeladen.";
      setSuccessMessage(appliedPlacement ? `${message} Ziel: ${appliedPlacement.label}.` : message);
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
    if (imagePlacementOptions.length === 0) {
      setSelectedImagePlacementKey("");
      return;
    }

    setSelectedImagePlacementKey((current) => {
      if (current && imagePlacementOptions.some((option) => option.key === current)) {
        return current;
      }
      return imagePlacementOptions[0].key;
    });
  }, [imagePlacementOptions]);

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
      <AdminLogin
        username={username}
        password={password}
        submitting={submittingLogin}
        error={error}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
    );
  }

  const closeActivePanel = () => {
    setActivePanel(null);
    setSelectedLead(null);
    setError("");
    setSuccessMessage("");
  };

  const handleSidebarNavigate = (item: SidebarNavigationItem) => {
    setError("");
    setSuccessMessage("");
    item.activate?.();
    setLocation(item.href);
  };

  const handleHeaderRefresh = () => {
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
  };

  return (
    <>
      <AdminShell
        sidebar={(
          <AdminSidebar
            navigationGroups={navigationGroups}
            currentSection={currentSection}
            selectedCmsSection={selectedCmsSection}
            onNavigate={handleSidebarNavigate}
          />
        )}
        header={(
          <AdminHeader
            sectionMeta={currentSectionMeta}
            username={session.user.username}
            settingsOpen={settingsOpen}
            settingsRef={settingsRef}
            isAdmin={isAdmin}
            onToggleSettings={() => setSettingsOpen((current) => !current)}
            onRefresh={handleHeaderRefresh}
            onOpenChangePassword={() => {
              setSettingsOpen(false);
              setActivePanel("change-password");
              setError("");
              setSuccessMessage("");
            }}
            onOpenUsers={() => {
              setSettingsOpen(false);
              setActivePanel("users");
              setError("");
              setSuccessMessage("");
            }}
            onLogout={() => handleLogout("Sie wurden abgemeldet.")}
          />
        )}
        alerts={(
          <>
            {successMessage && <AdminAlert type="success" message={successMessage} />}
            {error && <AdminAlert type="error" message={error} />}
          </>
        )}
      >
        {currentSection === "dashboard" && (
          <DashboardSection
            stats={stats}
            loadingStats={loadingStats}
            leadStatuses={leadStatuses}
            onOpenLeadEditorById={(id) => {
              void openLeadEditorById(id);
            }}
            onOpenLeadsList={() => setLocation("/admin/leads")}
          />
        )}

        {currentSection === "leads" && (
          <LeadsSection
            leadFilter={leadFilter}
            leadSearch={leadSearch}
            leadSort={leadSort}
            filteredLeads={filteredLeads}
            leads={leads}
            loadingLeads={loadingLeads}
            leadStatuses={leadStatuses}
            onFilterChange={setLeadFilter}
            onSearchChange={setLeadSearch}
            onSortChange={setLeadSort}
            onStatusChange={(id, status) => {
              void handleStatusChange(id, status);
            }}
            onOpenLeadEditor={openLeadEditor}
          />
        )}

        {currentSection === "pages" && (
          <PagesSection
            pages={cmsPageOptions}
            formatDate={formatDate}
            onEditContent={(slug) => {
              setSelectedCmsSlug(slug);
              setError("");
              setSuccessMessage("");
              setLocation("/admin/content");
            }}
            onOpenPreview={(slug) => {
              setSelectedCmsSlug(slug);
              setError("");
              setSuccessMessage("");
              setLocation("/admin/preview");
            }}
          />
        )}

        {currentSection === "content" && (
          <CmsEditorSection
            cmsPageOptions={cmsPageOptions}
            selectedCmsSlug={selectedCmsSlug}
            cmsSections={cmsSections}
            selectedCmsSectionKey={selectedCmsSection}
            cmsSelectedSection={cmsSelectedSection}
            cmsDefinitionTitle={cmsDefinition.title}
            cmsPageStatus={cmsPageStatus}
            cmsPage={cmsPage}
            cmsDraft={cmsDraft}
            isGlobalNavigationSection={isGlobalNavigationSection}
            navigationDraftItems={navigationDraftItems}
            loadingCms={loadingCms}
            savingCms={savingCms}
            mediaItems={mediaItems}
            loadingMedia={loadingMedia}
            uploadingMedia={uploadingMedia}
            imagePlacementOptions={imagePlacementOptions}
            selectedImagePlacementKey={selectedImagePlacementKey}
            autoApplyUploadedMedia={autoApplyUploadedMedia}
            onSelectSlug={setSelectedCmsSlug}
            onSelectSection={setSelectedCmsSection}
            onSelectImagePlacementKey={setSelectedImagePlacementKey}
            onSetAutoApplyUploadedMedia={setAutoApplyUploadedMedia}
            onPickMediaFile={handleMediaUpload}
            onCopyMediaUrl={(url) => {
              void copyMediaUrl(url);
            }}
            onApplyMediaToPlacement={applyMediaToPlacement}
            onSubmit={handleCmsSave}
            onReset={() => setCmsDraft(createCmsDraft(cmsPage, selectedCmsSlug))}
            onSetCmsPageStatus={setCmsPageStatus}
            onUpdateCmsField={updateCmsField}
            onUpdateNavigationItem={updateNavigationItem}
            onRemoveNavigationItem={removeNavigationItem}
            onAddNavigationItem={addNavigationItem}
            formatDate={formatDate}
            formatFileSize={formatFileSize}
            previewViewport={previewViewport}
            previewRefreshKey={previewRefreshKey}
            previewWidthClass={previewWidthClass}
            pagePath={cmsDefinition.path}
            pageTitle={cmsDefinition.title}
            onSelectViewport={setPreviewViewport}
            onRefreshPreview={() => setPreviewRefreshKey((current) => current + 1)}
            onOpenFullPreview={() => setLocation("/admin/preview")}
          />
        )}

        {currentSection === "preview" && (
          <PreviewSection
            cmsPageOptions={cmsPageOptions}
            selectedCmsSlug={selectedCmsSlug}
            previewViewport={previewViewport}
            previewRefreshKey={previewRefreshKey}
            previewWidthClass={previewWidthClass}
            pagePath={cmsDefinition.path}
            pageTitle={cmsDefinition.title}
            onSelectSlug={setSelectedCmsSlug}
            onSelectViewport={setPreviewViewport}
            onEditContent={() => setLocation("/admin/content")}
            onRefreshPreview={() => setPreviewRefreshKey((current) => current + 1)}
            cmsSections={cmsSections}
            cmsDraft={cmsDraft}
            onSelectSection={setSelectedCmsSection}
            onUpdateCmsField={updateCmsField}
          />
        )}

        {currentSection === "settings" && (
          <SettingsSection
            isAdmin={isAdmin}
            canAccessCmsSection={canAccessCmsSection}
            siteStatus={siteStatus}
            siteStatusLoading={siteStatusLoading}
            siteStatusSaving={siteStatusSaving}
            sessionExpiresAtLabel={formatDate(session.expiresAt)}
            onOpenChangePassword={() => {
              setActivePanel("change-password");
              setError("");
              setSuccessMessage("");
            }}
            onOpenUsers={() => {
              if (!isAdmin) {
                setError("Nur Admins dürfen Benutzer verwalten.");
                return;
              }
              setActivePanel("users");
              setError("");
              setSuccessMessage("");
            }}
            onLogout={() => handleLogout("Sie wurden abgemeldet.")}
            onSetSiteStatus={setSiteStatus}
            onSaveSiteStatus={handleSiteStatusSave}
            onRefreshSiteStatus={() => {
              if (session && canAccessCmsSection) {
                void loadGlobalSiteStatus(session);
              }
            }}
          />
        )}
      </AdminShell>

      {activePanel && (
        <AdminPanel
          title={currentPanelTitle}
          description={
            activePanel === "lead-edit"
              ? "Lead-Daten in PostgreSQL aktualisieren."
              : activePanel === "change-password"
                ? "Aktuelles Passwort prüfen und sicher ersetzen."
                : "Interne Benutzer ansehen und neue Benutzer anlegen."
          }
          onClose={closeActivePanel}
        >
          {activePanel === "lead-edit" && selectedLead && (
            <LeadDetailPanel
              selectedLead={selectedLead}
              leadStatuses={leadStatuses}
              submitting={submittingPanel}
              onSubmit={handleLeadSave}
              onClose={closeActivePanel}
              onChange={(key, value) => {
                setSelectedLead((current) => (current ? ({ ...current, [key]: value } as LeadDraft) : current));
              }}
            />
          )}

          {activePanel === "change-password" && (
            <ChangePasswordPanel
              formValue={changePasswordForm}
              submitting={submittingPanel}
              onSubmit={handleChangePassword}
              onClose={closeActivePanel}
              onChange={(key, value) => {
                setChangePasswordForm((current) => ({ ...current, [key]: value }));
              }}
            />
          )}

          {activePanel === "users" && (
            <UsersPanel
              users={users}
              userCreateForm={userCreateForm}
              userCreationRoles={userCreationRoles}
              submitting={submittingPanel}
              onSubmitCreateUser={handleCreateUser}
              onChangeCreateForm={(key, value) => {
                setUserCreateForm((current) => ({ ...current, [key]: value }));
              }}
              formatDate={formatDate}
              formatRoleLabel={formatRoleLabel}
            />
          )}
        </AdminPanel>
      )}
    </>
  );
}
