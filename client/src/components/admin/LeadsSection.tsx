import type { AdminLead, LeadStatus } from "@shared/lead";
import type { LeadFilterValue, LeadSortValue } from "./types";
import LeadsTable from "./LeadsTable";
import {
  dangerButtonClass,
  fieldControlClass,
  fieldLabelClass,
  infoPanelClass,
  secondaryButtonClass,
  surfacePanelClass,
  tableWrapperClass,
} from "./styles";

interface LeadsSectionProps {
  leadFilter: LeadFilterValue;
  leadSearch: string;
  leadSort: LeadSortValue;
  filteredLeads: AdminLead[];
  leads: AdminLead[];
  loadingLeads: boolean;
  leadStatuses: LeadStatus[];
  selectedLeadIds: Set<string>;
  selectedLeadCount: number;
  deletingLeads: boolean;
  onFilterChange: (value: LeadFilterValue) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: LeadSortValue) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onOpenLeadEditor: (lead: AdminLead) => void;
  onToggleLeadSelection: (id: string) => void;
  onToggleAllVisibleLeads: () => void;
  onClearLeadSelection: () => void;
  onDeleteLead: (id: string) => void;
  onDeleteSelectedLeads: () => void;
}

export default function LeadsSection({
  leadFilter,
  leadSearch,
  leadSort,
  filteredLeads,
  leads,
  loadingLeads,
  leadStatuses,
  selectedLeadIds,
  selectedLeadCount,
  deletingLeads,
  onFilterChange,
  onSearchChange,
  onSortChange,
  onStatusChange,
  onOpenLeadEditor,
  onToggleLeadSelection,
  onToggleAllVisibleLeads,
  onClearLeadSelection,
  onDeleteLead,
  onDeleteSelectedLeads,
}: LeadsSectionProps) {
  return (
    <div className="space-y-4">
      <div className={surfacePanelClass}>
        <div className="grid gap-4 xl:grid-cols-[190px_minmax(0,1fr)_190px_auto] xl:items-end">
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
            <div className={`${infoPanelClass} min-w-[170px] text-center font-medium`}>
              {filteredLeads.length} von {leads.length} Leads
            </div>
          </div>
        </div>
      </div>

      {selectedLeadCount > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm font-semibold text-red-800">
            {selectedLeadCount} Lead{selectedLeadCount === 1 ? "" : "s"} ausgewählt
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onDeleteSelectedLeads}
              disabled={deletingLeads}
              className={dangerButtonClass}
            >
              Auswahl löschen
            </button>
            <button
              type="button"
              onClick={onClearLeadSelection}
              disabled={deletingLeads}
              className={secondaryButtonClass}
            >
              Auswahl aufheben
            </button>
          </div>
        </div>
      )}

      <div className={tableWrapperClass}>
        <LeadsTable
          leads={leads}
          filteredLeads={filteredLeads}
          loadingLeads={loadingLeads}
          leadStatuses={leadStatuses}
          selectedLeadIds={selectedLeadIds}
          deletingLeads={deletingLeads}
          onStatusChange={onStatusChange}
          onOpenLeadEditor={onOpenLeadEditor}
          onToggleLeadSelection={onToggleLeadSelection}
          onToggleAllVisibleLeads={onToggleAllVisibleLeads}
          onDeleteLead={onDeleteLead}
        />
      </div>
    </div>
  );
}
