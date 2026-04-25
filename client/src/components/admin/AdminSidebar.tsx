import { surfaceClass } from "./styles";
import type { AdminSection, CmsSectionKey, SidebarNavigationGroup, SidebarNavigationItem } from "./types";

interface AdminSidebarProps {
  navigationGroups: SidebarNavigationGroup[];
  currentSection: AdminSection;
  selectedCmsSection: CmsSectionKey;
  onNavigate: (item: SidebarNavigationItem) => void;
}

export default function AdminSidebar({
  navigationGroups,
  currentSection,
  selectedCmsSection,
  onNavigate,
}: AdminSidebarProps) {
  return (
    <aside className={`${surfaceClass} max-h-[calc(100vh-1.8rem)] overflow-y-auto p-4 text-sm text-slate-800 lg:sticky lg:top-4`}>
      <div className="mb-6 rounded-xl border border-slate-200 bg-[linear-gradient(135deg,rgba(29,111,164,0.12),rgba(29,111,164,0.02))] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">Admin</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-900">Control Center</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Strukturierte Verwaltung für CMS, Leads und Benutzer.
        </p>
      </div>

      <div className="space-y-6">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-3">
            <div className="px-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {group.title}
            </div>
            <div className="space-y-2">
              {group.items
                .filter((item) => item.access)
                .map((item) => {
                  const isActive =
                    item.id === currentSection
                    || (currentSection === "content" && item.id === "navigation" && selectedCmsSection === "navigation");

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onNavigate(item)}
                      className={`group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-all ${
                        isActive
                          ? "border border-[#1D6FA4]/20 bg-[#1D6FA4]/10 text-[#144f74] shadow-[0_12px_24px_-20px_rgba(29,111,164,0.7)]"
                          : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`absolute left-0 top-2 h-[calc(100%-1rem)] w-1 rounded-r-full transition-opacity ${
                          isActive ? "bg-[#1D6FA4] opacity-100" : "opacity-0 group-hover:opacity-70"
                        }`}
                      />
                      <item.icon size={16} className={isActive ? "text-[#1D6FA4]" : "text-slate-500"} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-3 text-xs leading-5 text-slate-500">
        Schnellzugriff auf Leads, Inhalte und Konfiguration in einer festen Navigation.
      </div>
    </aside>
  );
}
