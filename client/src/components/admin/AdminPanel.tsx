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
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/35 p-0 backdrop-blur-sm sm:p-4">
      <div className="h-full w-full max-w-xl overflow-hidden bg-white shadow-[0_24px_60px_-32px_rgba(15,33,55,0.55)] sm:rounded-[24px] sm:border sm:border-slate-200">
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 md:px-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-2 text-slate-900 transition-colors hover:bg-slate-100"
            aria-label="Panel schließen"
          >
            <X size={18} />
          </button>
        </div>
        <div className="h-[calc(100%-89px)] overflow-y-auto px-5 py-5 md:px-6 md:py-6">{children}</div>
      </div>
    </div>
  );
}
