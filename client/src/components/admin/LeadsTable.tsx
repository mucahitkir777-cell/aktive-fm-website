import type { AdminLead } from "@shared/lead";
import type { LeadStatus } from "@shared/lead";
import {
  formatDate,
  formatDateOnly,
  getLeadDueState,
  getLeadDueStateBadgeClass,
  getLeadDueStateLabel,
  getLeadStatusLabel,
} from "./helpers";
import { secondaryButtonClass, tableCellClass, tableHeadClass, tableHeaderCellClass } from "./styles";

interface LeadsTableProps {
  leads: AdminLead[];
  filteredLeads: AdminLead[];
  loadingLeads: boolean;
  leadStatuses: LeadStatus[];
  onStatusChange: (id: string, status: LeadStatus) => void;
  onOpenLeadEditor: (lead: AdminLead) => void;
}

export default function LeadsTable({
  leads,
  filteredLeads,
  loadingLeads,
  leadStatuses,
  onStatusChange,
  onOpenLeadEditor,
}: LeadsTableProps) {
  return (
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
                  onChange={(event) => onStatusChange(lead.id, event.target.value as LeadStatus)}
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
                <button type="button" onClick={() => onOpenLeadEditor(lead)} className={secondaryButtonClass}>
                  Bearbeiten
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
