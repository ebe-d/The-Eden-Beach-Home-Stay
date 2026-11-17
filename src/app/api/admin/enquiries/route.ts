import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-helpers";
import { queryFilteredEnquiries } from "@/lib/enquiry-query";

export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const rows = await queryFilteredEnquiries(searchParams);
  return NextResponse.json({ enquiries: rows });
}

