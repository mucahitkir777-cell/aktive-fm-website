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
import {
  dangerButtonClass,
  fieldControlClass,
  secondaryButtonClass,
  tableCellClass,
  tableHeadClass,
  tableHeaderCellClass,
  tableRowClass,
} from "./styles";

interface LeadsTableProps {
  leads: AdminLead[];
  filteredLeads: AdminLead[];
  loadingLeads: boolean;
  leadStatuses: LeadStatus[];
  selectedLeadIds: Set<string>;
  deletingLeads: boolean;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onOpenLeadEditor: (lead: AdminLead) => void;
  onToggleLeadSelection: (id: string) => void;
  onToggleAllVisibleLeads: () => void;
  onDeleteLead: (id: string) => void;
}

export default function LeadsTable({
  leads,
  filteredLeads,
  loadingLeads,
  leadStatuses,
  selectedLeadIds,
  deletingLeads,
  onStatusChange,
  onOpenLeadEditor,
  onToggleLeadSelection,
  onToggleAllVisibleLeads,
  onDeleteLead,
}: LeadsTableProps) {
  const allVisibleSelected = filteredLeads.length > 0 && filteredLeads.every((lead) => selectedLeadIds.has(lead.id));
  const someVisibleSelected = filteredLeads.some((lead) => selectedLeadIds.has(lead.id));

  return (
    <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
      <thead className={`${tableHeadClass} sticky top-0 z-10`}>
        <tr>
          <th className={`${tableHeaderCellClass} w-12`}>
            <input
              type="checkbox"
              aria-label="Alle sichtbaren Leads auswählen"
              aria-checked={allVisibleSelected ? "true" : someVisibleSelected ? "mixed" : "false"}
              checked={allVisibleSelected}
              onChange={onToggleAllVisibleLeads}
              disabled={filteredLeads.length === 0 || loadingLeads || deletingLeads}
              className="h-4 w-4 rounded border-slate-300 text-[#1D6FA4] focus:ring-[#1D6FA4]"
            />
          </th>
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
            <td colSpan={9} className="px-5 py-10 text-center text-sm text-slate-500">
              Leads werden geladen...
            </td>
          </tr>
        )}

        {!loadingLeads && leads.length === 0 && (
          <tr>
            <td colSpan={9} className="px-5 py-10 text-center text-sm text-slate-500">
              Noch keine Leads vorhanden.
            </td>
          </tr>
        )}

        {!loadingLeads && leads.length > 0 && filteredLeads.length === 0 && (
          <tr>
            <td colSpan={9} className="px-5 py-10 text-center text-sm text-slate-500">
              Keine Leads für die aktuelle Auswahl gefunden.
            </td>
          </tr>
        )}

        {!loadingLeads &&
          filteredLeads.map((lead) => {
            const dueState = getLeadDueState(lead);

            return (
              <tr key={lead.id} className={`${tableRowClass} odd:bg-white even:bg-slate-50/50`}>
                <td className={tableCellClass}>
                  <input
                    type="checkbox"
                    aria-label={`Lead ${lead.name} auswählen`}
                    checked={selectedLeadIds.has(lead.id)}
                    onChange={() => onToggleLeadSelection(lead.id)}
                    disabled={deletingLeads}
                    className="h-4 w-4 rounded border-slate-300 text-[#1D6FA4] focus:ring-[#1D6FA4]"
                  />
                </td>
                <td className={tableCellClass}>{formatDate(lead.createdAt)}</td>
                <td className={tableCellClass}>
                  {lead.followUpDate ? (
                    <div className="space-y-2">
                      <div className="font-medium text-slate-900">{formatDateOnly(lead.followUpDate)}</div>
                      <span className={getLeadDueStateBadgeClass(dueState)}>
                        {getLeadDueStateLabel(dueState)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </td>
                <td className={`${tableCellClass} font-medium text-slate-900`}>
                  {lead.name}
                  {lead.company && <span className="mt-1 block text-xs font-normal text-slate-500">{lead.company}</span>}
                </td>
                <td className={tableCellClass}>
                  <a href={`mailto:${lead.email}`} className="font-medium text-[#1D6FA4] hover:underline">
                    {lead.email}
                  </a>
                </td>
                <td className={tableCellClass}>
                  <a href={`tel:${lead.phone}`} className="font-medium text-[#1D6FA4] hover:underline">
                    {lead.phone}
                  </a>
                </td>
                <td className={`${tableCellClass} max-w-[20rem] text-slate-500`}>
                  <div>{lead.message || "Keine Nachricht"}</div>
                  {(lead.regionLabel || lead.serviceLabel) && (
                    <div className="mt-2 text-xs">
                      {[lead.regionLabel, lead.serviceLabel].filter(Boolean).join(" / ")}
                    </div>
                  )}
                </td>
                <td className={tableCellClass}>
                  <div className="space-y-2">
                    <span className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {getLeadStatusLabel(lead.status)}
                    </span>
                    <select
                      value={lead.status}
                      onChange={(event) => onStatusChange(lead.id, event.target.value as LeadStatus)}
                      className={`${fieldControlClass} mt-0 min-w-[170px] px-3 py-2`}
                    >
                      {leadStatuses.map((status) => (
                        <option key={status} value={status}>
                          {getLeadStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className={tableCellClass}>
                  <div className="flex flex-col gap-2">
                    <button type="button" onClick={() => onOpenLeadEditor(lead)} className={secondaryButtonClass}>
                      Bearbeiten
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteLead(lead.id)}
                      disabled={deletingLeads}
                      className={dangerButtonClass}
                    >
                      Löschen
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
