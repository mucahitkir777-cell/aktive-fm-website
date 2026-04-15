import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { AdminLead, LeadStatus } from "@shared/lead";

const ADMIN_TOKEN_KEY = "proclean_admin_token";
const leadStatuses: LeadStatus[] = ["new", "contacted", "qualified", "done", "archived"];

interface LeadListResponse {
  success: boolean;
  leads?: AdminLead[];
  message?: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStoredToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
}

function storeToken(token: string) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

function clearToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export default function Admin() {
  const [token, setToken] = useState(getStoredToken);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasToken = Boolean(token);
  const leadCount = useMemo(() => leads.length, [leads.length]);

  async function loadLeads(activeToken = token) {
    if (!activeToken) return;

    setLoading(true);
    setError("");

    const response = await fetch("/api/leads", {
      headers: {
        Authorization: `Bearer ${activeToken}`,
      },
    });
    const result = (await response.json().catch(() => null)) as LeadListResponse | null;

    setLoading(false);

    if (response.status === 401) {
      clearToken();
      setToken("");
      setLeads([]);
      setError("Bitte erneut anmelden.");
      return;
    }

    if (!response.ok || !result?.success) {
      setError(result?.message ?? "Leads konnten nicht geladen werden.");
      return;
    }

    setLeads(result.leads ?? []);
  }

  useEffect(() => {
    if (token) {
      void loadLeads(token);
    }
  }, [token]);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const result = (await response.json().catch(() => null)) as LoginResponse | null;

    setLoading(false);

    if (!response.ok || !result?.success || !result.token) {
      setError(result?.message ?? "Login fehlgeschlagen.");
      return;
    }

    storeToken(result.token);
    setToken(result.token);
    setPassword("");
  }

  async function updateStatus(id: string, status: LeadStatus) {
    setError("");

    const response = await fetch(`/api/leads/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    const result = (await response.json().catch(() => null)) as { success: boolean; lead?: AdminLead; message?: string } | null;

    if (!response.ok || !result?.success || !result.lead) {
      setError(result?.message ?? "Status konnte nicht geaendert werden.");
      return;
    }

    setLeads((current) => current.map((lead) => (lead.id === id ? result.lead! : lead)));
  }

  function handleLogout() {
    clearToken();
    setToken("");
    setLeads([]);
  }

  if (!hasToken) {
    return (
      <main className="min-h-screen bg-[#F7F8FA] px-4 py-10">
        <section className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-[#0F2137]">Admin Login</h1>
          <p className="mb-6 text-sm text-[#6B7A8D]">Melden Sie sich an, um eingegangene Leads zu sehen.</p>

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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#1D6FA4] px-4 py-2 text-sm font-semibold text-white disabled:bg-gray-400"
            >
              {loading ? "Anmeldung laeuft..." : "Einloggen"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-4 py-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0F2137]">Lead Manager</h1>
            <p className="text-sm text-[#6B7A8D]">{leadCount} Leads gespeichert</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void loadLeads()}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#0F2137]"
            >
              Aktualisieren
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-[#0F2137] px-4 py-2 text-sm font-semibold text-white"
            >
              Abmelden
            </button>
          </div>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full min-w-[920px] border-collapse text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-[#6B7A8D]">
              <tr>
                <th className="px-4 py-3">Datum</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">E-Mail</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Nachricht</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#6B7A8D]">
                    Leads werden geladen...
                  </td>
                </tr>
              )}

              {!loading && leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#6B7A8D]">
                    Noch keine Leads vorhanden.
                  </td>
                </tr>
              )}

              {!loading &&
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
                        onChange={(event) => void updateStatus(lead.id, event.target.value as LeadStatus)}
                        className="rounded-lg border border-gray-200 px-2 py-1 text-sm"
                      >
                        {leadStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
