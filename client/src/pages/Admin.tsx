import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
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
import { useLocation } from "wouter";
import type { AdminDashboardStats, AdminRole, AdminSessionUser, AdminUser } from "@shared/admin";
import {
  cmsPageDefinitions,
  getDefaultCmsPageContent,
  type CmsHomeContent,
  type CmsPage,
  type CmsPageSlug,
  type CmsPageSummary,
} from "@shared/cms";
import type { AdminLead, LeadStatus } from "@shared/lead";

const ADMIN_TOKEN_KEY = "proclean_admin_token";
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
const leadStatuses: LeadStatus[] = ["new", "contacted", "qualified", "done", "archived"];
const adminRoles: AdminRole[] = ["admin", "staff"];

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
type CmsSectionKey = keyof CmsHomeContent;
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

const buttonBaseClass = "rounded-lg px-4 py-2 text-sm font-semibold transition-colors";
const secondaryButtonClass = `${buttonBaseClass} border border-gray-200 bg-white text-[#0F2137] hover:bg-gray-50`;
const primaryButtonClass = `${buttonBaseClass} bg-[#1D6FA4] text-white hover:bg-[#155d8e] disabled:bg-gray-400`;

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

function createCmsDraft(page?: CmsPage | null) {
  return page?.slug === "home"
    ? page.content
    : getDefaultCmsPageContent("home");
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
  const [cmsDraft, setCmsDraft] = useState<CmsHomeContent>(() => getDefaultCmsPageContent("home"));
  const [loadingCms, setLoadingCms] = useState(false);
  const [savingCms, setSavingCms] = useState(false);
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
    role: "staff" as AdminRole,
  });

  const settingsRef = useRef<HTMLDivElement | null>(null);
  const leadCount = leads.length;
  const isAdmin = session?.user.role === "admin";
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

  const cmsDefinition = cmsPageDefinitions[selectedCmsSlug];
  const cmsSections = cmsDefinition.sections;
  const cmsSelectedSection = cmsSections.find((section) => section.key === selectedCmsSection) ?? cmsSections[0];
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
    setSelectedCmsSlug("home");
    setSelectedCmsSection("hero");
    setPreviewRefreshKey(0);
    setSelectedLead(null);
    setActivePanel(null);
    setSettingsOpen(false);
    setPassword("");
    setChangePasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setUserCreateForm({ username: "", password: "", role: "staff" });
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
    if (!activeSession) {
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
    if (!activeSession) {
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
    if (!activeSession) {
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
    if (!activeSession) {
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
    setCmsDraft(createCmsDraft(result.page));
  }

  function updateCmsField<TSection extends CmsSectionKey>(
    section: TSection,
    field: keyof CmsHomeContent[TSection],
    value: string,
  ) {
    setCmsDraft((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  }

  useEffect(() => {
    if (!session) {
      return;
    }

    void loadLeads(session);
    void loadStats(session);
  }, [session]);

  useEffect(() => {
    if (!session) {
      return;
    }

    if (currentSection !== "pages" && currentSection !== "content" && currentSection !== "preview") {
      return;
    }

    void loadCmsPages(session);
    void loadCmsPage(selectedCmsSlug, session);
  }, [currentSection, selectedCmsSlug, session]);

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
        handleLogout("Sitzung wegen Inaktivitaet beendet.");
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
      setLocation("/admin/dashboard");
    }
  }, [location, session, setLocation]);

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

    applySession(result.token);
    setPassword("");
    setSuccessMessage("");

    if (location === "/admin") {
      setLocation("/admin/dashboard");
    }
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
      setError(result.message ?? "Status konnte nicht geaendert werden.");
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
      setError("Die neuen Passwoerter stimmen nicht ueberein.");
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
    setUserCreateForm({ username: "", password: "", role: "staff" });
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
      body: JSON.stringify({ content: cmsDraft }),
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
    setCmsDraft(createCmsDraft(result.page));
    setPreviewRefreshKey((current) => current + 1);
    setSuccessMessage(result.message ?? "CMS-Inhalte wurden gespeichert.");
    void loadCmsPages(session);
  }

  const currentPanelTitle = useMemo(() => {
    if (activePanel === "lead-edit") return "Lead bearbeiten";
    if (activePanel === "change-password") return "Passwort aendern";
    if (activePanel === "users") return "Benutzer verwalten";
    return "";
  }, [activePanel]);

  const navigationItems = useMemo(
    () => [
      {
        id: "dashboard" as const,
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "leads" as const,
        label: "Leads",
        href: "/admin/leads",
        icon: BarChart3,
      },
      {
        id: "settings" as const,
        label: "Einstellungen",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        id: "pages" as const,
        label: "Seiten",
        href: "/admin/pages",
        icon: FileText,
      },
      {
        id: "content" as const,
        label: "Inhalte",
        href: "/admin/content",
        icon: PanelTop,
      },
      {
        id: "preview" as const,
        label: "Vorschau",
        href: "/admin/preview",
        icon: Eye,
      },
    ],
    [],
  );

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
        description: "Verfuegbare Seiten und CMS-Anbindung verwalten.",
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
        description: "Angeschlossene Seite in Desktop-, Tablet- und Mobilbreite pruefen.",
      };
    }

    return {
      title: "Dashboard",
      description: "Kernzahlen fuer Leads und Seitenaufrufe.",
    };
  }, [currentSection]);

  if (!session) {
    return (
      <main className="min-h-screen bg-[#F7F8FA] px-4 py-10">
        <section className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-[#0F2137]">Admin Login</h1>
          <p className="mb-6 text-sm text-[#6B7A8D]">Melden Sie sich an, um Leads und Benutzer zu verwalten.</p>

          {error && <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block text-sm font-medium text-[#0F2137]">
              Benutzername
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                autoComplete="username"
              />
            </label>

            <label className="block text-sm font-medium text-[#0F2137]">
              Passwort
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                autoComplete="current-password"
              />
            </label>

            <button type="submit" disabled={submittingLogin} className={`w-full ${primaryButtonClass}`}>
              {submittingLogin ? "Anmeldung laeuft..." : "Einloggen"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-4 py-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0F2137]">Lead Manager</h1>
            <p className="text-sm text-[#6B7A8D]">
              {leadCount} Leads gespeichert, eingeloggt als {session.user.username}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                void loadLeads();
                void loadStats();
                if (currentSection === "pages" || currentSection === "content" || currentSection === "preview") {
                  void loadCmsPages();
                  void loadCmsPage();
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
                <div className="absolute right-0 top-12 z-20 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsOpen(false);
                      setActivePanel("change-password");
                      setError("");
                      setSuccessMessage("");
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[#0F2137] hover:bg-gray-50"
                  >
                    <KeyRound size={16} />
                    Passwort aendern
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
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[#0F2137] hover:bg-gray-50"
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

        <div className="mb-6 flex flex-wrap gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setError("");
                  setSuccessMessage("");
                  setLocation(item.href);
                }}
                className={
                  isActive
                    ? `${buttonBaseClass} bg-[#0F2137] text-white`
                    : `${secondaryButtonClass} text-[#0F2137]`
                }
              >
                <span className="inline-flex items-center gap-2">
                  <Icon size={16} />
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-white px-5 py-4">
          <h2 className="text-xl font-semibold text-[#0F2137]">{currentSectionMeta.title}</h2>
          <p className="mt-1 text-sm text-[#6B7A8D]">{currentSectionMeta.description}</p>
        </div>

        {successMessage && (
          <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        {error && <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {currentSection === "dashboard" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-[#6B7A8D]">Gesamtleads</p>
                <p className="mt-2 text-3xl font-bold text-[#0F2137]">
                  {loadingStats && !stats ? "..." : stats?.leads.total ?? 0}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-[#6B7A8D]">Neue Leads heute</p>
                <p className="mt-2 text-3xl font-bold text-[#0F2137]">
                  {loadingStats && !stats ? "..." : stats?.leads.today ?? 0}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-[#6B7A8D]">Leads diese Woche</p>
                <p className="mt-2 text-3xl font-bold text-[#0F2137]">
                  {loadingStats && !stats ? "..." : stats?.leads.thisWeek ?? 0}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-[#6B7A8D]">Seitenaufrufe heute</p>
                <p className="mt-2 text-3xl font-bold text-[#0F2137]">
                  {loadingStats && !stats ? "..." : stats?.pageViews.today ?? 0}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-[#6B7A8D]">Seitenaufrufe 7 Tage</p>
                <p className="mt-2 text-3xl font-bold text-[#0F2137]">
                  {loadingStats && !stats ? "..." : stats?.pageViews.last7Days ?? 0}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-[#6B7A8D]">Heute faellig</p>
                <p className="mt-2 text-3xl font-bold text-[#0F2137]">
                  {loadingStats && !stats ? "..." : stats?.leads.dueToday ?? 0}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-[#6B7A8D]">Ueberfaellig</p>
                <p className="mt-2 text-3xl font-bold text-[#0F2137]">
                  {loadingStats && !stats ? "..." : stats?.leads.overdue ?? 0}
                </p>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#0F2137]">Neu eingegangen</h3>
                    <p className="mt-1 text-sm text-[#6B7A8D]">Leads von heute, sortiert nach Eingang.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocation("/admin/leads")}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-[#0F2137] hover:bg-gray-50"
                  >
                    Leadliste
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {loadingStats && !stats && (
                    <div className="rounded-lg border border-gray-100 bg-[#F7F8FA] px-4 py-8 text-center text-sm text-[#6B7A8D]">
                      Dashboard wird geladen...
                    </div>
                  )}

                  {!loadingStats && (stats?.newLeadsToday.length ?? 0) === 0 && (
                    <div className="rounded-lg border border-gray-100 bg-[#F7F8FA] px-4 py-8 text-center text-sm text-[#6B7A8D]">
                      Heute sind noch keine neuen Leads eingegangen.
                    </div>
                  )}

                  {(stats?.newLeadsToday ?? []).map((lead) => (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => void openLeadEditorById(lead.id)}
                      className="block w-full rounded-lg border border-gray-100 bg-[#F7F8FA] p-4 text-left transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#0F2137]">{lead.name}</p>
                          <p className="mt-1 text-sm text-[#6B7A8D]">Eingegangen am {formatDate(lead.createdAt)}</p>
                        </div>
                        <span className="inline-flex rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-[#0F2137]">
                          {lead.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#0F2137]">Heute faellig</h3>
                    <p className="mt-1 text-sm text-[#6B7A8D]">Leads mit Wiedervorlage fuer heute.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocation("/admin/leads")}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-[#0F2137] hover:bg-gray-50"
                  >
                    Leadliste
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {loadingStats && !stats && (
                    <div className="rounded-lg border border-gray-100 bg-[#F7F8FA] px-4 py-8 text-center text-sm text-[#6B7A8D]">
                      Dashboard wird geladen...
                    </div>
                  )}

                  {!loadingStats && (stats?.dueTodayLeads.length ?? 0) === 0 && (
                    <div className="rounded-lg border border-gray-100 bg-[#F7F8FA] px-4 py-8 text-center text-sm text-[#6B7A8D]">
                      Keine Leads fuer heute faellig.
                    </div>
                  )}

                  {(stats?.dueTodayLeads ?? []).map((lead) => (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => void openLeadEditorById(lead.id)}
                      className="block w-full rounded-lg border border-gray-100 bg-[#F7F8FA] p-4 text-left transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#0F2137]">{lead.name}</p>
                          <p className="mt-1 text-sm text-[#6B7A8D]">Faellig am {formatDateOnly(lead.followUpDate)}</p>
                        </div>
                        <span className="inline-flex rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                          {lead.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#0F2137]">Ueberfaellig</h3>
                    <p className="mt-1 text-sm text-[#6B7A8D]">Offene Wiedervorlagen vor dem heutigen Datum.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocation("/admin/leads")}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-[#0F2137] hover:bg-gray-50"
                  >
                    Leadliste
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {loadingStats && !stats && (
                    <div className="rounded-lg border border-gray-100 bg-[#F7F8FA] px-4 py-8 text-center text-sm text-[#6B7A8D]">
                      Dashboard wird geladen...
                    </div>
                  )}

                  {!loadingStats && (stats?.overdueLeads.length ?? 0) === 0 && (
                    <div className="rounded-lg border border-gray-100 bg-[#F7F8FA] px-4 py-8 text-center text-sm text-[#6B7A8D]">
                      Keine ueberfaelligen Leads vorhanden.
                    </div>
                  )}

                  {(stats?.overdueLeads ?? []).map((lead) => (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => void openLeadEditorById(lead.id)}
                      className="block w-full rounded-lg border border-gray-100 bg-[#F7F8FA] p-4 text-left transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#0F2137]">{lead.name}</p>
                          <p className="mt-1 text-sm text-[#6B7A8D]">Faellig am {formatDateOnly(lead.followUpDate)}</p>
                        </div>
                        <span className="inline-flex rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                          {lead.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="text-base font-semibold text-[#0F2137]">Leads nach Status</h3>
              <div className="mt-4 grid gap-3 lg:grid-cols-5">
                {leadStatuses.map((status) => {
                  const count = stats?.leads.byStatus[status] ?? 0;
                  const total = stats?.leads.total ?? 0;
                  const width = total > 0 ? Math.max((count / total) * 100, count > 0 ? 8 : 0) : 0;

                  return (
                    <div key={status} className="rounded-lg border border-gray-100 bg-[#F7F8FA] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium capitalize text-[#0F2137]">{status}</p>
                        <p className="text-sm font-semibold text-[#0F2137]">
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
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)_240px_auto]">
                <label className="block text-sm font-medium text-[#0F2137]">
                  Filter
                  <select
                    value={leadFilter}
                    onChange={(event) => setLeadFilter(event.target.value as LeadFilterValue)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="all">Alle</option>
                    <option value="new">Neu</option>
                    <option value="in-progress">In Bearbeitung</option>
                    <option value="completed">Abgeschlossen</option>
                    <option value="without-status">Ohne Status</option>
                    <option value="due-today">Heute faellig</option>
                    <option value="overdue">Ueberfaellig</option>
                    <option value="with-follow-up">Mit Wiedervorlage</option>
                    <option value="without-follow-up">Ohne Wiedervorlage</option>
                  </select>
                </label>

                <label className="block text-sm font-medium text-[#0F2137]">
                  Suche
                  <input
                    value={leadSearch}
                    onChange={(event) => setLeadSearch(event.target.value)}
                    placeholder="Nach Name, E-Mail oder Telefon suchen"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block text-sm font-medium text-[#0F2137]">
                  Sortierung
                  <select
                    value={leadSort}
                    onChange={(event) => setLeadSort(event.target.value as LeadSortValue)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="newest">Neueste zuerst</option>
                    <option value="oldest">Aelteste zuerst</option>
                    <option value="follow-up-asc">Wiedervorlage aufsteigend</option>
                    <option value="follow-up-desc">Wiedervorlage absteigend</option>
                  </select>
                </label>

                <div className="flex items-end">
                  <div className="w-full rounded-lg border border-gray-200 bg-[#F7F8FA] px-4 py-2 text-sm text-[#0F2137]">
                    {filteredLeads.length} von {leadCount} Leads
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-[#6B7A8D]">
                  <tr>
                    <th className="px-4 py-3">Datum</th>
                    <th className="px-4 py-3">Wiedervorlage</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">E-Mail</th>
                    <th className="px-4 py-3">Telefon</th>
                    <th className="px-4 py-3">Nachricht</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingLeads && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-[#6B7A8D]">
                        Leads werden geladen...
                      </td>
                    </tr>
                  )}

                  {!loadingLeads && leads.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-[#6B7A8D]">
                        Noch keine Leads vorhanden.
                      </td>
                    </tr>
                  )}

                  {!loadingLeads && leads.length > 0 && filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-[#6B7A8D]">
                        Keine Leads fuer die aktuelle Auswahl gefunden.
                      </td>
                    </tr>
                  )}

                  {!loadingLeads &&
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="border-t border-gray-100 align-top">
                        <td className="px-4 py-3 text-[#6B7A8D]">{formatDate(lead.createdAt)}</td>
                        <td className="px-4 py-3">
                          {lead.followUpDate ? (
                            <div className="space-y-2">
                              <div className="font-medium text-[#0F2137]">{formatDateOnly(lead.followUpDate)}</div>
                              <span
                                className={
                                  getLeadDueState(lead) === "overdue"
                                    ? "inline-flex rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700"
                                    : getLeadDueState(lead) === "today"
                                      ? "inline-flex rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700"
                                      : "inline-flex rounded-lg border border-gray-200 bg-[#F7F8FA] px-2 py-1 text-xs font-medium text-[#0F2137]"
                                }
                              >
                                {getLeadDueState(lead) === "overdue"
                                  ? "Ueberfaellig"
                                  : getLeadDueState(lead) === "today"
                                    ? "Heute faellig"
                                    : "Geplant"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#6B7A8D]">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#0F2137]">
                          {lead.name}
                          {lead.company && <span className="block text-xs font-normal text-[#6B7A8D]">{lead.company}</span>}
                        </td>
                        <td className="px-4 py-3">
                          <a href={`mailto:${lead.email}`} className="text-[#1D6FA4]">
                            {lead.email}
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          <a href={`tel:${lead.phone}`} className="text-[#1D6FA4]">
                            {lead.phone}
                          </a>
                        </td>
                        <td className="max-w-sm px-4 py-3 text-[#6B7A8D]">
                          <div>{lead.message || "Keine Nachricht"}</div>
                          {(lead.regionLabel || lead.serviceLabel) && (
                            <div className="mt-2 text-xs">
                              {[lead.regionLabel, lead.serviceLabel].filter(Boolean).join(" / ")}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={lead.status}
                            onChange={(event) => void handleStatusChange(lead.id, event.target.value as LeadStatus)}
                            className="rounded-lg border border-gray-200 px-2 py-1 text-sm"
                          >
                            {leadStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
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
            {(cmsPages.length > 0 ? cmsPages : [{
              slug: "home" as const,
              title: cmsPageDefinitions.home.title,
              path: cmsPageDefinitions.home.path,
              updatedAt: "",
            }]).map((page) => (
              <div key={page.slug} className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-[#0F2137]">{page.title}</h3>
                    <p className="mt-1 text-sm text-[#6B7A8D]">{page.path}</p>
                    <p className="mt-3 text-sm text-[#6B7A8D]">
                      {page.updatedAt ? `Zuletzt aktualisiert: ${formatDate(page.updatedAt)}` : "Noch nicht gespeichert."}
                    </p>
                  </div>
                  <span className="inline-flex rounded-lg border border-gray-200 bg-[#F7F8FA] px-2 py-1 text-xs font-medium text-[#0F2137]">
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
                    Vorschau oeffnen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentSection === "content" && (
          <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <label className="block text-sm font-medium text-[#0F2137]">
                  Seite
                  <select
                    value={selectedCmsSlug}
                    onChange={(event) => setSelectedCmsSlug(event.target.value as CmsPageSlug)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    {(cmsPages.length > 0 ? cmsPages : [{
                      slug: "home" as const,
                      title: cmsPageDefinitions.home.title,
                      path: cmsPageDefinitions.home.path,
                      updatedAt: "",
                    }]).map((page) => (
                      <option key={page.slug} value={page.slug}>
                        {page.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-sm font-medium text-[#0F2137]">Sektionen</p>
                <div className="mt-3 space-y-2">
                  {cmsSections.map((section) => (
                    <button
                      key={section.key}
                      type="button"
                      onClick={() => setSelectedCmsSection(section.key as CmsSectionKey)}
                      className={
                        selectedCmsSection === section.key
                          ? "w-full rounded-lg border border-[#0F2137] bg-[#0F2137] px-3 py-2 text-left text-sm font-medium text-white"
                          : "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm font-medium text-[#0F2137] hover:bg-gray-50"
                      }
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleCmsSave} className="rounded-lg border border-gray-200 bg-white p-5">
              <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[#0F2137]">{cmsDefinition.title}</h3>
                  <p className="text-sm text-[#6B7A8D]">{cmsSelectedSection.label} bearbeiten</p>
                </div>
                <div className="text-sm text-[#6B7A8D]">
                  {cmsPage?.updatedAt ? `Zuletzt gespeichert: ${formatDate(cmsPage.updatedAt)}` : "Noch keine Speicherung"}
                </div>
              </div>

              {loadingCms ? (
                <div className="py-10 text-center text-sm text-[#6B7A8D]">CMS-Inhalte werden geladen...</div>
              ) : (
                <div className="mt-5 space-y-4">
                  {selectedCmsSection === "hero" && (
                    <>
                      <label className="block text-sm font-medium text-[#0F2137]">
                        Hero-Titel
                        <input
                          value={cmsDraft.hero.title}
                          onChange={(event) => updateCmsField("hero", "title", event.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                      </label>

                      <label className="block text-sm font-medium text-[#0F2137]">
                        Hero-Akzenttitel
                        <input
                          value={cmsDraft.hero.accentTitle}
                          onChange={(event) => updateCmsField("hero", "accentTitle", event.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                      </label>

                      <label className="block text-sm font-medium text-[#0F2137]">
                        Hero-Untertitel
                        <textarea
                          value={cmsDraft.hero.subtitle}
                          onChange={(event) => updateCmsField("hero", "subtitle", event.target.value)}
                          rows={5}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                      </label>

                      <label className="block text-sm font-medium text-[#0F2137]">
                        Hero-Button-Text
                        <input
                          value={cmsDraft.hero.primaryButtonText}
                          onChange={(event) => updateCmsField("hero", "primaryButtonText", event.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                      </label>
                    </>
                  )}

                  {selectedCmsSection === "services" && (
                    <>
                      <label className="block text-sm font-medium text-[#0F2137]">
                        Bereichstitel
                        <input
                          value={cmsDraft.services.title}
                          onChange={(event) => updateCmsField("services", "title", event.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                      </label>

                      <label className="block text-sm font-medium text-[#0F2137]">
                        Bereichsbeschreibung
                        <textarea
                          value={cmsDraft.services.subtitle}
                          onChange={(event) => updateCmsField("services", "subtitle", event.target.value)}
                          rows={5}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                      </label>

                      <label className="block text-sm font-medium text-[#0F2137]">
                        Button-Text
                        <input
                          value={cmsDraft.services.buttonText}
                          onChange={(event) => updateCmsField("services", "buttonText", event.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                      </label>
                    </>
                  )}

                  {selectedCmsSection === "usps" && (
                    <>
                      <label className="block text-sm font-medium text-[#0F2137]">
                        Bereichstitel
                        <input
                          value={cmsDraft.usps.title}
                          onChange={(event) => updateCmsField("usps", "title", event.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                      </label>

                      <label className="block text-sm font-medium text-[#0F2137]">
                        Bereichsbeschreibung
                        <textarea
                          value={cmsDraft.usps.subtitle}
                          onChange={(event) => updateCmsField("usps", "subtitle", event.target.value)}
                          rows={5}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                      </label>
                    </>
                  )}

                  {selectedCmsSection === "finalCta" && (
                    <>
                      <label className="block text-sm font-medium text-[#0F2137]">
                        CTA-Titel
                        <input
                          value={cmsDraft.finalCta.title}
                          onChange={(event) => updateCmsField("finalCta", "title", event.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                      </label>

                      <label className="block text-sm font-medium text-[#0F2137]">
                        CTA-Text
                        <textarea
                          value={cmsDraft.finalCta.body}
                          onChange={(event) => updateCmsField("finalCta", "body", event.target.value)}
                          rows={5}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                      </label>

                      <label className="block text-sm font-medium text-[#0F2137]">
                        CTA-Button-Text
                        <input
                          value={cmsDraft.finalCta.primaryButtonText}
                          onChange={(event) => updateCmsField("finalCta", "primaryButtonText", event.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                      </label>

                      <label className="block text-sm font-medium text-[#0F2137]">
                        SEO-Titel
                        <input
                          value={cmsDraft.finalCta.seoTitle}
                          onChange={(event) => updateCmsField("finalCta", "seoTitle", event.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                      </label>

                      <label className="block text-sm font-medium text-[#0F2137]">
                        SEO-Beschreibung
                        <textarea
                          value={cmsDraft.finalCta.seoDescription}
                          onChange={(event) => updateCmsField("finalCta", "seoDescription", event.target.value)}
                          rows={5}
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                      </label>
                    </>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setCmsDraft(createCmsDraft(cmsPage))}
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
        )}

        {currentSection === "preview" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block text-sm font-medium text-[#0F2137]">
                  Seite
                  <select
                    value={selectedCmsSlug}
                    onChange={(event) => setSelectedCmsSlug(event.target.value as CmsPageSlug)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    {(cmsPages.length > 0 ? cmsPages : [{
                      slug: "home" as const,
                      title: cmsPageDefinitions.home.title,
                      path: cmsPageDefinitions.home.path,
                      updatedAt: "",
                    }]).map((page) => (
                      <option key={page.slug} value={page.slug}>
                        {page.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium text-[#0F2137]">
                  Ansicht
                  <select
                    value={previewViewport}
                    onChange={(event) => setPreviewViewport(event.target.value as CmsPreviewViewport)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
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

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className={`overflow-hidden rounded-lg border border-gray-200 bg-[#F7F8FA] ${previewWidthClass}`}>
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
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="text-base font-semibold text-[#0F2137]">Passwort</h3>
              <p className="mt-2 text-sm text-[#6B7A8D]">Aktuelles Passwort pruefen und sicher aendern.</p>
              <button
                type="button"
                onClick={() => {
                  setActivePanel("change-password");
                  setError("");
                  setSuccessMessage("");
                }}
                className={`mt-4 ${secondaryButtonClass}`}
              >
                Passwort aendern
              </button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="text-base font-semibold text-[#0F2137]">Benutzer</h3>
              <p className="mt-2 text-sm text-[#6B7A8D]">
                {isAdmin ? "Benutzer ansehen und neue Zugaenge anlegen." : "Nur Admins duerfen Benutzer verwalten."}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (!isAdmin) {
                    setError("Nur Admins duerfen Benutzer verwalten.");
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

            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="text-base font-semibold text-[#0F2137]">Sitzung</h3>
              <p className="mt-2 text-sm text-[#6B7A8D]">Aktuelle Sitzung gueltig bis {formatDate(session.expiresAt)}.</p>
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
      </section>

      {activePanel && (
        <div className="fixed inset-0 z-40 flex justify-end bg-[#0F2137]/30">
          <div className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-[#0F2137]">{currentPanelTitle}</h2>
                <p className="text-sm text-[#6B7A8D]">
                  {activePanel === "lead-edit" && "Lead-Daten in PostgreSQL aktualisieren."}
                  {activePanel === "change-password" && "Aktuelles Passwort pruefen und sicher ersetzen."}
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
                className="rounded-lg border border-gray-200 p-2 text-[#0F2137] hover:bg-gray-50"
                aria-label="Panel schliessen"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-6">
              {activePanel === "lead-edit" && selectedLead && (
                <form onSubmit={handleLeadSave} className="space-y-4">
                  <label className="block text-sm font-medium text-[#0F2137]">
                    Name
                    <input
                      value={selectedLead.name}
                      onChange={(event) => setSelectedLead((current) => current ? { ...current, name: event.target.value } : current)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="block text-sm font-medium text-[#0F2137]">
                    E-Mail
                    <input
                      type="email"
                      value={selectedLead.email}
                      onChange={(event) => setSelectedLead((current) => current ? { ...current, email: event.target.value } : current)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="block text-sm font-medium text-[#0F2137]">
                    Telefon
                    <input
                      value={selectedLead.phone}
                      onChange={(event) => setSelectedLead((current) => current ? { ...current, phone: event.target.value } : current)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="block text-sm font-medium text-[#0F2137]">
                    Nachricht
                    <textarea
                      value={selectedLead.message}
                      onChange={(event) => setSelectedLead((current) => current ? { ...current, message: event.target.value } : current)}
                      rows={6}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="block text-sm font-medium text-[#0F2137]">
                    Interne Notiz
                    <textarea
                      value={selectedLead.internalNote}
                      onChange={(event) => setSelectedLead((current) => current ? { ...current, internalNote: event.target.value } : current)}
                      rows={5}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="block text-sm font-medium text-[#0F2137]">
                    Wiedervorlage
                    <input
                      type="date"
                      value={selectedLead.followUpDate}
                      onChange={(event) => setSelectedLead((current) => current ? { ...current, followUpDate: event.target.value } : current)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="block text-sm font-medium text-[#0F2137]">
                    Status
                    <select
                      value={selectedLead.status}
                      onChange={(event) => setSelectedLead((current) => current ? { ...current, status: event.target.value as LeadStatus } : current)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    >
                      {leadStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setActivePanel(null)} className={secondaryButtonClass}>
                      Schliessen
                    </button>
                    <button type="submit" disabled={submittingPanel} className={primaryButtonClass}>
                      {submittingPanel ? "Speichert..." : "Speichern"}
                    </button>
                  </div>
                </form>
              )}

              {activePanel === "change-password" && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <label className="block text-sm font-medium text-[#0F2137]">
                    Aktuelles Passwort
                    <input
                      type="password"
                      value={changePasswordForm.currentPassword}
                      onChange={(event) =>
                        setChangePasswordForm((current) => ({ ...current, currentPassword: event.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      autoComplete="current-password"
                    />
                  </label>

                  <label className="block text-sm font-medium text-[#0F2137]">
                    Neues Passwort
                    <input
                      type="password"
                      value={changePasswordForm.newPassword}
                      onChange={(event) =>
                        setChangePasswordForm((current) => ({ ...current, newPassword: event.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      autoComplete="new-password"
                    />
                  </label>

                  <label className="block text-sm font-medium text-[#0F2137]">
                    Neues Passwort wiederholen
                    <input
                      type="password"
                      value={changePasswordForm.confirmPassword}
                      onChange={(event) =>
                        setChangePasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
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
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="bg-gray-50 text-xs uppercase text-[#6B7A8D]">
                        <tr>
                          <th className="px-4 py-3">Benutzer</th>
                          <th className="px-4 py-3">Rolle</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Erstellt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-t border-gray-100">
                            <td className="px-4 py-3 font-medium text-[#0F2137]">{user.username}</td>
                            <td className="px-4 py-3 text-[#6B7A8D]">{user.role}</td>
                            <td className="px-4 py-3 text-[#6B7A8D]">{user.isActive ? "aktiv" : "inaktiv"}</td>
                            <td className="px-4 py-3 text-[#6B7A8D]">{formatDate(user.createdAt)}</td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-[#6B7A8D]">
                              Keine Benutzer vorhanden.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <form onSubmit={handleCreateUser} className="rounded-lg border border-gray-200 bg-[#F7F8FA] p-4">
                    <div className="mb-4 flex items-center gap-2">
                      <UserPlus size={18} className="text-[#1D6FA4]" />
                      <h3 className="text-base font-semibold text-[#0F2137]">Neuen Benutzer anlegen</h3>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="block text-sm font-medium text-[#0F2137]">
                        Benutzername
                        <input
                          value={userCreateForm.username}
                          onChange={(event) =>
                            setUserCreateForm((current) => ({ ...current, username: event.target.value }))
                          }
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                          autoComplete="off"
                        />
                      </label>

                      <label className="block text-sm font-medium text-[#0F2137]">
                        Passwort
                        <input
                          type="password"
                          value={userCreateForm.password}
                          onChange={(event) =>
                            setUserCreateForm((current) => ({ ...current, password: event.target.value }))
                          }
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                          autoComplete="new-password"
                        />
                      </label>

                      <label className="block text-sm font-medium text-[#0F2137]">
                        Rolle
                        <select
                          value={userCreateForm.role}
                          onChange={(event) =>
                            setUserCreateForm((current) => ({ ...current, role: event.target.value as AdminRole }))
                          }
                          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        >
                          {adminRoles.map((role) => (
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
