import type { ReactNode } from "react";
import { shellClass, shellContainerClass } from "./styles";

interface AdminShellProps {
  sidebar: ReactNode;
  header: ReactNode;
  alerts?: ReactNode;
  children: ReactNode;
}

export default function AdminShell({ sidebar, header, alerts, children }: AdminShellProps) {
  return (
    <main className={shellClass}>
      <section className={shellContainerClass}>
        <div className="grid items-start gap-6 lg:grid-cols-[248px_minmax(0,1fr)]">
          {sidebar}
          <div className="min-w-0 space-y-6">
            {header}
            {alerts}
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
