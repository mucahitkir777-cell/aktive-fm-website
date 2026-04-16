import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import {
  adminChangePasswordSchema,
  adminCreateUserSchema,
  adminLoginSchema,
} from "../shared/admin";
import {
  cmsHomeContentSchema,
  cmsPageSlugSchema,
} from "../shared/cms";
import {
  adminLeadUpdateSchema,
  validateLeadSubmission,
} from "../shared/lead";
import { createAdminToken, requireAdminAuth, requireAdminRole } from "./auth";
import { getAdminDashboardStats } from "./admin/stats";
import { recordPageView } from "./analytics/repository";
import {
  ensureCmsPageDefaults,
  getCmsPage,
  listCmsPages,
  updateCmsPageContent,
} from "./cms/repository";
import { initializeDatabase } from "./db";
import { processLeadSubmission } from "./leads/adapters";
import { getLeadById, listLeads, updateLead } from "./leads/repository";
import { hashPassword, verifyPassword } from "./users/password";
import {
  createUser,
  ensureInitialAdminUser,
  getAuthUserById,
  getAuthUserByUsername,
  listUsers,
  updateUserPassword,
} from "./users/repository";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pageViewSchema = z.object({
  path: z.string().trim().min(1).max(500),
  userAgent: z.string().trim().max(1000).optional(),
});

