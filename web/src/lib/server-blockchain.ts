/**
 * SHA-256 hash chain (server-side).
 * Same semantics as web/src/lib/hash.ts but uses Node's crypto for speed.
 *
 * Chain rule: currentHash = SHA256(JSON({event, timestamp, data, previousHash}))
 * Genesis previousHash is "0" repeated 64 times.
 */
import { createHash } from "node:crypto";

export interface ProofEvent {
  event: string;
  eventType?: string;
  timestamp: string;
  data: Record<string, unknown>;
  previousHash: string;
  currentHash: string;
  sequence: number;
}

const GENESIS = "0".repeat(64);

function sha256(message: string): string {
  return createHash("sha256").update(message).digest("hex");
}

export interface ChainInput {
  eventType: string;
  data: Record<string, unknown>;
  timestamp?: Date;
  sequence: number;
}

/**
 * Compute the hash for a single event given previousHash.
 * Deterministic — same inputs always produce the same hash.
 */
export function computeEventHash(
  eventType: string,
  timestamp: Date | string,
  data: Record<string, unknown>,
  previousHash: string,
): string {
  const ts = typeof timestamp === "string" ? timestamp : timestamp.toISOString();
  const payload = JSON.stringify({
    event: eventType,
    timestamp: ts,
    data,
    previousHash,
  });
  return sha256(payload);
}

/**
 * Verify a chain's integrity. Returns null if valid, or the index of the
 * first broken event if invalid.
 */
export function verifyChain(events: ProofEvent[]): number | null {
  let prev = GENESIS;
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    if (ev.previousHash !== prev) return i;
    const expected = computeEventHash(ev.event, ev.timestamp, ev.data, prev);
    if (expected !== ev.currentHash) return i;
    prev = ev.currentHash;
  }
  return null;
}

export { GENESIS };

/** Display helper: 0xABCD...WXYZ */
export function shortHash(hash: string, head = 6, tail = 4): string {
  if (hash.length <= head + tail + 3) return hash;
  return `0x${hash.slice(0, head)}...${hash.slice(-tail)}`;
}
