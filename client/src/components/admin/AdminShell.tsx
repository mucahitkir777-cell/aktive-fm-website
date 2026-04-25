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
        <div className="grid items-start gap-6 xl:grid-cols-[292px_minmax(0,1fr)] xl:gap-7">
          {sidebar}
          <div className="min-w-0 space-y-6">
            {header}
            {alerts}
            <div className="space-y-6">{children}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
