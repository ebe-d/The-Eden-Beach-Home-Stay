import assert from "node:assert/strict";
import {
  createSessionToken,
  hashPasswordScrypt,
  isValidScryptHash,
  shouldUseSecureCookie,
  verifyAdminCredentials,
  verifyPasswordScrypt,
  verifySessionToken,
} from "../lib/auth";
import { serializeEnquiriesCsv } from "../lib/csv";
import {
  enquiryCreateSchema,
  getTodayIsoDate,
  staysOverlapBlock,
} from "../lib/validation";
import {
  buildWhatsappMessage,
  buildWhatsappUrl,
  normalizeWhatsappNumber,
} from "../lib/whatsapp";

function run() {
  // 1. Central WHATSAPP_NUMBER blank behavior
  assert.equal(normalizeWhatsappNumber(""), "");
  assert.equal(normalizeWhatsappNumber("   "), "");
  assert.equal(buildWhatsappUrl("", { guestName: "Asha" }), null);

  // 2. Valid WHATSAPP_NUMBER encoding
  const url = buildWhatsappUrl("+91 98765-43210", {
    guestName: "Rohan & Priya",
    checkIn: "2026-12-20",
    checkOut: "2026-12-22",
    guests: 3,
    addonBeds: 1,
    packageType: "Breakfast + Dinner",
    specialRequests: "Late afternoon arrival",
  });
  assert.ok(url && url.startsWith("https://wa.me/919876543210?text="));
  const msg = buildWhatsappMessage({
    guestName: "Rohan",
    packageType: "Room Only",
  });
  assert.match(msg, /Request|current price and availability|quote/i);

  // 3. Enquiry validation rules (dates + max 4 guests + max 2 add-on beds)
  const today = getTodayIsoDate();
  const futureYear = Number(today.slice(0, 4)) + 1;

  const valid = enquiryCreateSchema.safeParse({
    guestName: "Ananya Rao",
    phone: "+91 9900112233",
    email: "",
    checkIn: `${futureYear}-01-10`,
    checkOut: `${futureYear}-01-12`,
    guests: 4,
    packageType: "Breakfast + Lunch",
    addonBeds: 2,
    specialRequests: "Quiet room please",
  });
  assert.equal(valid.success, true);

  const tooManyGuests = enquiryCreateSchema.safeParse({
    guestName: "Ananya Rao",
    phone: "+91 9900112233",
    checkIn: `${futureYear}-01-10`,
    checkOut: `${futureYear}-01-12`,
    guests: 5,
    packageType: "Room Only",
    addonBeds: 0,
  });
  assert.equal(tooManyGuests.success, false);

  const badDates = enquiryCreateSchema.safeParse({
    guestName: "Ananya Rao",
    phone: "+91 9900112233",
    checkIn: `${futureYear}-01-15`,
    checkOut: `${futureYear}-01-15`,
    guests: 2,
    packageType: "Room Only",
    addonBeds: 0,
  });
  assert.equal(badDates.success, false);

  const pastDate = enquiryCreateSchema.safeParse({
    guestName: "Ananya Rao",
    phone: "+91 9900112233",
    checkIn: "2020-01-01",
    checkOut: "2020-01-03",
    guests: 2,
    packageType: "Room Only",
    addonBeds: 0,
  });
  assert.equal(pastDate.success, false);

  // 4. Availability overlap logic
  assert.equal(
    staysOverlapBlock("2026-12-10", "2026-12-12", "2026-12-11", "2026-12-14"),
    true
  );
  assert.equal(
    staysOverlapBlock("2026-12-10", "2026-12-12", "2026-12-12", "2026-12-14"),
    false
  );

  // 5. Auth scrypt & signed session token
  const hash = hashPasswordScrypt("CoastalEscape#2026");
  assert.equal(verifyPasswordScrypt("CoastalEscape#2026", hash), true);
  assert.equal(verifyPasswordScrypt("wrong-password", hash), false);

  process.env.ADMIN_SESSION_SECRET = "test-secret-minimum-32-characters-long";
  const token = createSessionToken("owner");
  const verified = verifySessionToken(token);
  assert.equal(verified.valid, true);
  assert.equal(verified.username, "owner");
  assert.equal(verifySessionToken(`${token}tampered`).valid, false);

  // 6. CSV formula-injection neutralization
  const csv = serializeEnquiriesCsv([
    {
      id: 1,
      guestName: "=CMD('calc')",
      phone: "+919876543210",
      email: "guest@example.com",
      checkIn: "2026-12-10",
      checkOut: "2026-12-12",
      guests: 2,
      packageType: "Room Only",
      addonBeds: 0,
      specialRequests: 'Line 1, "quoted"',
      status: "New",
      internalNotes: "",
      source: "web_form",
      createdAt: "2026-12-01T10:00:00.000Z",
    },
  ]);
  assert.ok(csv.includes("'=CMD('calc')"));
  assert.ok(csv.includes("'+919876543210"));
  assert.ok(csv.includes('"Line 1, ""quoted"""'));

  console.log("All core domain, security, WhatsApp, validation, and CSV checks passed.");
}

async function runAsyncAuthChecks() {
  assert.equal(isValidScryptHash(hashPasswordScrypt("CoastalEscape#2026")), true);
  assert.equal(
    isValidScryptHash(
      "a7a06fa000000000000000000000000000000000000000000000000000000000"
    ),
    false
  );
  assert.equal(isValidScryptHash(""), false);

  assert.equal(
    shouldUseSecureCookie(new Request("http://127.0.0.1:3000/api/admin/login")),
    false
  );
  assert.equal(
    shouldUseSecureCookie(new Request("https://theeden.example.com/api/admin/login")),
    true
  );
  assert.equal(
    shouldUseSecureCookie(
      new Request("http://127.0.0.1:3000/api/admin/login", {
        headers: { "x-forwarded-proto": "https" },
      })
    ),
    true
  );

  const origDb = process.env.DATABASE_URL;
  const origUser = process.env.ADMIN_USERNAME;
  const origHash = process.env.ADMIN_PASSWORD_HASH;
  const origPass = process.env.ADMIN_PASSWORD;
  try {
    process.env.DATABASE_URL = "";
    process.env.ADMIN_USERNAME = "owner";
    // Non-scrypt hash must not block configured ADMIN_PASSWORD fallback
    process.env.ADMIN_PASSWORD_HASH =
      "a7a06fa000000000000000000000000000000000000000000000000000000000";
    process.env.ADMIN_PASSWORD = "fallback-password";
    assert.equal(
      (await verifyAdminCredentials("owner", "fallback-password")).ok,
      true
    );
    assert.equal(
      (await verifyAdminCredentials("owner", "wrong-password")).ok,
      false
    );

    // Valid scrypt hash must be enforced strictly and never fall back to ADMIN_PASSWORD
    process.env.ADMIN_PASSWORD_HASH = hashPasswordScrypt("scrypt-secret-pass");
    assert.equal(
      (await verifyAdminCredentials("owner", "scrypt-secret-pass")).ok,
      true
    );
    assert.equal(
      (await verifyAdminCredentials("owner", "fallback-password")).ok,
      false
    );
  } finally {
    process.env.DATABASE_URL = origDb;
    process.env.ADMIN_USERNAME = origUser;
    process.env.ADMIN_PASSWORD_HASH = origHash;
    process.env.ADMIN_PASSWORD = origPass;
  }

  console.log("All async auth fallback and cookie checks passed.");
}

run();
runAsyncAuthChecks().catch((err) => {
  console.error(err);
  process.exit(1);
});

