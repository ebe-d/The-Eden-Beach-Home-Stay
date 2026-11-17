# The Eden – Beach Homestay

SEO-friendly Next.js (App Router) + PostgreSQL (Drizzle ORM) website and Owner Admin Dashboard for **The Eden – Beach Homestay** in **Murdeshwar, Karnataka, India – 581350**.

## Key Rules Enforced

- **No Public Pricing**: Room tariffs, package prices, add-on bed charges, and optional beverage prices are never shown publicly. All quotes are handled on enquiry only.
- **Single Private Room**: One private beachfront room with 2 main beds + up to 2 optional add-on beds, accommodating a maximum of 4 guests.
- **Central `WHATSAPP_NUMBER`**: Stored in PostgreSQL (`site_settings.whatsapp_number`, editable in Admin) with fallback to `WHATSAPP_NUMBER` env var, initially blank. When blank, clicking any WhatsApp enquiry CTA shows `"WhatsApp booking contact will be available soon"` alongside the booking enquiry form.
- **Honest Gallery Previews**: Temporary stock images are explicitly labeled `"Stock Preview"` and never misrepresented as real property photos until replaced in Admin.
- **Coast Guide (Bhatkal to Gokarna)**: Practical descriptions, visitor notes, and Google Maps links without invented distances, opening hours, or travel durations.

## Setup & PostgreSQL Configuration

1. Copy `.env.example` to `.env.local` and configure your PostgreSQL connection string and admin secrets:

```bash
cp .env.example .env.local
```

2. Generate a random `ADMIN_SESSION_SECRET` and an `ADMIN_PASSWORD_HASH`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
npm run admin:hash -- "your-strong-owner-password"
```

3. Push the Drizzle schema to PostgreSQL (`.env.local` is loaded automatically) and seed initial settings, stock gallery placeholders, and coastal guide entries:

```bash
npm run db:push
npm run db:seed
```

4. Start the development server or build for production:

```bash
npm run dev
# or
npm run build && npm run start
```

## Important Routes

- `/` — Home (hero, homestay overview, facilities, packages preview, gallery preview, coast teaser, enquiry form)
- `/stay` — One private room specs, facilities, manual availability calendar
- `/packages` — Room Only, Breakfast + One Meal, Optional Beverages (charged separately)
- `/gallery` — Categorized photo gallery (Bedroom, Beds, Bathroom, Property, Beachfront Views, Nearby Coast)
- `/explore-the-coast` — Bhatkal, Murdeshwar, Honnavar, Kumta & Gokarna guide
- `/contact` — Location, map, contact details, and booking enquiry form
- `/admin/login` & `/admin` — Owner Admin Dashboard (enquiries CRM, CSV export, status & internal notes, manual availability blocks, gallery URL manager, tourist guide editor, `WHATSAPP_NUMBER` & contact/facilities/package editor)
