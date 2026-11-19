import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Database } from "lucide-react";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { isDatabaseConfigured } from "@/db";
import { getAdminSession } from "@/lib/auth";
import {
  getAdminCoastGuides,
  getAdminEnquiries,
  getAdminGalleryImages,
  getAdminRooms,
  readAboutContentUncached,
  readAvailabilityBlocksUncached,
  readHomepageContentUncached,
  readMediaItemsUncached,
  readSeoSettingsUncached,
  readSiteSettingsUncached,
  readThemesUncached,
  readThemeSettingsUncached,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Owner Admin Dashboard",
  robots: { index: false, follow: false },
};

async function AdminWorkspaceLoader() {
  await connection();
  const session = await getAdminSession();
  if (!session.authenticated || !session.username) {
    redirect("/admin/login");
  }

  if (!isDatabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="glass-card rounded-[30px] p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-eden-btn text-eden-btn-ink">
            <Database className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-eden-ink">
            Connect PostgreSQL to Unlock Admin Operations
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-eden-muted">
            You are signed in as <strong className="text-eden-ink">{session.username}</strong>, and the
            PostgreSQL schema is ready. Add your{" "}
            <code className="rounded bg-eden-inset px-1.5 py-0.5 text-xs text-eden-ink">
              DATABASE_URL
            </code>{" "}
            to <code className="rounded bg-eden-inset px-1.5 py-0.5 text-xs text-eden-ink">.env.local</code>{" "}
            and push the schema:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-[#070D18] border border-[#C5A059]/25 p-4 text-xs text-[#DFBA73]">
            {`npm run db:push\nnpm run db:seed`}
          </pre>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-eden-btn px-5 py-2.5 text-xs font-semibold text-eden-btn-ink"
          >
            Back to Public Site
          </Link>
        </div>
      </div>
    );
  }

  const [
    enquiries,
    settings,
    gallery,
    coastGuides,
    availability,
    homepage,
    rooms,
    media,
    about,
    seo,
    themesList,
    themeSettingsData,
  ] = await Promise.all([
    getAdminEnquiries(),
    readSiteSettingsUncached(),
    getAdminGalleryImages(),
    getAdminCoastGuides(),
    readAvailabilityBlocksUncached(),
    readHomepageContentUncached(),
    getAdminRooms(),
    readMediaItemsUncached(),
    readAboutContentUncached(),
    readSeoSettingsUncached(),
    readThemesUncached(),
    readThemeSettingsUncached(),
  ]);

  return (
    <AdminDashboardClient
      initialData={{
        username: session.username,
        enquiries: enquiries.map((row) => ({
          ...row,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        })),
        settings,
        gallery,
        coastGuides,
        availability,
        homepage,
        rooms,
        media,
        about,
        seo,
        themes: themesList,
        themeSettings: themeSettingsData,
      }}
    />
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-eden-muted">
          Loading Owner Dashboard...
        </div>
      }
    >
      <AdminWorkspaceLoader />
    </Suspense>
  );
}

