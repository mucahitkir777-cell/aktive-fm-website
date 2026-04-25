import type { AdminDashboardStats } from "@shared/admin";
import type { LeadStatus } from "@shared/lead";
import { AlarmClock, BarChart3, CalendarDays, Clock3, Inbox, ListChecks, UserPlus } from "lucide-react";
import AdminEmptyState from "./AdminEmptyState";
import AdminStatusBadge from "./AdminStatusBadge";
import { formatDate, formatDateOnly, getLeadStatusLabel } from "./helpers";
import { secondaryButtonClass, subtleSurfaceClass, surfacePanelClass } from "./styles";

interface DashboardSectionProps {
  stats: AdminDashboardStats | null;
  loadingStats: boolean;
  leadStatuses: LeadStatus[];
  onOpenLeadEditorById: (id: string) => void;
  onOpenLeadsList: () => void;
}

const statCards = [
  { key: "total", label: "Gesamtleads", icon: Inbox, tone: "text-slate-700 bg-slate-100", getValue: (stats: AdminDashboardStats) => stats.leads.total },
  { key: "today", label: "Neue Leads heute", icon: UserPlus, tone: "text-[#1D6FA4] bg-[#1D6FA4]/10", getValue: (stats: AdminDashboardStats) => stats.leads.today },
  { key: "week", label: "Leads diese Woche", icon: CalendarDays, tone: "text-[#1D6FA4] bg-[#1D6FA4]/10", getValue: (stats: AdminDashboardStats) => stats.leads.thisWeek },
  { key: "viewsToday", label: "Seitenaufrufe heute", icon: BarChart3, tone: "text-slate-700 bg-slate-100", getValue: (stats: AdminDashboardStats) => stats.pageViews.today },
  { key: "views7", label: "Seitenaufrufe 7 Tage", icon: ListChecks, tone: "text-slate-700 bg-slate-100", getValue: (stats: AdminDashboardStats) => stats.pageViews.last7Days },
  { key: "dueToday", label: "Heute fällig", icon: Clock3, tone: "text-amber-700 bg-amber-100", getValue: (stats: AdminDashboardStats) => stats.leads.dueToday },
  { key: "overdue", label: "Überfällig", icon: AlarmClock, tone: "text-red-700 bg-red-100", getValue: (stats: AdminDashboardStats) => stats.leads.overdue },
] as const;

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
        {statCards.map((card) => (
          <div key={card.key} className={`${surfacePanelClass} relative overflow-hidden`}>
            <div className={`absolute right-4 top-4 rounded-lg p-2 ${card.tone}`}>
              <card.icon size={16} />
            </div>
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {loadingStats && !stats ? "..." : stats ? card.getValue(stats) : 0}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className={surfacePanelClass}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
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
                className={`${subtleSurfaceClass} block w-full text-left transition-colors hover:border-slate-300 hover:bg-white`}
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

        <div className={surfacePanelClass}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
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
                className={`${subtleSurfaceClass} block w-full text-left transition-colors hover:border-amber-300 hover:bg-white`}
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

        <div className={surfacePanelClass}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
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
                className={`${subtleSurfaceClass} block w-full text-left transition-colors hover:border-red-300 hover:bg-white`}
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

      <div className={surfacePanelClass}>
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-base font-semibold text-slate-900">Leads nach Status</h3>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-5">
          {leadStatuses.map((status) => {
            const count = stats?.leads.byStatus[status] ?? 0;
            const total = stats?.leads.total ?? 0;
            const width = total > 0 ? Math.max((count / total) * 100, count > 0 ? 8 : 0) : 0;

            return (
              <div key={status} className={subtleSurfaceClass}>
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
