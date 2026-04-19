import { KeyRound, LogOut, RefreshCw, Settings, Users } from "lucide-react";
import type { RefObject } from "react";
import {
  helperTextClass,
  menuItemClass,
  menuPopupClass,
  secondaryButtonClass,
  surfaceClass,
} from "./styles";
import type { AdminSectionMeta } from "./types";

interface AdminHeaderProps {
  sectionMeta: AdminSectionMeta;
  username: string;
  settingsOpen: boolean;
  settingsRef: RefObject<HTMLDivElement | null>;
  isAdmin: boolean;
  onToggleSettings: () => void;
  onRefresh: () => void;
  onOpenChangePassword: () => void;
  onOpenUsers: () => void;
  onLogout: () => void;
}

export default function AdminHeader({
  sectionMeta,
  username,
  settingsOpen,
  settingsRef,
  isAdmin,
  onToggleSettings,
  onRefresh,
  onOpenChangePassword,
  onOpenUsers,
  onLogout,
}: AdminHeaderProps) {
  return (
    <div className={`${surfaceClass} p-5 md:p-6`}>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Adminbereich</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{sectionMeta.title}</h1>
          <p className={`mt-2 max-w-2xl ${helperTextClass}`}>{sectionMeta.description}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Eingeloggt als {username}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onRefresh} className={secondaryButtonClass}>
            <RefreshCw size={16} />
            Aktualisieren
          </button>

          <div ref={settingsRef} className="relative">
            <button
              type="button"
              onClick={onToggleSettings}
              className={secondaryButtonClass}
              aria-label="Einstellungen"
            >
              <Settings size={16} />
              Einstellungen
            </button>

            {settingsOpen && (
              <div className={menuPopupClass}>
                <button
                  type="button"
                  onClick={onOpenChangePassword}
                  className={menuItemClass}
                >
                  <KeyRound size={16} />
                  Passwort ändern
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={onOpenUsers}
                    className={menuItemClass}
                  >
                    <Users size={16} />
                    Benutzer verwalten
                  </button>
                )}

                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-700 transition-colors hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
