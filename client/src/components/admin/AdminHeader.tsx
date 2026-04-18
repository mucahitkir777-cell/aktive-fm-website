import { KeyRound, LogOut, RefreshCw, Settings, Users } from "lucide-react";
import type { RefObject } from "react";
import { helperTextClass, secondaryButtonClass, surfaceClass } from "./styles";
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
    <div className={`${surfaceClass} p-6`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{sectionMeta.title}</h1>
          <p className={`mt-2 max-w-2xl ${helperTextClass}`}>{sectionMeta.description}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
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
              <div className="absolute right-0 top-12 z-20 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                <button
                  type="button"
                  onClick={onOpenChangePassword}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50"
                >
                  <KeyRound size={16} />
                  Passwort ändern
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={onOpenUsers}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50"
                  >
                    <Users size={16} />
                    Benutzer verwalten
                  </button>
                )}

                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
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
