import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import {
  AdminAuthSetupAlert,
  AdminLoginClient,
} from "@/components/admin/AdminLoginClient";
import { isAdminAuthConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Owner Login",
  robots: { index: false, follow: false },
};

async function RuntimeAuthBanner() {
  await cookies();
  const authStatus = isAdminAuthConfigured();
  if (authStatus.configured) return null;
  return <AdminAuthSetupAlert reason={authStatus.reason} />;
}

export default function AdminLoginPage() {
  return (
    <AdminLoginClient
      authBanner={
        <Suspense fallback={null}>
          <RuntimeAuthBanner />
        </Suspense>
      }
    />
  );
}

