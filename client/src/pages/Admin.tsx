import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  BarChart3,
  KeyRound,
  LayoutDashboard,
  LogOut,
  PencilLine,
  RefreshCw,
  Settings,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useLocation } from "wouter";
import type { AdminDashboardStats, AdminRole, AdminSessionUser, AdminUser } from "@shared/admin";
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
type AdminSection = "dashboard" | "leads" | "settings";

interface LeadDraft {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
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
    status: lead.status,
  };
}

export default function Admin() {
  const [location, setLocation] = useLocation();
  const [session, setSession] = useState<SessionState | null>(getStoredSession);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [submittingLogin, setSubmittingLogin] = useState(false);
  const [submittingPanel, setSubmittingPanel] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
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
    if (location === "/admin/leads") return "leads";
    if (location === "/admin/settings") return "settings";
    return "dashboard";
  }, [location]);

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

  useEffect(() => {
    if (!session) {
      return;
    }

    void loadLeads(session);
    void loadStats(session);
  }, [session]);

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
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm text-[#6B7A8D]">Gesamtleads</p>
                <p className="mt-2 text-3xl font-bold text-[#0F2137]">
                  {loadingStats && !stats ? "..." : stats?.leads.total ?? 0}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm text-[#6B7A8D]">Neue Leads heute</p>
                <p className="mt-2 text-3xl font-bold text-[#0F2137]">
                  {loadingStats && !stats ? "..." : stats?.leads.today ?? 0}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm text-[#6B7A8D]">Leads diese Woche</p>
                <p className="mt-2 text-3xl font-bold text-[#0F2137]">
                  {loadingStats && !stats ? "..." : stats?.leads.thisWeek ?? 0}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm text-[#6B7A8D]">Seitenaufrufe heute</p>
                <p className="mt-2 text-3xl font-bold text-[#0F2137]">
                  {loadingStats && !stats ? "..." : stats?.pageViews.today ?? 0}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm text-[#6B7A8D]">Seitenaufrufe 7 Tage</p>
                <p className="mt-2 text-3xl font-bold text-[#0F2137]">
                  {loadingStats && !stats ? "..." : stats?.pageViews.last7Days ?? 0}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="text-base font-semibold text-[#0F2137]">Leads nach Status</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {leadStatuses.map((status) => (
                  <div key={status} className="rounded-lg border border-gray-100 bg-[#F7F8FA] p-4">
                    <p className="text-xs uppercase tracking-wide text-[#6B7A8D]">{status}</p>
                    <p className="mt-2 text-2xl font-semibold text-[#0F2137]">
                      {loadingStats && !stats ? "..." : stats?.leads.byStatus[status] ?? 0}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentSection === "leads" && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-[1060px] border-collapse text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-[#6B7A8D]">
                <tr>
                  <th className="px-4 py-3">Datum</th>
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
                    <td colSpan={7} className="px-4 py-8 text-center text-[#6B7A8D]">
                      Leads werden geladen...
                    </td>
                  </tr>
                )}

                {!loadingLeads && leads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[#6B7A8D]">
                      Noch keine Leads vorhanden.
                    </td>
                  </tr>
                )}

                {!loadingLeads &&
                  leads.map((lead) => (
                    <tr key={lead.id} className="border-t border-gray-100 align-top">
                      <td className="px-4 py-3 text-[#6B7A8D]">{formatDate(lead.createdAt)}</td>
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
