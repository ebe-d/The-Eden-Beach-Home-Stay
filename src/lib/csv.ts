function escapeCsvCell(value: unknown): string {
  let str = String(value ?? "");
  // Neutralize CSV/Excel formula injection
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function serializeEnquiriesCsv(
  rows: Array<{
    id: number;
    guestName: string;
    phone: string;
    email: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    packageType: string;
    addonBeds: number;
    specialRequests: string;
    status: string;
    internalNotes: string;
    source: string;
    createdAt: Date | string;
  }>
): string {
  const headers = [
    "ID",
    "Guest Name",
    "Phone",
    "Email",
    "Check-In",
    "Check-Out",
    "Guests",
    "Package",
    "Add-on Beds",
    "Special Requests",
    "Status",
    "Internal Notes",
    "Source",
    "Submitted At",
  ];

  const lines = [headers.map(escapeCsvCell).join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.id,
        row.guestName,
        row.phone,
        row.email,
        row.checkIn,
        row.checkOut,
        row.guests,
        row.packageType,
        row.addonBeds,
        row.specialRequests,
        row.status,
        row.internalNotes,
        row.source,
        row.createdAt instanceof Date
          ? row.createdAt.toISOString()
          : String(row.createdAt),
      ]
        .map(escapeCsvCell)
        .join(",")
    );
  }

  return lines.join("\r\n");
}

