// Redis client for whatever the project has connected. Supports both shapes:
// a TCP connection string (REDIS_URL / KV_URL — Redis Cloud's Vercel
// integration) via node-redis, and Upstash's REST API (KV_REST_API_URL/TOKEN)
// via plain fetch, so switching providers later doesn't need a rewrite here.
import { createClient, type RedisClientType } from "redis";

const REDIS_URL = process.env.REDIS_URL || process.env.KV_URL;
const REST_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const KV_ENABLED = Boolean(REDIS_URL || (REST_URL && REST_TOKEN));

let client: RedisClientType | null = null;
let connecting: Promise<RedisClientType> | null = null;

// Serverless-safe: reuses the same connection across warm invocations of this
// module instance, reconnects lazily if it ever drops.
async function getClient(): Promise<RedisClientType> {
  if (client?.isOpen) return client;
  if (!connecting) {
    connecting = (async () => {
      const c: RedisClientType = createClient({ url: REDIS_URL });
      c.on("error", () => {
        client = null; // next call reconnects instead of throwing into the void
      });
      await c.connect();
      client = c;
      return c;
    })().finally(() => {
      connecting = null;
    });
  }
  return connecting;
}

async function kvOverRest<T>(command: (string | number)[]): Promise<T> {
  const res = await fetch(REST_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${REST_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const body = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || body.error) throw new Error(body.error || `KV ${res.status}`);
  return body.result as T;
}

// node-redis negotiates RESP3 by default against Redis 7+, where a
// hash/set reply comes back as a native Map/Set instead of RESP2's flat
// array — sendCommand doesn't run a command-specific reply transform, so it
// hands back whatever the protocol produced. Callers (loadAllNames,
// loadTopicStates) expect the flat array shape either way, so normalize here
// rather than in every caller.
function normalizeReply(raw: unknown): unknown {
  if (raw instanceof Map) {
    const flat: string[] = [];
    for (const [k, v] of raw) flat.push(String(k), String(v));
    return flat;
  }
  if (raw instanceof Set) return Array.from(raw, String);
  return raw;
}

async function kvOverRedis<T>(command: (string | number)[]): Promise<T> {
  const c = await getClient();
  const raw = await c.sendCommand(command.map(String));
  return normalizeReply(raw) as T;
}

export async function kv<T = unknown>(...command: (string | number)[]): Promise<T> {
  if (!KV_ENABLED) throw new Error("KV not configured");
  return REDIS_URL ? kvOverRedis<T>(command) : kvOverRest<T>(command);
}
