import { z } from "zod";
import type { LeadStatus } from "./lead";

export const adminRoleValues = ["admin", "staff"] as const;
export const adminRoleSchema = z.enum(adminRoleValues);
export type AdminRole = (typeof adminRoleValues)[number];

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1, "Benutzername ist erforderlich."),
  password: z.string().min(1, "Passwort ist erforderlich."),
});

export const adminChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Aktuelles Passwort ist erforderlich."),
    newPassword: z.string().min(10, "Das neue Passwort muss mindestens 10 Zeichen lang sein."),
  })
  .refine((value) => value.currentPassword !== value.newPassword, {
    path: ["newPassword"],
    message: "Das neue Passwort muss sich vom aktuellen Passwort unterscheiden.",
  });

export const adminCreateUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Der Benutzername muss mindestens 3 Zeichen lang sein.")
    .max(50, "Der Benutzername ist zu lang.")
    .regex(/^[a-zA-Z0-9._-]+$/, "Nur Buchstaben, Zahlen, Punkt, Unterstrich und Bindestrich sind erlaubt."),
  password: z.string().min(10, "Das Passwort muss mindestens 10 Zeichen lang sein."),
  role: adminRoleSchema.default("staff"),
});

export interface AdminUser {
  id: string;
  username: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSessionUser {
  id: string;
  username: string;
  role: AdminRole;
}

export interface AdminLeadStats {
  total: number;
  today: number;
  thisWeek: number;
  dueToday: number;
  overdue: number;
  byStatus: Record<LeadStatus, number>;
}

export interface AdminPageViewStats {
  today: number;
  last7Days: number;
}

export interface AdminRecentLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus | "ohne Status";
  createdAt: string;
}

export interface AdminDueLead {
  id: string;
  name: string;
  status: LeadStatus | "ohne Status";
  followUpDate: string;
}

export interface AdminDashboardStats {
  leads: AdminLeadStats;
  pageViews: AdminPageViewStats;
  recentLeads: AdminRecentLead[];
  dueLeads: AdminDueLead[];
  newLeadsToday: AdminRecentLead[];
  dueTodayLeads: AdminDueLead[];
  overdueLeads: AdminDueLead[];
}
