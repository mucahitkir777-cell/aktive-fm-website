import type { FormEvent } from "react";
import AdminAlert from "./AdminAlert";
import {
  fieldControlClass,
  fieldLabelClass,
  helperTextClass,
  primaryButtonClass,
  shellClass,
  shellContainerClass,
  surfaceClass,
} from "./styles";

interface AdminLoginProps {
  username: string;
  password: string;
  submitting: boolean;
  error: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}

export default function AdminLogin({
  username,
  password,
  submitting,
  error,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: AdminLoginProps) {
  return (
    <main className={shellClass}>
      <section className={`${shellContainerClass} max-w-lg`}>
        <div className={`${surfaceClass} p-7 md:p-8`}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Admin</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Admin Login</h1>
          <p className={`mt-2 ${helperTextClass}`}>Melden Sie sich an, um Leads und Benutzer zu verwalten.</p>

          {error && <AdminAlert type="error" message={error} className="mt-6" />}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className={fieldLabelClass}>
              Benutzername
              <input
                value={username}
                onChange={(event) => onUsernameChange(event.target.value)}
                className={fieldControlClass}
                autoComplete="username"
              />
            </label>

            <label className={fieldLabelClass}>
              Passwort
              <input
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                type="password"
                className={fieldControlClass}
                autoComplete="current-password"
              />
            </label>

            <button type="submit" disabled={submitting} className={`mt-2 w-full ${primaryButtonClass}`}>
              {submitting ? "Anmeldung läuft..." : "Einloggen"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
