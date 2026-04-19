export const buttonBaseClass =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-4";
export const secondaryButtonClass =
  `${buttonBaseClass} border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60`;
export const primaryButtonClass =
  `${buttonBaseClass} border border-[#1D6FA4] bg-[#1D6FA4] text-white hover:border-[#155d8e] hover:bg-[#155d8e] focus-visible:ring-[#1D6FA4]/20 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:text-white`;
export const dangerButtonClass =
  `${buttonBaseClass} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60`;
export const shellClass = "min-h-screen bg-slate-100 px-4 py-5 md:px-6 md:py-6";
export const shellContainerClass = "mx-auto max-w-[1600px]";
export const surfaceClass = "rounded-[20px] border border-slate-200/90 bg-white shadow-[0_20px_44px_-30px_rgba(15,33,55,0.38)]";
export const surfacePanelClass = `${surfaceClass} p-5 md:p-6`;
export const surfaceMutedClass = "rounded-[20px] border border-slate-200 bg-slate-50/80";
export const subtleSurfaceClass = "rounded-2xl border border-slate-200 bg-slate-50/80 p-4";
export const fieldLabelClass = "block text-sm font-medium text-slate-800";
export const fieldControlClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-[#1D6FA4] focus:outline-none focus:ring-4 focus:ring-[#1D6FA4]/15";
export const helperTextClass = "text-sm text-slate-500";
export const tableWrapperClass = `${surfaceClass} overflow-hidden`;
export const tableHeadClass = "border-b border-slate-200 bg-slate-50/90 text-xs uppercase text-slate-500";
export const tableHeaderCellClass = "px-5 py-3.5 font-semibold tracking-[0.16em]";
export const tableCellClass = "px-5 py-4 text-sm text-slate-700";
export const tableRowClass = "border-t border-slate-200/80 align-top transition-colors hover:bg-slate-50/80";
export const successAlertClass = "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700";
export const errorAlertClass = "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700";
export const emptyStateClass = "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500";
export const neutralBadgeClass = "inline-flex rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700";
export const infoPanelClass = "rounded-2xl border border-slate-200 bg-slate-50 p-4";
export const menuPopupClass = "absolute right-0 top-12 z-20 w-60 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_18px_40px_-24px_rgba(15,33,55,0.35)]";
export const menuItemClass = "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-slate-900 transition-colors hover:bg-slate-50";
