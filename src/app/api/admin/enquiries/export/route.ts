import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-helpers";
import { serializeEnquiriesCsv } from "@/lib/csv";
import { queryFilteredEnquiries } from "@/lib/enquiry-query";

export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const rows = await queryFilteredEnquiries(searchParams);
  const csv = serializeEnquiriesCsv(rows);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="the-eden-enquiries.csv"',
      "Cache-Control": "no-store",
    },
  });
}

