import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { validateLeadSubmission } from "../shared/lead";
import { processLeadSubmission } from "./leads/adapters";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "64kb" }));

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
