/**
 * SHA-256 hash chain utilities using Web Crypto API.
 * Browser & Node 19+ compatible.
 */

export async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(buffer);
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface ProofEvent {
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
  previousHash: string;
  currentHash: string;
}

export async function buildHashChain(
  events: Array<Omit<ProofEvent, "previousHash" | "currentHash">>
): Promise<ProofEvent[]> {
  const chain: ProofEvent[] = [];
  let prevHash = "0".repeat(64);
  for (const ev of events) {
    const payload = JSON.stringify({
      event: ev.event,
      timestamp: ev.timestamp,
      data: ev.data,
      previousHash: prevHash,
    });
    const currentHash = await sha256(payload);
    chain.push({ ...ev, previousHash: prevHash, currentHash });
    prevHash = currentHash;
  }
  return chain;
}

export async function verifyHashChain(chain: ProofEvent[]): Promise<boolean> {
  let prevHash = "0".repeat(64);
  for (const ev of chain) {
    if (ev.previousHash !== prevHash) return false;
    const payload = JSON.stringify({
      event: ev.event,
      timestamp: ev.timestamp,
      data: ev.data,
      previousHash: prevHash,
    });
    const expected = await sha256(payload);
    if (expected !== ev.currentHash) return false;
    prevHash = ev.currentHash;
  }
  return true;
}

export function shortHash(hash: string, head = 6, tail = 4): string {
  if (hash.length <= head + tail + 3) return hash;
  return `0x${hash.slice(0, head)}...${hash.slice(-tail)}`;
}
