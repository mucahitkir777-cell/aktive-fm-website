import type { FormEvent } from "react";
import type { SiteStatus } from "./types";
import { infoPanelClass, primaryButtonClass, secondaryButtonClass, surfaceClass } from "./styles";

interface SettingsSectionProps {
  isAdmin: boolean;
  canAccessCmsSection: boolean;
  siteStatus: SiteStatus;
  siteStatusLoading: boolean;
  siteStatusSaving: boolean;
  sessionExpiresAtLabel: string;
  onOpenChangePassword: () => void;
  onOpenUsers: () => void;
  onLogout: () => void;
  onSetSiteStatus: (status: SiteStatus) => void;
  onSaveSiteStatus: (event: FormEvent) => void;
  onRefreshSiteStatus: () => void;
}

export default function SettingsSection({
  isAdmin,
  canAccessCmsSection,
  siteStatus,
  siteStatusLoading,
  siteStatusSaving,
  sessionExpiresAtLabel,
  onOpenChangePassword,
  onOpenUsers,
  onLogout,
  onSetSiteStatus,
  onSaveSiteStatus,
  onRefreshSiteStatus,
}: SettingsSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={`${surfaceClass} p-5`}>
        <h3 className="text-base font-semibold text-slate-900">Passwort</h3>
        <p className="mt-2 text-sm text-slate-500">Aktuelles Passwort prüfen und sicher ändern.</p>
        <button type="button" onClick={onOpenChangePassword} className={`mt-4 ${secondaryButtonClass}`}>
          Passwort ändern
        </button>
      </div>

      <div className={`${surfaceClass} p-5`}>
        <h3 className="text-base font-semibold text-slate-900">Benutzer</h3>
        <p className="mt-2 text-sm text-slate-500">
          {isAdmin ? "Benutzer ansehen und neue Zugänge anlegen." : "Nur Admins dürfen Benutzer verwalten."}
        </p>
        <button type="button" onClick={onOpenUsers} className={`mt-4 ${secondaryButtonClass}`} disabled={!isAdmin}>
          Benutzer verwalten
        </button>
      </div>

      <div className={`${surfaceClass} p-5`}>
        <h3 className="text-base font-semibold text-slate-900">Website Status</h3>
        <p className="mt-2 text-sm text-slate-500">
          Besucher sehen bei aktivem Wartungsmodus die Wartungsseite. Der Admin-Bereich bleibt erreichbar.
        </p>
        <form onSubmit={onSaveSiteStatus} className="mt-4 space-y-4">
          <div className="space-y-3 text-sm text-slate-900">
            <label className={`${infoPanelClass} flex items-center`}>
              <input
                type="radio"
                name="siteStatus"
                value="live"
                checked={siteStatus === "live"}
                onChange={() => onSetSiteStatus("live")}
                disabled={!canAccessCmsSection}
              />
              <span className="ml-3 font-medium">Live</span>
            </label>
            <label className={`${infoPanelClass} flex items-center`}>
              <input
                type="radio"
                name="siteStatus"
                value="maintenance"
                checked={siteStatus === "maintenance"}
                onChange={() => onSetSiteStatus("maintenance")}
                disabled={!canAccessCmsSection}
              />
              <span className="ml-3 font-medium">Wartung</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={!canAccessCmsSection || siteStatusSaving || siteStatusLoading}
              className={primaryButtonClass}
            >
              {siteStatusSaving ? "Speichert..." : "Status speichern"}
            </button>
            <button
              type="button"
              onClick={onRefreshSiteStatus}
              disabled={!canAccessCmsSection || siteStatusLoading}
              className={secondaryButtonClass}
            >
              {siteStatusLoading ? "Lädt..." : "Aktualisieren"}
            </button>
          </div>
        </form>
      </div>

      <div className={`${surfaceClass} p-5`}>
        <h3 className="text-base font-semibold text-slate-900">Sitzung</h3>
        <p className="mt-2 text-sm text-slate-500">Aktuelle Sitzung gültig bis {sessionExpiresAtLabel}.</p>
        <button type="button" onClick={onLogout} className={`mt-4 ${secondaryButtonClass}`}>
          Logout
        </button>
      </div>
    </div>
  );
}
