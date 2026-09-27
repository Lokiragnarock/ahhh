// Minimal Upstash Redis REST client (what Vercel's Redis/KV integration
// provisions). No SDK: each call is one POST of a Redis command as JSON.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const KV_ENABLED = Boolean(URL_ && TOKEN);

export async function kv<T = unknown>(...command: (string | number)[]): Promise<T> {
  if (!KV_ENABLED) throw new Error("KV not configured");
  const res = await fetch(URL_!, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const body = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || body.error) throw new Error(body.error || `KV ${res.status}`);
  return body.result as T;
}
