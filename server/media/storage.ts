import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";

const ALLOWED_IMAGE_MIME_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

export interface StoredMediaFile {
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
}

interface SaveUploadedImageInput {
  projectRoot: string;
  filename: string;
  dataUrl: string;
}

function sanitizeBaseName(filename: string) {
  const normalized = path.parse(filename).name.toLowerCase();
  const safe = normalized
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  return safe || "image";
}

function parseDataUrl(dataUrl: string) {
  const parsed = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl.trim());
  if (!parsed) {
    throw new Error("Ungültiges Bildformat.");
  }

  const mimeType = parsed[1].toLowerCase();
  const base64Payload = parsed[2];
  const extension = ALLOWED_IMAGE_MIME_TYPES.get(mimeType);

  if (!extension) {
    throw new Error("Nur JPG, PNG, WEBP oder GIF sind erlaubt.");
  }

  return { mimeType, extension, base64Payload };
}

export function getUploadsDirectory(projectRoot: string) {
  return path.resolve(projectRoot, "uploads");
}

export async function ensureUploadsDirectory(projectRoot: string) {
  await fs.mkdir(getUploadsDirectory(projectRoot), { recursive: true });
}

export async function saveUploadedImage(input: SaveUploadedImageInput): Promise<StoredMediaFile> {
  const { extension, base64Payload } = parseDataUrl(input.dataUrl);
  const data = Buffer.from(base64Payload, "base64");

  if (data.byteLength === 0) {
    throw new Error("Die Bilddatei ist leer.");
  }

  if (data.byteLength > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Die Bilddatei ist zu gross. Maximal 8 MB erlaubt.");
  }

  await ensureUploadsDirectory(input.projectRoot);

  const safeBaseName = sanitizeBaseName(input.filename);
  const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  const storedFilename = `${safeBaseName}-${uniqueSuffix}.${extension}`;
  const absolutePath = path.join(getUploadsDirectory(input.projectRoot), storedFilename);

  await fs.writeFile(absolutePath, data, { flag: "wx" });

  return {
    filename: storedFilename,
    url: `/uploads/${encodeURIComponent(storedFilename)}`,
    size: data.byteLength,
    uploadedAt: new Date().toISOString(),
  };
}

export async function listUploadedImages(projectRoot: string): Promise<StoredMediaFile[]> {
  await ensureUploadsDirectory(projectRoot);

  const directory = getUploadsDirectory(projectRoot);
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile());

  const media = await Promise.all(
    files.map(async (file) => {
      const absolutePath = path.join(directory, file.name);
      const stat = await fs.stat(absolutePath);

      return {
        filename: file.name,
        url: `/uploads/${encodeURIComponent(file.name)}`,
        size: stat.size,
        uploadedAt: stat.mtime.toISOString(),
      } satisfies StoredMediaFile;
    }),
  );

  return media.sort((left, right) => new Date(right.uploadedAt).getTime() - new Date(left.uploadedAt).getTime());
}
