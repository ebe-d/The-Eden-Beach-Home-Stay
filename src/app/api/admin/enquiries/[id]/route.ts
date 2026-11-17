import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { enquiries } from "@/db/schema";
import { parsePositiveIntId, requireAdminApi } from "@/lib/api-helpers";
import { enquiryUpdateSchema } from "@/lib/validation";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id: rawId } = await context.params;
  const id = parsePositiveIntId(rawId);
  if (!id) {
    return NextResponse.json({ error: "Invalid enquiry ID." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = enquiryUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid update payload." },
      { status: 400 }
    );
  }

  const updates: {
    status?: string;
    internalNotes?: string;
    updatedAt: Date;
  } = { updatedAt: new Date() };

  if (parsed.data.status !== undefined) {
    updates.status = parsed.data.status;
  }
  if (parsed.data.internalNotes !== undefined) {
    updates.internalNotes = parsed.data.internalNotes;
  }

  const db = getDb();
  const [updated] = await db
    .update(enquiries)
    .set(updates)
    .where(eq(enquiries.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  }

  return NextResponse.json({ enquiry: updated });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id: rawId } = await context.params;
  const id = parsePositiveIntId(rawId);
  if (!id) {
    return NextResponse.json({ error: "Invalid enquiry ID." }, { status: 400 });
  }

  const db = getDb();
  const [deleted] = await db
    .delete(enquiries)
    .where(eq(enquiries.id, id))
    .returning({ id: enquiries.id });

  if (!deleted) {
    return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

