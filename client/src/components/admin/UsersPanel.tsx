import { UserPlus } from "lucide-react";
import type { FormEvent } from "react";
import type { AdminRole, AdminUser } from "@shared/admin";
import { fieldControlClass, fieldLabelClass, surfaceMutedClass, tableCellClass, tableHeadClass, tableHeaderCellClass, primaryButtonClass } from "./styles";

interface UserCreateFormValue {
  username: string;
  password: string;
  role: AdminRole;
}

interface UsersPanelProps {
  users: AdminUser[];
  userCreateForm: UserCreateFormValue;
  userCreationRoles: AdminRole[];
  submitting: boolean;
  onSubmitCreateUser: (event: FormEvent) => void;
  onChangeCreateForm: <K extends keyof UserCreateFormValue>(key: K, value: UserCreateFormValue[K]) => void;
  formatDate: (value: string) => string;
  formatRoleLabel: (role: AdminRole) => string;
}

export default function UsersPanel({
  users,
  userCreateForm,
  userCreationRoles,
  submitting,
  onSubmitCreateUser,
  onChangeCreateForm,
  formatDate,
  formatRoleLabel,
}: UsersPanelProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full border-collapse text-left text-sm">
          <thead className={tableHeadClass}>
            <tr>
              <th className={tableHeaderCellClass}>Benutzer</th>
              <th className={tableHeaderCellClass}>Rolle</th>
              <th className={tableHeaderCellClass}>Status</th>
              <th className={tableHeaderCellClass}>Erstellt</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className={`${tableCellClass} font-medium text-slate-900`}>{user.username}</td>
                <td className={tableCellClass}>{formatRoleLabel(user.role)}</td>
                <td className={tableCellClass}>{user.isActive ? "aktiv" : "inaktiv"}</td>
                <td className={tableCellClass}>{formatDate(user.createdAt)}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                  Keine Benutzer vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={onSubmitCreateUser} className={`${surfaceMutedClass} p-4`}>
        <div className="mb-4 flex items-center gap-2">
          <UserPlus size={18} className="text-[#1D6FA4]" />
          <h3 className="text-base font-semibold text-slate-900">Neuen Benutzer anlegen</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className={fieldLabelClass}>
            Benutzername
            <input
              value={userCreateForm.username}
              onChange={(event) => onChangeCreateForm("username", event.target.value)}
              className={fieldControlClass}
              autoComplete="off"
            />
          </label>

          <label className={fieldLabelClass}>
            Passwort
            <input
              type="password"
              value={userCreateForm.password}
              onChange={(event) => onChangeCreateForm("password", event.target.value)}
              className={fieldControlClass}
              autoComplete="new-password"
            />
          </label>

          <label className={fieldLabelClass}>
            Rolle
            <select
              value={userCreateForm.role}
              onChange={(event) => onChangeCreateForm("role", event.target.value as AdminRole)}
              className={fieldControlClass}
            >
              {userCreationRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex justify-end">
          <button type="submit" disabled={submitting} className={primaryButtonClass}>
            {submitting ? "Legt an..." : "Benutzer anlegen"}
          </button>
        </div>
      </form>
    </div>
  );
}
