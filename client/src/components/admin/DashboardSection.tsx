import type { AdminDashboardStats } from "@shared/admin";
import type { LeadStatus } from "@shared/lead";
import AdminEmptyState from "./AdminEmptyState";
import AdminStatusBadge from "./AdminStatusBadge";
import { formatDate, formatDateOnly, getLeadStatusLabel } from "./helpers";
import { secondaryButtonClass, surfaceClass } from "./styles";

interface DashboardSectionProps {
  stats: AdminDashboardStats | null;
  loadingStats: boolean;
  leadStatuses: LeadStatus[];
  onOpenLeadEditorById: (id: string) => void;
  onOpenLeadsList: () => void;
}

export default function DashboardSection({
  stats,
  loadingStats,
  leadStatuses,
  onOpenLeadEditorById,
  onOpenLeadsList,
}: DashboardSectionProps) {
  return (
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
            <button type="button" onClick={onOpenLeadsList} className={secondaryButtonClass}>
              Leadliste
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {loadingStats && !stats && <AdminEmptyState message="Dashboard wird geladen..." />}

            {!loadingStats && (stats?.newLeadsToday.length ?? 0) === 0 && (
              <AdminEmptyState message="Heute sind noch keine neuen Leads eingegangen." />
            )}

            {(stats?.newLeadsToday ?? []).map((lead) => (
              <button
                key={lead.id}
                type="button"
                onClick={() => onOpenLeadEditorById(lead.id)}
                className="block w-full rounded-lg border border-slate-100 bg-slate-50 p-4 text-left transition-colors hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
                    <p className="mt-1 text-sm text-slate-500">Eingegangen am {formatDate(lead.createdAt)}</p>
                  </div>
                  <AdminStatusBadge status={lead.status} />
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
            <button type="button" onClick={onOpenLeadsList} className={secondaryButtonClass}>
              Leadliste
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {loadingStats && !stats && <AdminEmptyState message="Dashboard wird geladen..." />}

            {!loadingStats && (stats?.dueTodayLeads.length ?? 0) === 0 && (
              <AdminEmptyState message="Keine Leads für heute fällig." />
            )}

            {(stats?.dueTodayLeads ?? []).map((lead) => (
              <button
                key={lead.id}
                type="button"
                onClick={() => onOpenLeadEditorById(lead.id)}
                className="block w-full rounded-lg border border-slate-100 bg-slate-50 p-4 text-left transition-colors hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
                    <p className="mt-1 text-sm text-slate-500">Fällig am {formatDateOnly(lead.followUpDate)}</p>
                  </div>
                  <AdminStatusBadge status={lead.status} />
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
            <button type="button" onClick={onOpenLeadsList} className={secondaryButtonClass}>
              Leadliste
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {loadingStats && !stats && <AdminEmptyState message="Dashboard wird geladen..." />}

            {!loadingStats && (stats?.overdueLeads.length ?? 0) === 0 && (
              <AdminEmptyState message="Keine überfälligen Leads vorhanden." />
            )}

            {(stats?.overdueLeads ?? []).map((lead) => (
              <button
                key={lead.id}
                type="button"
                onClick={() => onOpenLeadEditorById(lead.id)}
                className="block w-full rounded-lg border border-slate-100 bg-slate-50 p-4 text-left transition-colors hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
                    <p className="mt-1 text-sm text-slate-500">Fällig am {formatDateOnly(lead.followUpDate)}</p>
                  </div>
                  <AdminStatusBadge status={lead.status} />
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
  );
}
