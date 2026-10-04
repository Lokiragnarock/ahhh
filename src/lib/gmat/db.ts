import { neon } from "@neondatabase/serverless";

// Server-only Postgres access, replacing the Supabase service-role client.
//
// Neon's HTTP driver is used rather than a TCP pool because these are Next
// route handlers on Vercel: every invocation is a fresh, short-lived function,
// and a pool would spend its life opening and discarding connections. HTTP has
// no connection to keep alive.
//
// Note on shape: the old client spoke PostgREST, so every value arrived as JSON.
// This one speaks Postgres, so `timestamptz` comes back as a Date. That is
// harmless — the API routes hand rows to NextResponse.json(), which serialises
// a Date to the same ISO string the client used to receive, and the dashboard
// wraps created_at in new Date() either way. The exception is `date` columns,
// where a Date would be built at local midnight and could render a day off, so
// schedule queries cast those to text and keep the plain 'YYYY-MM-DD' string.
//
// DATABASE_URL has no NEXT_PUBLIC_ prefix, so Next will refuse to bundle it
// into client code — the same protection the service-role key relied on.

let client: ReturnType<typeof neon> | null = null;

export function db() {
  if (client) return client;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Missing DATABASE_URL. Set it to the Neon pooled connection string " +
        "(the one containing '-pooler') in .env.local and in the Vercel " +
        "project's environment variables."
    );
  }

  client = neon(url);
  return client;
}
