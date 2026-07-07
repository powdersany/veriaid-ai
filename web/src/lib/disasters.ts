/**
 * BMKG earthquake data fetcher for VeriAid disaster news feed.
 * Sources:
 *   - Latest earthquake: https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json
 *   - Recent felt earthquakes: https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json
 *   - Shakemap images: https://data.bmkg.go.id/DataMKG/TEWS/{filename}
 *
 * No authentication required. Data is government-published (BMKG).
 */

// --- Types ---

export interface BmkgGempa {
  Tanggal: string; // "28 Jun 2026"
  Jam: string; // "04:10:33 WIB"
  DateTime: string; // ISO 8601
  Coordinates: string; // "-6.24,104.74"
  Lintang: string; // "6.24 LS"
  Bujur: string; // "104.74 BT"
  Magnitude: string; // "4.9"
  Kedalaman: string; // "25 km"
  Wilayah: string; // "Pusat gempa berada di laut 82 km selatan Tanggamus"
  Potensi?: string; // "Gempa ini dirasakan untuk diteruskan pada masyarakat"
  Dirasakan?: string; // "III Kota Agung , III Tanggamus, II Bandar Lampung"
  Shakemap?: string; // "20260628041033.mmi.jpg"
}

export interface DisasterEvent {
  id: string; // BMKG timestamp id, e.g. "20260628041033"
  title: string; // "Gempa M4.9 — Tanggamus, Lampung"
  magnitude: number;
  depth: string;
  location: string; // human-readable region
  coordinates: string;
  feltIn: string; // "III Kota Agung, III Tanggamus"
  date: string; // "28 Jun 2026"
  time: string; // "04:10 WIB"
  dateTime: string; // ISO
  imageUrl: string; // full shakemap URL or empty
  source: "BMKG";
  sourceUrl: string; // link back to BMKG
}

// --- Constants ---

const BMKG_BASE = "https://data.bmkg.go.id/DataMKG/TEWS";
const BMKG_AUTO = `${BMKG_BASE}/autogempa.json`;
const BMKG_FELT = `${BMKG_BASE}/gempadirasakan.json`;

// Fallback placeholder when shakemap unavailable
const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' fill='none'%3E%3Crect width='640' height='360' rx='8' fill='%230F4C5C'/%3E%3Ctext x='320' y='170' text-anchor='middle' fill='%232BA9A9' font-family='Inter,sans-serif' font-size='48' font-weight='700'%3EM%3C/text%3E%3Ctext x='320' y='210' text-anchor='middle' fill='%239CA3AF' font-family='Inter,sans-serif' font-size='14'%3EShakemap BMKG%3C/text%3E%3C/svg%3E";

// --- Helpers ---

function shortLocation(wilayah: string): string {
  // "Pusat gempa berada di laut 82 km selatan Tanggamus" → "Tanggamus, Lampung"
  // Try to extract the last meaningful place name
  const parts = wilayah.split(/\s+/);
  const lastWords = parts.slice(-3).join(" ");
  // If it ends with ", Provinsi" pattern, clean it up
  return wilayah
    .replace(/^Pusat gempa berada di\s+/i, "")
    .replace(/^laut\s+/i, "Laut ")
    .replace(/^darat\s+/i, "")
    .trim();
}

function extractIdFromShakemap(shakemap?: string, dateTime?: string, coordinates?: string): string {
  if (!shakemap) {
    const fromDate = dateTime?.replace(/\D/g, "");
    const fromCoordinates = coordinates?.replace(/[^\d-]/g, "");
    return [fromDate, fromCoordinates].filter(Boolean).join("-") || "unknown";
  }
  return shakemap.replace(/\..*$/, ""); // "20260628041033"
}

function buildTitle(magnitude: string, wilayah: string): string {
  const loc = shortLocation(wilayah);
  return `Gempa M${magnitude} — ${loc}`;
}

function formatTime(jam: string): string {
  // "04:10:33 WIB" → "04:10 WIB"
  return jam.replace(/:\d{2}(\s)/, "$1");
}

function gempaToEvent(g: BmkgGempa): DisasterEvent {
  const id = extractIdFromShakemap(g.Shakemap, g.DateTime, g.Coordinates);
  return {
    id,
    title: buildTitle(g.Magnitude, g.Wilayah),
    magnitude: parseFloat(g.Magnitude),
    depth: g.Kedalaman,
    location: shortLocation(g.Wilayah),
    coordinates: g.Coordinates,
    feltIn: g.Dirasakan || "-",
    date: g.Tanggal,
    time: formatTime(g.Jam),
    dateTime: g.DateTime,
    imageUrl: g.Shakemap ? `${BMKG_BASE}/${g.Shakemap}` : PLACEHOLDER_IMG,
    source: "BMKG",
    sourceUrl: `https://www.bmkg.go.id/gempabumi.html`,
  };
}

// --- Public API ---

/**
 * Fetch the latest earthquake from BMKG.
 * Returns null on network error (graceful degradation).
 */
export async function fetchLatestEarthquake(): Promise<DisasterEvent | null> {
  try {
    const res = await fetch(BMKG_AUTO, {
      next: { revalidate: 300 }, // cache 5 min
    });
    if (!res.ok) return null;
    const data = await res.json();
    const g: BmkgGempa = data?.Infogempa?.gempa;
    if (!g) return null;
    return gempaToEvent(g);
  } catch {
    return null;
  }
}

/**
 * Fetch recent felt earthquakes (typically 10-20 entries).
 * Returns empty array on network error.
 */
export async function fetchRecentEarthquakes(): Promise<DisasterEvent[]> {
  try {
    const res = await fetch(BMKG_FELT, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list: BmkgGempa[] = data?.Infogempa?.gempa ?? [];
    return list.map(gempaToEvent);
  } catch {
    return [];
  }
}

/**
 * Get magnitude color class for badge display.
 */
export function magnitudeColor(mag: number): string {
  if (mag >= 6) return "bg-red-600 text-white";
  if (mag >= 5) return "bg-orange-500 text-white";
  if (mag >= 4) return "bg-amber-500 text-white";
  return "bg-teal-600 text-white";
}

/**
 * Get magnitude severity label.
 */
export function magnitudeSeverity(mag: number): string {
  if (mag >= 6) return "Kuat";
  if (mag >= 5) return "Sedang";
  if (mag >= 4) return "Ringan";
  return "Sangat Ringan";
}
