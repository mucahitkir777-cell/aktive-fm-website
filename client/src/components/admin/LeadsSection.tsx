import type { AdminLead, LeadStatus } from "@shared/lead";
import type { LeadFilterValue, LeadSortValue } from "./types";
import LeadsTable from "./LeadsTable";
import { fieldControlClass, fieldLabelClass, infoPanelClass, surfaceClass } from "./styles";

interface LeadsSectionProps {
  leadFilter: LeadFilterValue;
  leadSearch: string;
  leadSort: LeadSortValue;
  filteredLeads: AdminLead[];
  leads: AdminLead[];
  loadingLeads: boolean;
  leadStatuses: LeadStatus[];
  onFilterChange: (value: LeadFilterValue) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: LeadSortValue) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onOpenLeadEditor: (lead: AdminLead) => void;
}

export default function LeadsSection({
  leadFilter,
  leadSearch,
  leadSort,
  filteredLeads,
  leads,
  loadingLeads,
  leadStatuses,
  onFilterChange,
  onSearchChange,
  onSortChange,
  onStatusChange,
  onOpenLeadEditor,
}: LeadsSectionProps) {
  return (
    <div className="space-y-4">
      <div className={`${surfaceClass} p-4`}>
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-[190px_minmax(0,1fr)_190px_auto]">
          <label className={fieldLabelClass}>
            Filter
            <select
              value={leadFilter}
              onChange={(event) => onFilterChange(event.target.value as LeadFilterValue)}
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
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Nach Name, E-Mail oder Telefon suchen"
              className={fieldControlClass}
            />
          </label>

          <label className={fieldLabelClass}>
            Sortierung
            <select
              value={leadSort}
              onChange={(event) => onSortChange(event.target.value as LeadSortValue)}
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
              {filteredLeads.length} von {leads.length} Leads
            </div>
          </div>
        </div>
      </div>

      <div className={`${surfaceClass} overflow-x-auto`}>
        <LeadsTable
          leads={leads}
          filteredLeads={filteredLeads}
          loadingLeads={loadingLeads}
          leadStatuses={leadStatuses}
          onStatusChange={onStatusChange}
          onOpenLeadEditor={onOpenLeadEditor}
        />
      </div>
    </div>
  );
}
