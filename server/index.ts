import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { leadStatusSchema, validateLeadSubmission } from "../shared/lead";
import { createAdminToken, requireAdminAuth, verifyAdminCredentials } from "./auth";
import { initializeDatabase } from "./db";
import { processLeadSubmission } from "./leads/adapters";
import { getLeadById, listLeads, updateLeadStatus } from "./leads/repository";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  await initializeDatabase();

  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "64kb" }));

  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body ?? {};

    if (typeof username !== "string" || typeof password !== "string") {
      res.status(400).json({ success: false, message: "Benutzername und Passwort sind erforderlich." });
      return;
    }

    try {
      if (!verifyAdminCredentials(username, password)) {
        res.status(401).json({ success: false, message: "Login fehlgeschlagen." });
        return;
      }

      res.status(200).json({
        success: true,
        token: createAdminToken(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Admin-Login ist nicht konfiguriert.",
      });
    }
  });

  app.post("/api/leads", async (req, res) => {
    const validation = validateLeadSubmission(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Bitte prüfen Sie Ihre Angaben.",
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
    const parsedStatus = leadStatusSchema.safeParse(req.body?.status);

    if (!parsedStatus.success) {
      res.status(400).json({ success: false, message: "Ungueltiger Lead-Status." });
      return;
    }

    try {
      const lead = await updateLeadStatus(req.params.id, parsedStatus.data);
      if (!lead) {
        res.status(404).json({ success: false, message: "Lead nicht gefunden." });
        return;
      }

      res.status(200).json({ success: true, lead });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Lead-Status konnte nicht geaendert werden.",
      });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
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
