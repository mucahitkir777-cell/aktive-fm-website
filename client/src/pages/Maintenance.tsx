import { companyConfig } from "@/config/company";

export default function Maintenance() {
  return (
    <main className="min-h-screen pc-bg-section px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] border pc-border bg-white p-12 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] pc-text-muted">Wartungsmodus</p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight pc-text-primary">Unsere Website wird gerade überarbeitet.</h1>
        <p className="mt-4 text-base leading-8 pc-text-secondary">
          Wir sind bald wieder für Sie da. Bitte versuchen Sie es später erneut.
        </p>

        <div className="mt-10 rounded-3xl pc-bg-soft p-6 text-left text-sm pc-text-primary">
          <p className="font-semibold pc-text-primary">Kontakt bei dringenden Fragen</p>
          <p className="mt-3">
            Telefon: <a href={companyConfig.contact.phoneHref} className="font-semibold pc-text-brand">{companyConfig.contact.phoneDisplay}</a>
          </p>
          <p className="mt-2">
            E-Mail: <a href={companyConfig.contact.emailHref} className="font-semibold pc-text-brand">{companyConfig.contact.email}</a>
          </p>
        </div>
      </div>
    </main>
  );
}
