import { NextResponse } from "next/server";
import { readAvailabilityBlocksUncached } from "@/lib/data";

export async function GET() {
  const blocks = await readAvailabilityBlocksUncached();
  // Return only non-sensitive date ranges and public status labels
  return NextResponse.json({
    blocks: blocks.map((b) => ({
      id: b.id,
      startDate: b.startDate,
      endDate: b.endDate,
      status: b.status,
    })),
  });
}