async function startServer() {
  await initializeDatabase();
  await ensureCmsPageDefaults();
  const bootstrapResult = await ensureInitialAdminUser();
  if (bootstrapResult.created) {
    console.log(`Initial admin user created: ${bootstrapResult.user.username}`);
  }

  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "64kb" }));

  app.post("/api/admin/login", async (req, res) => {
    const parsedBody = adminLoginSchema.safeParse(req.body ?? {});

    if (!parsedBody.success) {
      res.status(400).json({
        success: false,
        message: parsedBody.error.flatten().fieldErrors.username?.[0]
          ?? parsedBody.error.flatten().fieldErrors.password?.[0]
          ?? "Benutzername und Passwort sind erforderlich.",
      });
      return;
    }

    try {
      const user = await getAuthUserByUsername(parsedBody.data.username);
      if (!user || !user.isActive || !verifyPassword(parsedBody.data.password, user.passwordHash)) {
        res.status(401).json({ success: false, message: "Login fehlgeschlagen." });
        return;
      }

      const session = createAdminToken({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      res.status(200).json({
        success: true,
        token: session.token,
        expiresAt: session.expiresAt,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Admin-Login ist nicht konfiguriert.",
      });
    }
  });

  app.post("/api/admin/change-password", requireAdminAuth, async (req, res) => {
    const parsedBody = adminChangePasswordSchema.safeParse(req.body ?? {});

    if (!parsedBody.success) {
      res.status(400).json({
        success: false,
        message:
          parsedBody.error.flatten().fieldErrors.currentPassword?.[0]
          ?? parsedBody.error.flatten().fieldErrors.newPassword?.[0]
          ?? "Bitte pruefen Sie Ihre Eingaben.",
      });
      return;
    }

    try {
      const user = await getAuthUserById(req.adminUser!.id);
      if (!user || !user.isActive) {
        res.status(401).json({ success: false, message: "Nicht autorisiert." });
        return;
      }

      if (!verifyPassword(parsedBody.data.currentPassword, user.passwordHash)) {
        res.status(400).json({ success: false, message: "Aktuelles Passwort ist nicht korrekt." });
        return;
      }

      const updatedUser = await updateUserPassword(user.id, hashPassword(parsedBody.data.newPassword));
      if (!updatedUser) {
        res.status(500).json({ success: false, message: "Passwort konnte nicht aktualisiert werden." });
        return;
      }

      const session = createAdminToken({
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role,
      });

      res.status(200).json({
        success: true,
        message: "Passwort erfolgreich aktualisiert.",
        token: session.token,
        expiresAt: session.expiresAt,
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          role: updatedUser.role,
          isActive: updatedUser.isActive,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Passwort konnte nicht aktualisiert werden.",
      });
    }
  });

  app.get("/api/admin/users", requireAdminAuth, requireAdminRole("admin"), async (_req, res) => {
    try {
      const users = await listUsers();
      res.status(200).json({ success: true, users });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Benutzer konnten nicht geladen werden.",
      });
    }
  });

  app.post("/api/admin/users", requireAdminAuth, requireAdminRole("admin"), async (req, res) => {
    const parsedBody = adminCreateUserSchema.safeParse(req.body ?? {});

    if (!parsedBody.success) {
      const fieldErrors = parsedBody.error.flatten().fieldErrors;
      res.status(400).json({
        success: false,
        message: fieldErrors.username?.[0] ?? fieldErrors.password?.[0] ?? fieldErrors.role?.[0] ?? "Bitte pruefen Sie Ihre Eingaben.",
      });
      return;
    }

    try {
      const existingUser = await getAuthUserByUsername(parsedBody.data.username);
      if (existingUser) {
        res.status(409).json({ success: false, message: "Benutzername ist bereits vergeben." });
        return;
      }

      const user = await createUser({
        username: parsedBody.data.username,
        passwordHash: hashPassword(parsedBody.data.password),
        role: parsedBody.data.role,
      });

      res.status(201).json({
        success: true,
        message: "Benutzer wurde angelegt.",
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Benutzer konnte nicht angelegt werden.",
      });
    }
  });

  app.get("/api/admin/stats", requireAdminAuth, async (_req, res) => {
    try {
      const stats = await getAdminDashboardStats();
      res.status(200).json({ success: true, stats });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Statistiken konnten nicht geladen werden.",
      });
    }
  });

  app.get("/api/admin/cms/pages", requireAdminAuth, async (_req, res) => {
    try {
      const pages = await listCmsPages();
      res.status(200).json({ success: true, pages });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "CMS-Seiten konnten nicht geladen werden.",
      });
    }
  });

  app.get("/api/admin/cms/pages/:slug", requireAdminAuth, async (req, res) => {
    const parsedSlug = cmsPageSlugSchema.safeParse(req.params.slug);
    if (!parsedSlug.success) {
      res.status(404).json({ success: false, message: "CMS-Seite nicht gefunden." });
      return;
    }

    try {
      const page = await getCmsPage(parsedSlug.data);
      if (!page) {
        res.status(404).json({ success: false, message: "CMS-Seite nicht gefunden." });
        return;
      }

      res.status(200).json({ success: true, page });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "CMS-Seite konnte nicht geladen werden.",
      });
    }
  });

  app.put("/api/admin/cms/pages/:slug", requireAdminAuth, async (req, res) => {
    const parsedSlug = cmsPageSlugSchema.safeParse(req.params.slug);
    if (!parsedSlug.success) {
      res.status(404).json({ success: false, message: "CMS-Seite nicht gefunden." });
      return;
    }

    if (parsedSlug.data !== "home") {
      res.status(400).json({ success: false, message: "Diese CMS-Seite wird noch nicht unterstuetzt." });
      return;
    }

    const parsedContent = cmsHomeContentSchema.safeParse(req.body?.content ?? {});
    if (!parsedContent.success) {
      res.status(400).json({
        success: false,
        message:
          parsedContent.error.flatten().fieldErrors.hero?.[0]
          ?? parsedContent.error.flatten().fieldErrors.finalCta?.[0]
          ?? "CMS-Inhalte sind ungueltig.",
      });
      return;
    }

    try {
      const page = await updateCmsPageContent(parsedSlug.data, parsedContent.data);
      res.status(200).json({ success: true, page, message: "CMS-Inhalte wurden gespeichert." });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "CMS-Inhalte konnten nicht gespeichert werden.",
      });
    }
  });

  app.post("/api/leads", async (req, res) => {
    const validation = validateLeadSubmission(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Bitte pruefen Sie Ihre Angaben.",
        fieldErrors: validation.fieldErrors,
      });
      return;
    }

    try {
      const result = await processLeadSubmission(validation.data);
      res.status(200).json({
        success: true,
        leadId: result.leadId,
        message: "Ihre Anfrage wurde erfolgreich verarbeitet.",
        providerResults: result.providerResults,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Die Anfrage konnte nicht verarbeitet werden.",
      });
    }
  });

  app.get("/api/leads", requireAdminAuth, async (_req, res) => {
    try {
      const leads = await listLeads();
      res.status(200).json({ success: true, leads });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Leads konnten nicht geladen werden.",
      });
    }
  });

  app.get("/api/leads/:id", requireAdminAuth, async (req, res) => {
    try {
      const lead = await getLeadById(req.params.id);
      if (!lead) {
        res.status(404).json({ success: false, message: "Lead nicht gefunden." });
        return;
      }

      res.status(200).json({ success: true, lead });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Lead konnte nicht geladen werden.",
      });
    }
  });

  app.patch("/api/leads/:id", requireAdminAuth, async (req, res) => {
    const parsedUpdate = adminLeadUpdateSchema.safeParse(req.body ?? {});

    if (!parsedUpdate.success) {
      res.status(400).json({ success: false, message: "Ungueltige Lead-Daten." });
      return;
    }

    try {
      const lead = await updateLead(req.params.id, parsedUpdate.data);

      if (!lead) {
        res.status(404).json({ success: false, message: "Lead nicht gefunden." });
        return;
      }

      res.status(200).json({ success: true, lead });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Lead konnte nicht aktualisiert werden.",
      });
    }
  });

  app.post("/api/track/pageview", async (req, res) => {
    const parsedBody = pageViewSchema.safeParse(req.body ?? {});

    if (!parsedBody.success) {
      res.status(400).json({ success: false, message: "Ungueltiger Pageview." });
      return;
    }

    try {
      await recordPageView({
        path: parsedBody.data.path,
        userAgent: parsedBody.data.userAgent ?? req.get("user-agent") ?? null,
      });

      res.status(202).json({ success: true });
    } catch {
      res.status(202).json({ success: true });
    }
  });

  app.get("/api/content/pages/:slug", async (req, res) => {
    const parsedSlug = cmsPageSlugSchema.safeParse(req.params.slug);
    if (!parsedSlug.success) {
      res.status(404).json({ success: false, message: "CMS-Seite nicht gefunden." });
      return;
    }

    try {
      const page = await getCmsPage(parsedSlug.data);
      if (!page) {
        res.status(404).json({ success: false, message: "CMS-Seite nicht gefunden." });
        return;
      }

      res.status(200).json({ success: true, page });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "CMS-Seite konnte nicht geladen werden.",
      });
    }
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = Number(process.env.PORT) || 3000;
  const host = "0.0.0.0";

  server.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}/`);
  });
}

startServer().catch(console.error);
