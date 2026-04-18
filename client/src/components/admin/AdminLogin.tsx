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
      <section className={`${shellContainerClass} max-w-md ${surfaceClass} p-7`}>
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Admin Login</h1>
        <p className={`mb-6 ${helperTextClass}`}>Melden Sie sich an, um Leads und Benutzer zu verwalten.</p>

        {error && <AdminAlert type="error" message={error} className="mb-4" />}

        <form onSubmit={onSubmit} className="space-y-4">
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

          <button type="submit" disabled={submitting} className={`w-full ${primaryButtonClass}`}>
            {submitting ? "Anmeldung läuft..." : "Einloggen"}
          </button>
        </form>
      </section>
    </main>
  );
}
