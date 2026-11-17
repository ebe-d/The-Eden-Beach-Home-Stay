import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export type UploadResult = {
  url: string;
  storageType: "cloudinary" | "local";
  publicId: string;
  fileSize: number;
  mimeType: string;
  originalName: string;
};

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function isCloudinaryConfigured(): boolean {
  if (process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.trim().length > 0) {
    return true;
  }
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function parseCloudinaryConfig(): {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
} | null {
  if (process.env.CLOUDINARY_URL) {
    try {
      // Format: cloudinary://api_key:api_secret@cloud_name
      const uri = new URL(process.env.CLOUDINARY_URL);
      const cloudName = uri.hostname;
      const apiKey = uri.username;
      const apiSecret = uri.password;
      if (cloudName && apiKey && apiSecret) {
        return { cloudName, apiKey, apiSecret };
      }
    } catch {
      // Fall through
    }
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (cloudName && apiKey && apiSecret) {
    return { cloudName, apiKey, apiSecret };
  }

  return null;
}

export async function saveUploadedFile(file: File): Promise<UploadResult> {
  if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    throw new Error(
      `Unsupported file type: ${file.type}. Please upload a JPEG, PNG, WebP, AVIF, or GIF image.`
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File size exceeds 10MB limit. Current size is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const cloudinaryConfig = parseCloudinaryConfig();

  // 1. Upload to Cloudinary if credentials are configured
  if (cloudinaryConfig) {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const folder = "the_eden_beach_homestay";
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
      const signature = crypto
        .createHash("sha1")
        .update(paramsToSign + cloudinaryConfig.apiSecret)
        .digest("hex");

      const formData = new FormData();
      formData.append(
        "file",
        new Blob([buffer], { type: file.type }),
        file.name
      );
      formData.append("api_key", cloudinaryConfig.apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Cloudinary upload failed, falling back to local storage:", errorText);
      } else {
        const data = (await res.json()) as {
          secure_url: string;
          public_id: string;
          bytes: number;
          format: string;
        };

        return {
          url: data.secure_url,
          storageType: "cloudinary",
          publicId: data.public_id,
          fileSize: data.bytes || file.size,
          mimeType: file.type,
          originalName: file.name,
        };
      }
    } catch (err) {
      console.error("Cloudinary upload error, falling back to local storage:", err);
    }
  }

  // 2. Permanent Local Storage Driver (public/uploads/)
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const hash = crypto.randomBytes(8).toString("hex");
  const cleanExt = path.extname(file.name).toLowerCase() || ".jpg";
  const safeBaseName = path
    .basename(file.name, cleanExt)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 30);
  const fileName = `${Date.now()}-${safeBaseName}-${hash}${cleanExt}`;
  const filePath = path.join(uploadsDir, fileName);

  await fs.writeFile(filePath, buffer);

  return {
    url: `/uploads/${fileName}`,
    storageType: "local",
    publicId: fileName,
    fileSize: file.size,
    mimeType: file.type,
    originalName: file.name,
  };
}
