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
    <aside className={`${surfaceClass} max-h-[calc(100vh-3rem)] overflow-y-auto p-4 text-sm text-slate-800 lg:sticky lg:top-6`}>
      <div className="mb-6 border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Admin</p>
        <h2 className="mt-3 text-lg font-semibold text-slate-900">Workspace</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Strukturierte Verwaltung für CMS, Leads und Benutzer.</p>
      </div>

      <div className="space-y-6">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
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
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition ${
                        isActive
                          ? "bg-slate-900 text-white shadow-[0_8px_20px_-16px_rgba(15,33,55,0.9)]"
                          : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
