import { NextResponse } from "next/server";
import { getDb, isDatabaseConfigured } from "@/db";
import { availabilityBlocks, enquiries } from "@/db/schema";
import { dbNotConfiguredResponse } from "@/lib/api-helpers";
import { enquiryCreateSchema, staysOverlapBlock } from "@/lib/validation";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return dbNotConfiguredResponse();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = enquiryCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message || "Please check your enquiry details.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const db = getDb();

  try {
    const blocks = await db.select().from(availabilityBlocks);
    const conflict = blocks.find((b) =>
      staysOverlapBlock(data.checkIn, data.checkOut, b.startDate, b.endDate)
    );

    if (conflict) {
      return NextResponse.json(
        {
          error: `The requested dates (${data.checkIn} to ${data.checkOut}) overlap with dates marked "${conflict.status}" (${conflict.startDate} to ${conflict.endDate}). Please choose different dates or contact us directly.`,
        },
        { status: 409 }
      );
    }

    const [created] = await db
      .insert(enquiries)
      .values({
        guestName: data.guestName,
        phone: data.phone,
        email: data.email,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: data.guests,
        packageType: data.packageType,
        addonBeds: data.addonBeds,
        specialRequests: data.specialRequests,
        status: "New",
        internalNotes: "",
        source: data.source,
      })
      .returning({ id: enquiries.id, status: enquiries.status });

    return NextResponse.json(
      {
        id: created.id,
        status: created.status,
        message:
          "Enquiry received. Remember: submitting an enquiry does not confirm a booking. The owner will contact you with availability and pricing.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Failed to save enquiry:", err);
    return NextResponse.json(
      { error: "Could not submit your enquiry right now. Please try again shortly." },
      { status: 500 }
    );
  }
}

