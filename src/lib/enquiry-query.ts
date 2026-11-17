import { and, desc, eq, gte, ilike, lte, or, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import { ENQUIRY_STATUSES, enquiries } from "@/db/schema";

export async function queryFilteredEnquiries(searchParams: URLSearchParams) {
  const db = getDb();
  const conditions: SQL[] = [];

  const status = searchParams.get("status")?.trim();
  if (
    status &&
    status !== "All" &&
    (ENQUIRY_STATUSES as readonly string[]).includes(status)
  ) {
    conditions.push(eq(enquiries.status, status));
  }

  const fromDate = searchParams.get("from")?.trim();
  if (fromDate && /^\d{4}-\d{2}-\d{2}$/.test(fromDate)) {
    conditions.push(gte(enquiries.checkOut, fromDate));
  }

  const toDate = searchParams.get("to")?.trim();
  if (toDate && /^\d{4}-\d{2}-\d{2}$/.test(toDate)) {
    conditions.push(lte(enquiries.checkIn, toDate));
  }

  const q = searchParams.get("q")?.trim();
  if (q) {
    const pattern = `%${q}%`;
    const searchClause = or(
      ilike(enquiries.guestName, pattern),
      ilike(enquiries.phone, pattern),
      ilike(enquiries.email, pattern),
      ilike(enquiries.specialRequests, pattern),
      ilike(enquiries.internalNotes, pattern)
    );
    if (searchClause) {
      conditions.push(searchClause);
    }
  }

  return db
    .select()
    .from(enquiries)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(enquiries.createdAt), desc(enquiries.id));
}

