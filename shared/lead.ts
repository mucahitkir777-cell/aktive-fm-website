import { z } from "zod";

export const leadUtmSchema = z
  .object({
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_term: z.string().optional(),
    utm_content: z.string().optional(),
    gclid: z.string().optional(),
    msclkid: z.string().optional(),
    fbclid: z.string().optional(),
  })
  .partial();

export const leadSubmissionSchema = z
  .object({
    formId: z.string().trim().min(1, "Formular-ID fehlt."),
    formType: z.string().trim().min(1, "Formular-Typ fehlt."),
    source: z.string().trim().min(1, "Quelle fehlt."),
    pagePath: z.string().trim().min(1, "Seitenpfad fehlt."),
    pageType: z.string().trim().optional(),
    submittedAt: z.string().trim().min(1, "Zeitpunkt fehlt."),
    deviceType: z.enum(["mobile", "tablet", "desktop"]),
    name: z.string().trim().min(2, "Bitte geben Sie Ihren Namen ein.").max(120, "Der Name ist zu lang."),
    company: z.string().trim().max(160, "Der Firmenname ist zu lang.").optional(),
    phone: z.string().trim().min(5, "Bitte geben Sie eine gültige Telefonnummer ein.").max(50, "Die Telefonnummer ist zu lang."),
    email: z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse ein.").max(160, "Die E-Mail-Adresse ist zu lang."),
    regionId: z.string().trim().optional(),
    regionLabel: z.string().trim().optional(),
    location: z.string().trim().optional(),
    serviceId: z.string().trim().optional(),
    serviceLabel: z.string().trim().optional(),
    serviceType: z.string().trim().optional(),
    message: z.string().trim().max(2000, "Die Nachricht ist zu lang.").optional(),
    objectSize: z.string().trim().max(80, "Die Objektgröße ist zu lang.").optional(),
    cleaningInterval: z.string().trim().max(80, "Das Reinigungsintervall ist zu lang.").optional(),
    privacyConsent: z.boolean().refine((value) => value, "Bitte stimmen Sie der Datenverarbeitung zu."),
    utm: leadUtmSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.regionId && !data.regionLabel && !data.location) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["regionId"],
        message: "Bitte wählen Sie eine Region oder geben Sie einen Einsatzort an.",
      });
    }

    if (!data.serviceId && !data.serviceLabel && !data.serviceType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["serviceId"],
        message: "Bitte wählen Sie eine gewünschte Leistung aus.",
      });
    }
  });

export type LeadSubmissionPayload = z.infer<typeof leadSubmissionSchema>;
export type LeadFieldName = keyof LeadSubmissionPayload | "general";
export type LeadFieldErrors = Partial<Record<LeadFieldName, string>>;

export const leadStatusValues = ["new", "contacted", "qualified", "done", "archived"] as const;
export const leadStatusSchema = z.enum(leadStatusValues);
export type LeadStatus = (typeof leadStatusValues)[number];

export interface AdminLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  internalNote?: string | null;
  followUpDate?: string | null;
  company?: string | null;
  regionLabel?: string | null;
  serviceLabel?: string | null;
}

export const adminLeadUpdateSchema = z
  .object({
    name: z.string().trim().min(2, "Bitte geben Sie einen gültigen Namen ein.").max(120, "Der Name ist zu lang.").optional(),
    email: z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse ein.").max(160, "Die E-Mail-Adresse ist zu lang.").optional(),
    phone: z.string().trim().min(5, "Bitte geben Sie eine gültige Telefonnummer ein.").max(50, "Die Telefonnummer ist zu lang.").optional(),
    message: z
      .union([z.string().trim().max(2000, "Die Nachricht ist zu lang."), z.null()])
      .optional(),
    internalNote: z
      .union([z.string().trim().max(5000, "Die interne Notiz ist zu lang."), z.null()])
      .optional(),
    followUpDate: z
      .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Bitte geben Sie ein gültiges Datum ein."), z.null()])
      .optional(),
    status: leadStatusSchema.optional(),
  })
  .refine((value) => Object.values(value).some((entry) => entry !== undefined), {
    message: "Mindestens ein Feld muss geändert werden.",
  });

export type AdminLeadUpdateInput = z.infer<typeof adminLeadUpdateSchema>;

export interface LeadSubmissionResult {
  success: boolean;
  leadId?: string;
  message: string;
  providerResults?: LeadProviderResult[];
  fieldErrors?: LeadFieldErrors;
}

export interface LeadProviderResult {
  provider: "database" | "local_inbox" | "webhook" | "crm" | "email";
  status: "success" | "skipped" | "error";
  message: string;
}

export type LeadValidationResult =
  | { success: true; data: LeadSubmissionPayload }
  | { success: false; fieldErrors: LeadFieldErrors };

export function validateLeadSubmission(input: unknown): LeadValidationResult {
  const result = leadSubmissionSchema.safeParse(input);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const fieldErrors: LeadFieldErrors = {};
  const flattened = result.error.flatten().fieldErrors;

  Object.entries(flattened).forEach(([field, messages]) => {
    if (messages?.[0]) {
      fieldErrors[field as LeadFieldName] = messages[0];
    }
  });

  if (!Object.keys(fieldErrors).length) {
    fieldErrors.general = "Bitte prüfen Sie Ihre Angaben.";
  }

  return { success: false, fieldErrors };
}
