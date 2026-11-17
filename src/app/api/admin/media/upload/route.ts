import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getDb } from "@/db";
import { mediaItems } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";
import { CACHE_TAGS } from "@/lib/data";
import { saveUploadedFile } from "@/lib/storage";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const allFiles = [...files];
    if (singleFile && !allFiles.includes(singleFile)) {
      allFiles.push(singleFile);
    }

    if (allFiles.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded. Please choose one or more image files." },
        { status: 400 }
      );
    }

    const category = (formData.get("category") as string) || "General";
    const db = getDb();
    const uploadedRecords = [];

    for (const file of allFiles) {
      if (typeof file === "string" || !file.name) continue;

      const uploadResult = await saveUploadedFile(file);
      const [inserted] = await db
        .insert(mediaItems)
        .values({
          title: file.name.replace(/\.[^/.]+$/, ""),
          altText: file.name.replace(/\.[^/.]+$/, ""),
          caption: "",
          url: uploadResult.url,
          storageType: uploadResult.storageType,
          publicId: uploadResult.publicId,
          category,
          fileSize: uploadResult.fileSize,
          mimeType: uploadResult.mimeType,
          sortOrder: 0,
        })
        .returning();

      uploadedRecords.push({
        ...inserted,
        createdAt: inserted.createdAt.toISOString(),
      });
    }

    revalidateTag(CACHE_TAGS.media, { expire: 0 });

    return NextResponse.json({
      success: true,
      items: uploadedRecords,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Image upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
