import { companyConfig } from "@/config/company";

export default function Maintenance() {
  return (
    <main className="min-h-screen bg-[#F7F8FA] px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-gray-200 bg-white p-12 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6B7A8D]">Wartungsmodus</p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#0F2137]">Unsere Website wird gerade überarbeitet.</h1>
        <p className="mt-4 text-base leading-8 text-[#6B7A8D]">
          Wir sind bald wieder für Sie da. Bitte versuchen Sie es später erneut.
        </p>

        <div className="mt-10 rounded-3xl bg-[#F7F8FA] p-6 text-left text-sm text-[#0F2137]">
          <p className="font-semibold text-[#0F2137]">Kontakt bei dringenden Fragen</p>
          <p className="mt-3">
            Telefon: <a href={companyConfig.contact.phoneHref} className="font-semibold text-[#1D6FA4]">{companyConfig.contact.phoneDisplay}</a>
          </p>
          <p className="mt-2">
            E-Mail: <a href={companyConfig.contact.emailHref} className="font-semibold text-[#1D6FA4]">{companyConfig.contact.email}</a>
          </p>
        </div>
      </div>
    </main>
  );
}
