import { sql } from "drizzle-orm";
import type { getDb } from "./index";
import { themes, themeSettings } from "./schema";
import { DEFAULT_THEMES } from "./defaults";

let hasMigrated = false;

async function executeSafe(db: ReturnType<typeof getDb>, query: any) {
  try {
    await db.execute(query);
  } catch (err: any) {
    // Ignore duplicate table / type creation races in concurrent Next.js build workers
    if (err?.code === "23505" || err?.code === "42P07") {
      return;
    }
  }
}

export async function ensureCmsTablesExist(db: ReturnType<typeof getDb>) {
  if (hasMigrated) return;

  // 1. homepage_content table
  await executeSafe(
    db,
    sql`
      CREATE TABLE IF NOT EXISTS homepage_content (
        id INTEGER PRIMARY KEY DEFAULT 1,
        hero_title TEXT NOT NULL,
        hero_subtitle TEXT NOT NULL,
        hero_image_url TEXT NOT NULL,
        hero_slides_json JSONB NOT NULL DEFAULT '[]'::jsonb,
        welcome_heading TEXT NOT NULL,
        welcome_text TEXT NOT NULL,
        welcome_images_json JSONB NOT NULL DEFAULT '[]'::jsonb,
        experiences_json JSONB NOT NULL DEFAULT '[]'::jsonb,
        sections_visibility_json JSONB NOT NULL,
        is_published BOOLEAN NOT NULL DEFAULT true,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `
  );

  // 2. rooms table
  await executeSafe(
    db,
    sql`
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        short_description TEXT NOT NULL,
        full_description TEXT NOT NULL DEFAULT '',
        capacity_guests INTEGER NOT NULL DEFAULT 4,
        bed_info TEXT NOT NULL DEFAULT '2 Main Beds + 2 Optional Add-on Beds',
        pricing_note TEXT NOT NULL DEFAULT 'Prices provided upon enquiry',
        image_url TEXT NOT NULL,
        gallery_images_json JSONB NOT NULL DEFAULT '[]'::jsonb,
        facilities_json JSONB NOT NULL DEFAULT '[]'::jsonb,
        is_featured BOOLEAN NOT NULL DEFAULT true,
        is_visible BOOLEAN NOT NULL DEFAULT true,
        sort_order INTEGER NOT NULL DEFAULT 1,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `
  );

  // 3. media_items table
  await executeSafe(
    db,
    sql`
      CREATE TABLE IF NOT EXISTS media_items (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        caption TEXT NOT NULL DEFAULT '',
        alt_text TEXT NOT NULL DEFAULT '',
        url TEXT NOT NULL,
        storage_type TEXT NOT NULL DEFAULT 'local',
        public_id TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL DEFAULT 'General',
        is_featured_homepage BOOLEAN NOT NULL DEFAULT false,
        sort_order INTEGER NOT NULL DEFAULT 0,
        file_size INTEGER NOT NULL DEFAULT 0,
        mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `
  );

  // 4. about_content table
  await executeSafe(
    db,
    sql`
      CREATE TABLE IF NOT EXISTS about_content (
        id INTEGER PRIMARY KEY DEFAULT 1,
        heading TEXT NOT NULL,
        intro TEXT NOT NULL,
        full_description TEXT NOT NULL,
        images_json JSONB NOT NULL DEFAULT '[]'::jsonb,
        highlights_json JSONB NOT NULL DEFAULT '[]'::jsonb,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `
  );

  // 5. seo_settings table
  await executeSafe(
    db,
    sql`
      CREATE TABLE IF NOT EXISTS seo_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        meta_title TEXT NOT NULL,
        meta_description TEXT NOT NULL,
        keywords TEXT NOT NULL DEFAULT '',
        og_title TEXT NOT NULL DEFAULT '',
        og_description TEXT NOT NULL DEFAULT '',
        og_image_url TEXT NOT NULL DEFAULT '',
        canonical_url TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `
  );

  // 6. themes table
  await executeSafe(
    db,
    sql`
      CREATE TABLE IF NOT EXISTS themes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'preset',
        colors_json JSONB NOT NULL,
        typography_json JSONB NOT NULL,
        button_style_json JSONB NOT NULL,
        decorations_json JSONB NOT NULL,
        is_custom BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `
  );

  // 7. theme_settings table
  await executeSafe(
    db,
    sql`
      CREATE TABLE IF NOT EXISTS theme_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        active_theme_id TEXT NOT NULL DEFAULT 'default',
        manual_override BOOLEAN NOT NULL DEFAULT true,
        scheduled_theme_id TEXT,
        schedule_start_date TEXT,
        schedule_end_date TEXT,
        return_to_theme_id TEXT NOT NULL DEFAULT 'default',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `
  );

  // 8. Baseline Data Seeding for themes (if empty)
  try {
    const [themeCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(themes);
    if (Number(themeCount?.count || 0) === 0) {
      for (const t of DEFAULT_THEMES) {
        await db.insert(themes).values({
          id: t.id,
          name: t.name,
          description: t.description,
          category: t.category,
          colorsJson: t.colors,
          typographyJson: t.typography,
          buttonStyleJson: t.buttonStyle,
          decorationsJson: t.decorations,
          isCustom: t.isCustom,
        });
      }
    }
  } catch {
    // Fail gracefully on read-only or restricted environments
  }

  hasMigrated = true;
}
