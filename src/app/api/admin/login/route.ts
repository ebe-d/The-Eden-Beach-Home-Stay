import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_COOKIE_NAME,
  createSessionToken,
  shouldUseSecureCookie,
  verifyAdminCredentials,
} from "@/lib/auth";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Username and password required." },
      { status: 400 }
    );
  }

  const verification = await verifyAdminCredentials(
    parsed.data.username,
    parsed.data.password
  );

  if (!verification.ok) {
    return NextResponse.json(
      { error: verification.reason || "Invalid credentials." },
      { status: 401 }
    );
  }

  const token = createSessionToken(parsed.data.username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

