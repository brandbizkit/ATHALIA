# ATHALIA

A premium marketplace prototype for verified, human-made physical art. Built with Next.js and designed around the supplied product brief.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The current build includes a responsive gallery using the supplied artwork and process footage, dual poster/original commerce, size-based poster pricing, an artwork provenance page, cart feedback, and a validated three-step artist submission demo. No credentials are required for the demo.

Artists can open `/studio` to log in and manage their public profile, biography, artist statement, social links, visibility, portrait, and cover image. Without Supabase environment variables the studio runs in local demo mode; with Supabase configured, accounts, profile updates, and uploads persist securely using row-level security.

## Production setup

1. Copy `.env.example` to `.env.local` and add Supabase and Stripe credentials.
2. Run `supabase/schema.sql` in a Supabase project.
3. Create private `masters`, `provenance`, and `products` buckets plus a public `previews` bucket.
4. Connect upload submission to signed Supabase Storage uploads.
5. Add a queue worker (Sharp + FFprobe) to verify 4000px/300 DPI targets, create 2:3, 3:4, 4:5 and ISO files, and package the provenance ZIP.
6. Create Stripe Connect Express accounts for artists and use destination charges with the commission recorded on each order.
7. Fulfill downloads only after a verified Stripe webhook and return expiring signed URLs.

The schema includes artists, referral commission rewards, artworks, poster size options, one-off original inventory, typed poster/original orders, derived files, and row-level security foundations.
