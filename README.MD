# Wardrobe.app

A clean, minimal digital wardrobe to catalog items, build outfits, and plan what to wear next.

## Quick start

```bash
npm install
npm run dev
```

Open https://wardrope-five.vercel.app/setup

## Data modes

The MVP ships in **local** mode by default (localStorage persistence). To connect Supabase:

1. Update `.env.local` with your Supabase credentials.
2. Set `NEXT_PUBLIC_DATA_MODE=supabase`.
3. Ensure your Supabase tables match the fields used in `src/server/supabase/queries.ts`.

> Note: If you enable Supabase, the app uses API routes and a service role key. Configure Row Level Security accordingly.

## Project structure

- `src/app` thin route entrypoints and API handlers
- `src/features` domain-owned screens, components, hooks, and local helpers
- `src/shared` reusable UI, config, types, styles, and utilities
- `src/server` Supabase and server-only helpers

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
