CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "availability_blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"status" text DEFAULT 'Unavailable' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coast_guides" (
	"id" serial PRIMARY KEY NOT NULL,
	"destination" text NOT NULL,
	"spot_name" text NOT NULL,
	"short_description" text NOT NULL,
	"visitor_notes" text NOT NULL,
	"map_url" text NOT NULL,
	"image_url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"guest_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"check_in" text NOT NULL,
	"check_out" text NOT NULL,
	"guests" integer NOT NULL,
	"package_type" text NOT NULL,
	"addon_beds" integer DEFAULT 0 NOT NULL,
	"special_requests" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'New' NOT NULL,
	"internal_notes" text DEFAULT '' NOT NULL,
	"source" text DEFAULT 'web_form' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"caption" text DEFAULT '' NOT NULL,
	"category" text NOT NULL,
	"image_url" text NOT NULL,
	"is_stock_placeholder" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"business_name" text NOT NULL,
	"whatsapp_number" text DEFAULT '' NOT NULL,
	"contact_phone" text DEFAULT '' NOT NULL,
	"contact_email" text DEFAULT '' NOT NULL,
	"address_line" text NOT NULL,
	"map_link_url" text NOT NULL,
	"check_in_note" text NOT NULL,
	"booking_disclaimer" text NOT NULL,
	"facilities_json" jsonb NOT NULL,
	"packages_json" jsonb NOT NULL,
	"beverages_note" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
