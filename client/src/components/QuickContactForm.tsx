/*
 * Aktive Facility Management Quick Contact Form
 * Lead-Formular mit zentraler Validierung und echter Submission.
 */
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "wouter";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { toast } from "sonner";
import type { LeadFieldErrors, LeadSubmissionPayload } from "@shared/lead";
import { submitLead } from "@/lib/leads/submit";
import { getDeviceClass, getStoredUtmParameters } from "@/lib/tracking";
import {
  trackFormError,
  trackFormStart,
  trackFormSubmit,
  trackFormSuccess,
  trackLocationInterest,
  trackServiceInterest,
} from "@/lib/analytics";
import { leadRegions, leadServices } from "@/data/leadTargets";
interface QuickContactFormProps {
  formId?: string;
  formType?: string;
  serviceType?: string;
  location?: string;
  source?: string;
  pageType?: string;
  showLeadFields?: boolean;
  defaultRegionId?: string;
  defaultServiceId?: string;
}
const objectSizeOptions = ["bis 250 m2", "250-1.000 m2", "1.000-5.000 m2", "über 5.000 m2"];
const cleaningIntervalOptions = ["täglich", "mehrmals pro Woche", "wöchentlich", "monatlich", "nach Vereinbarung"];
function getPagePath() {
  return typeof window === "undefined" ? "" : window.location.pathname;
}
export default function QuickContactForm({
  formId = "quick_contact",
  formType = "quick_contact",
  serviceType = "general",
  location,
  source = "website",
  pageType,
  showLeadFields = false,
  defaultRegionId = "",
  defaultServiceId = "",
}: QuickContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    regionId: defaultRegionId,
    serviceId: defaultServiceId,
    objectSize: "",
    cleaningInterval: "",
    message: "",
    privacyConsent: false,
  });
  const [fieldErrors, setFieldErrors] = useState<LeadFieldErrors>({});
  const [leadId, setLeadId] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      regionId: defaultRegionId,
      serviceId: defaultServiceId,
    }));
    setFieldErrors({});
    setLeadId("");
    setStarted(false);
  }, [defaultRegionId, defaultServiceId, formId]);
  const selectedRegion = leadRegions.find((region) => region.id === formData.regionId);
  const selectedService = leadServices.find((service) => service.id === formData.serviceId);
  const buildTrackingPayload = () => {
    const utm = getStoredUtmParameters();
    return {
      form_id: formId,
      form_type: formType,
      source,
      page_path: getPagePath(),
      page_type: pageType ?? formType,
      region: selectedRegion?.label ?? location,
      location: selectedRegion?.label ?? location,
      region_id: selectedRegion?.id,
      service_id: selectedService?.id,
      service_type: selectedService?.label ?? (!showLeadFields ? serviceType : undefined),
      device_type: getDeviceClass(),
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_term: utm.utm_term,
      utm_content: utm.utm_content,
    };
  };
  const buildLeadPayload = (): LeadSubmissionPayload => ({
    formId,
    formType,
    source,
    pagePath: getPagePath(),
    pageType: pageType ?? formType,
    submittedAt: new Date().toISOString(),
    deviceType: getDeviceClass(),
    name: formData.name,
    company: formData.company || undefined,
    phone: formData.phone,
    email: formData.email,
    regionId: selectedRegion?.id,
    regionLabel: selectedRegion?.label,
    location: selectedRegion?.label ?? location,
    serviceId: selectedService?.id,
    serviceLabel: selectedService?.label,
    serviceType: selectedService?.label ?? (!showLeadFields ? serviceType : undefined),
    message: formData.message || undefined,
    objectSize: formData.objectSize || undefined,
    cleaningInterval: formData.cleaningInterval || undefined,
    privacyConsent: formData.privacyConsent,
    utm: getStoredUtmParameters(),
  });
  const handleFormStart = () => {
    if (started) return;
    setStarted(true);
    trackFormStart(buildTrackingPayload());
  };
  const clearFieldError = (name: string) => {
    setFieldErrors((prev) => {
      if (!prev[name as keyof LeadFieldErrors]) return prev;
      const next = { ...prev };
      delete next[name as keyof LeadFieldErrors];
      return next;
    });
  };
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleFormStart();
    const { name, value, type } = event.target;
    const nextValue = type === "checkbox" ? (event.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    clearFieldError(name);
  };
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    handleFormStart();
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
    if (name === "regionId") {
      const region = leadRegions.find((item) => item.id === value);
      if (region) {
        trackLocationInterest(region.label, {
          ...buildTrackingPayload(),
          region_id: region.id,
          source,
        });
      }
    }
    if (name === "serviceId") {
      const service = leadServices.find((item) => item.id === value);
      if (service) {
        trackServiceInterest(service.label, {
          ...buildTrackingPayload(),
          service_id: service.id,
          source,
        });
      }
    }
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    handleFormStart();
    setLoading(true);
    setFieldErrors({});
    setLeadId("");
    const payload = buildLeadPayload();
    const trackingPayload = buildTrackingPayload();
    trackFormSubmit(formType, payload.serviceType, {
      ...trackingPayload,
      has_company: Boolean(payload.company),
      has_message: Boolean(payload.message),
      object_size: payload.objectSize,
      cleaning_interval: payload.cleaningInterval,
      privacy_consent: payload.privacyConsent,
    });
    const result = await submitLead(payload);
    setLoading(false);
    if (!result.success) {
      const errors = result.fieldErrors ?? { general: result.message };
      setFieldErrors(errors);
      trackFormError({
        ...trackingPayload,
        error_message: result.message,
        error_fields: Object.keys(errors),
      });
      toast.error(result.message);
      return;
    }
    setLeadId(result.leadId ?? "");
    trackFormSuccess({
      ...trackingPayload,
      lead_id: result.leadId,
      provider_results: result.providerResults,
    });
    toast.success(result.message);
  };
  if (leadId) {
    return (
      <div className="pc-form-shell text-center">
        <div className="w-16 h-16 pc-bg-soft rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="pc-text-brand" />
        </div>
        <h3 className="text-xl font-bold pc-text-primary mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          Vielen Dank!
        </h3>
        <p className="pc-text-secondary text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
          Ihre Anfrage wurde verarbeitet. Ihre Referenz: {leadId}
        </p>
      </div>
    );
  }
  const errorClass = "text-red-600 text-xs mt-1";
  const inputClass = "pc-input";
  const hasFieldErrors = Object.keys(fieldErrors).some((key) => key !== "general");
  const submitDisabled = loading || !formData.privacyConsent;
  return (
    <form onSubmit={handleSubmit} onFocusCapture={handleFormStart} className="space-y-5" noValidate>
      <div className="rounded-lg border border-[#DCE8FF] bg-[#F4F8FF] px-4 py-3">
        <p className="text-sm font-semibold pc-text-primary" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          In unter 1 Minute anfragen
        </p>
        <p className="pc-text-secondary text-xs mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
          Pflichtfelder sind mit * markiert. Sie erhalten in der Regel innerhalb von 24 Stunden eine Rückmeldung.
        </p>
      </div>
      {fieldErrors.general && (
        <div className="flex gap-2 bg-red-50 text-red-700 border border-red-100 rounded-lg p-3 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{fieldErrors.general}</span>
        </div>
      )}
      {hasFieldErrors && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-700" style={{ fontFamily: "Inter, sans-serif" }}>
            Bitte prüfen Sie die markierten Felder.
          </p>
        </div>
      )}
      {showLeadFields && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold pc-text-primary" style={{ fontFamily: "Inter, sans-serif" }}>
                Region / Einsatzort *
              </label>
              <select
                name="regionId"
                value={formData.regionId}
                onChange={handleSelectChange}
                className="pc-select"
                style={{ fontFamily: "Inter, sans-serif" }}
                required
                aria-invalid={Boolean(fieldErrors.regionId)}
              >
                <option value="">Region auswählen *</option>
                {leadRegions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.label}
                  </option>
                ))}
              </select>
              {fieldErrors.regionId && <p className={errorClass}>{fieldErrors.regionId}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold pc-text-primary" style={{ fontFamily: "Inter, sans-serif" }}>
                Gewünschte Leistung *
              </label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleSelectChange}
                className="pc-select"
                style={{ fontFamily: "Inter, sans-serif" }}
                required
                aria-invalid={Boolean(fieldErrors.serviceId)}
              >
                <option value="">Leistung auswählen *</option>
                {leadServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.label}
                  </option>
                ))}
              </select>
              {fieldErrors.serviceId && <p className={errorClass}>{fieldErrors.serviceId}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold pc-text-primary" style={{ fontFamily: "Inter, sans-serif" }}>
                Objektgröße (optional)
              </label>
              <select
                name="objectSize"
                value={formData.objectSize}
                onChange={handleSelectChange}
                className="pc-select"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <option value="">Objektgröße optional</option>
                {objectSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold pc-text-primary" style={{ fontFamily: "Inter, sans-serif" }}>
                Reinigungsintervall (optional)
              </label>
              <select
                name="cleaningInterval"
                value={formData.cleaningInterval}
                onChange={handleSelectChange}
                className="pc-select"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <option value="">Intervall optional</option>
                {cleaningIntervalOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold pc-text-primary" style={{ fontFamily: "Inter, sans-serif" }}>
            Ihr Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Vor- und Nachname"
            className={inputClass}
            style={{ fontFamily: "Inter, sans-serif" }}
            autoComplete="name"
            required
            aria-invalid={Boolean(fieldErrors.name)}
          />
          {fieldErrors.name && <p className={errorClass}>{fieldErrors.name}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold pc-text-primary" style={{ fontFamily: "Inter, sans-serif" }}>
            Telefonnummer *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="z. B. 0171 1234567"
            className={inputClass}
            style={{ fontFamily: "Inter, sans-serif" }}
            autoComplete="tel"
            inputMode="tel"
            required
            aria-invalid={Boolean(fieldErrors.phone)}
          />
          {fieldErrors.phone && <p className={errorClass}>{fieldErrors.phone}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold pc-text-primary" style={{ fontFamily: "Inter, sans-serif" }}>
            E-Mail-Adresse *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="name@firma.de"
            className={inputClass}
            style={{ fontFamily: "Inter, sans-serif" }}
            autoComplete="email"
            required
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email && <p className={errorClass}>{fieldErrors.email}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold pc-text-primary" style={{ fontFamily: "Inter, sans-serif" }}>
            Firma (optional)
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Ihr Unternehmen"
            className={inputClass}
            style={{ fontFamily: "Inter, sans-serif" }}
            autoComplete="organization"
          />
          {fieldErrors.company && <p className={errorClass}>{fieldErrors.company}</p>}
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold pc-text-primary" style={{ fontFamily: "Inter, sans-serif" }}>
          Zusätzliche Informationen (optional)
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="z. B. Objektart, gewünschter Starttermin oder besondere Anforderungen"
          rows={4}
          className="pc-textarea resize-none"
          style={{ fontFamily: "Inter, sans-serif" }}
          aria-invalid={Boolean(fieldErrors.message)}
        />
        {fieldErrors.message && <p className={errorClass}>{fieldErrors.message}</p>}
      </div>
      <label className="flex items-start gap-3 pc-text-secondary text-xs leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
        <input
          type="checkbox"
          name="privacyConsent"
          checked={formData.privacyConsent}
          onChange={handleInputChange}
          className="mt-1 pc-checkbox"
          required
        />
        <span>
          Ich stimme zu, dass meine Angaben zur Bearbeitung der Anfrage verarbeitet werden. Hinweise finden Sie in der{" "}
          <Link href="/datenschutz">
            <span className="pc-text-brand hover:text-[var(--color-primary-hover)]">Datenschutzerklärung</span>
          </Link>
          . *
          {fieldErrors.privacyConsent && <span className="block text-red-600 mt-1">{fieldErrors.privacyConsent}</span>}
        </span>
      </label>
      <button
        type="submit"
        disabled={submitDisabled}
        className="w-full pc-btn-primary disabled:bg-gray-400"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <Send size={16} />
        {loading ? "Wird verarbeitet..." : "Kostenloses Angebot anfordern"}
      </button>
      <p className="pc-text-secondary text-xs text-center" style={{ fontFamily: "Inter, sans-serif" }}>
        Kostenlos & unverbindlich | Verarbeitung erst nach Datenschutz-Zustimmung
      </p>
    </form>
  );
}


