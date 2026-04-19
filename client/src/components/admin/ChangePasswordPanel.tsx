import type { FormEvent } from "react";
import { fieldControlClass, fieldLabelClass, primaryButtonClass, secondaryButtonClass } from "./styles";

interface ChangePasswordFormValue {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordPanelProps {
  formValue: ChangePasswordFormValue;
  submitting: boolean;
  onSubmit: (event: FormEvent) => void;
  onClose: () => void;
  onChange: <K extends keyof ChangePasswordFormValue>(key: K, value: ChangePasswordFormValue[K]) => void;
}

export default function ChangePasswordPanel({
  formValue,
  submitting,
  onSubmit,
  onClose,
  onChange,
}: ChangePasswordPanelProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className={fieldLabelClass}>
        Aktuelles Passwort
        <input
          type="password"
          value={formValue.currentPassword}
          onChange={(event) => onChange("currentPassword", event.target.value)}
          className={fieldControlClass}
          autoComplete="current-password"
        />
      </label>

      <label className={fieldLabelClass}>
        Neues Passwort
        <input
          type="password"
          value={formValue.newPassword}
          onChange={(event) => onChange("newPassword", event.target.value)}
          className={fieldControlClass}
          autoComplete="new-password"
        />
      </label>

      <label className={fieldLabelClass}>
        Neues Passwort wiederholen
        <input
          type="password"
          value={formValue.confirmPassword}
          onChange={(event) => onChange("confirmPassword", event.target.value)}
          className={fieldControlClass}
          autoComplete="new-password"
        />
      </label>

      <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
        <button type="button" onClick={onClose} className={secondaryButtonClass}>
          Abbrechen
        </button>
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting ? "Speichert..." : "Passwort aktualisieren"}
        </button>
      </div>
    </form>
  );
}
