import type { FormEvent } from "react";
import type { LeadStatus } from "@shared/lead";
import type { LeadDraft } from "./types";
import { getLeadStatusLabel } from "./helpers";
import { fieldControlClass, fieldLabelClass, primaryButtonClass, secondaryButtonClass } from "./styles";

interface LeadDetailPanelProps {
  selectedLead: LeadDraft;
  leadStatuses: LeadStatus[];
  submitting: boolean;
  onSubmit: (event: FormEvent) => void;
  onClose: () => void;
  onChange: <K extends keyof LeadDraft>(key: K, value: LeadDraft[K]) => void;
}

export default function LeadDetailPanel({
  selectedLead,
  leadStatuses,
  submitting,
  onSubmit,
  onClose,
  onChange,
}: LeadDetailPanelProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className={fieldLabelClass}>
        Name
        <input
          value={selectedLead.name}
          onChange={(event) => onChange("name", event.target.value)}
          className={fieldControlClass}
        />
      </label>

      <label className={fieldLabelClass}>
        E-Mail
        <input
          type="email"
          value={selectedLead.email}
          onChange={(event) => onChange("email", event.target.value)}
          className={fieldControlClass}
        />
      </label>

      <label className={fieldLabelClass}>
        Telefon
        <input
          value={selectedLead.phone}
          onChange={(event) => onChange("phone", event.target.value)}
          className={fieldControlClass}
        />
      </label>

      <label className={fieldLabelClass}>
        Nachricht
        <textarea
          value={selectedLead.message}
          onChange={(event) => onChange("message", event.target.value)}
          rows={6}
          className={fieldControlClass}
        />
      </label>

      <label className={fieldLabelClass}>
        Interne Notiz
        <textarea
          value={selectedLead.internalNote}
          onChange={(event) => onChange("internalNote", event.target.value)}
          rows={5}
          className={fieldControlClass}
        />
      </label>

      <label className={fieldLabelClass}>
        Wiedervorlage
        <input
          type="date"
          value={selectedLead.followUpDate}
          onChange={(event) => onChange("followUpDate", event.target.value)}
          className={fieldControlClass}
        />
      </label>

      <label className={fieldLabelClass}>
        Status
        <select
          value={selectedLead.status}
          onChange={(event) => onChange("status", event.target.value as LeadStatus)}
          className={fieldControlClass}
        >
          {leadStatuses.map((status) => (
            <option key={status} value={status}>
              {getLeadStatusLabel(status)}
            </option>
          ))}
        </select>
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className={secondaryButtonClass}>
          Schließen
        </button>
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting ? "Speichert..." : "Speichern"}
        </button>
      </div>
    </form>
  );
}
