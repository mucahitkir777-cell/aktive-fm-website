import { X } from "lucide-react";
import type { ReactNode } from "react";

interface AdminPanelProps {
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}

export default function AdminPanel({ title, description, onClose, children }: AdminPanelProps) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/30 backdrop-blur-[1px]">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-900 hover:bg-slate-50"
            aria-label="Panel schließen"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
