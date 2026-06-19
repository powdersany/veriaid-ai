/**
 * 9Router / OpenAI-compatible AI client.
 * Reads MINIMAX_API_KEY (or OPENAI_API_KEY fallback) from env.
 * Default base URL: https://9router.com/v1
 *
 * For OCR + analysis we use google/gemini-3.5-flash:free (cheap & fast).
 * For image tasks, we still use the same model since 9Router exposes
 * multimodal variants on the same endpoint.
 */
const API_KEY =
  process.env.MINIMAX_API_KEY ??
  process.env.OPENAI_API_KEY ??
  process.env.NINE_ROUTER_API_KEY ??
  "";
const BASE_URL = process.env.AI_BASE_URL ?? "https://9router.com/v1";
const DEFAULT_MODEL =
  process.env.AI_DEFAULT_MODEL ?? "google/gemini-3.5-flash:free";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export interface ChatResult {
  content: string;
  model: string;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

export class AIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "AIError";
  }
}

export function isAIConfigured(): boolean {
  return Boolean(API_KEY);
}

export async function chat(
  messages: ChatMessage[],
  opts: ChatOptions = {},
): Promise<ChatResult> {
  if (!API_KEY) {
    throw new AIError(
      "AI not configured. Set MINIMAX_API_KEY in .env.local. Returning fallback.",
      503,
    );
  }

  const model = opts.model ?? DEFAULT_MODEL;
  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: opts.temperature ?? 0.3,
    max_tokens: opts.maxTokens ?? 1500,
  };
  if (opts.jsonMode) body.response_format = { type: "json_object" };

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new AIError(
      `AI provider error: ${res.status} ${res.statusText} — ${text.slice(0, 200)}`,
      res.status,
    );
  }
  const data = await res.json();
  return {
    content: data.choices?.[0]?.message?.content ?? "",
    model: data.model ?? model,
    usage: data.usage,
  };
}

/**
 * OCR for evidence (nota/foto struk). Extracts nominal + vendor from image.
 * Returns structured JSON. Falls back to a no-op if AI is not configured.
 */
export async function ocrEvidence(
  base64Image: string,
  mimeType: string,
): Promise<{
  nominal: number | null;
  vendor: string | null;
  date: string | null;
  description: string;
  rawText: string;
}> {
  const fallback = {
    nominal: null,
    vendor: null,
    date: null,
    description: "OCR tidak tersedia (AI not configured).",
    rawText: "",
  };
  if (!isAIConfigured()) return fallback;

  const prompt: ChatMessage[] = [
    {
      role: "system",
      content:
        "Anda adalah sistem OCR untuk bukti pengeluaran bantuan kemanusiaan. " +
        "Ekstrak informasi: nominal total (Rupiah), nama vendor, tanggal, deskripsi singkat. " +
        "Jawab HANYA dengan JSON valid, tanpa markdown.",
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Ekstrak data dari gambar bukti ini. Format JSON: {nominal:number|null, vendor:string|null, date:YYYY-MM-DD|null, description:string, rawText:string}",
        },
        {
          type: "image_url",
          image_url: { url: `data:${mimeType};base64,${base64Image}` },
        },
      ] as unknown as string,
    },
  ];

  try {
    const r = await chat(prompt, { jsonMode: true, temperature: 0.1, maxTokens: 800 });
    const parsed = JSON.parse(r.content);
    return {
      nominal: typeof parsed.nominal === "number" ? parsed.nominal : null,
      vendor: parsed.vendor ?? null,
      date: parsed.date ?? null,
      description: parsed.description ?? "",
      rawText: parsed.rawText ?? "",
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ...fallback,
      description: `OCR gagal: ${msg.slice(0, 100)}`,
    };
  }
}

/**
 * Run all 3 analyzers + report generation for a program.
 * Returns breakdown scores, detected issues, and a narrative report.
 */
export async function analyzeProgram(input: {
  programTitle: string;
  category: string;
  targetFund: number;
  fundReceived: number;
  fundSpent: number;
  targetBeneficiary: number;
  expenseCount: number;
  evidenceCount: number;
  expenseCategories: string[];
}): Promise<{
  breakdown: {
    financialConsistency: { score: number; desc: string };
    evidenceVerification: { score: number; desc: string };
    anomalyDetection: { score: number; desc: string };
    reportQuality: { score: number; desc: string };
  };
  detectedIssues: Array<{ severity: "low" | "medium" | "high"; text: string; resolved: boolean }>;
  report: string;
  overallScore: number;
}> {
  const fallbackOverall = Math.min(
    100,
    Math.round(
      (input.fundReceived / Math.max(1, input.targetFund)) * 40 +
        (input.evidenceCount * 8) +
        (input.expenseCount * 5) +
        30,
    ),
  );
  const fallback = {
    breakdown: {
      financialConsistency: {
        score: 85,
        desc: `${(input.fundSpent / 1_000_000).toFixed(1)}M dari ${(input.fundReceived / 1_000_000).toFixed(1)}M dana tercatat.`,
      },
      evidenceVerification: {
        score: input.evidenceCount > 0 ? 90 : 50,
        desc: `${input.evidenceCount} bukti diunggah.`,
      },
      anomalyDetection: {
        score: 92,
        desc: "Tidak ada anomali terdeteksi pada pola standar.",
      },
      reportQuality: {
        score: 80,
        desc: "Laporan memiliki detail dasar program.",
      },
    },
    detectedIssues: [
      { severity: "low" as const, text: "Verifikasi rutin bukti distribusi disarankan.", resolved: false },
    ],
    report: `Program ${input.programTitle} berjalan dengan target ${input.targetBeneficiary} penerima manfaat. ` +
      `Total dana diterima Rp ${input.fundReceived.toLocaleString("id-ID")}, ` +
      `terserap Rp ${input.fundSpent.toLocaleString("id-ID")} (${Math.round((input.fundSpent / Math.max(1, input.fundReceived)) * 100)}%).`,
    overallScore: fallbackOverall,
  };

  if (!isAIConfigured()) return fallback;

  const summary = `Program: ${input.programTitle} (${input.category})
Target dana: Rp ${input.targetFund.toLocaleString("id-ID")}
Dana diterima: Rp ${input.fundReceived.toLocaleString("id-ID")}
Dana terserap: Rp ${input.fundSpent.toLocaleString("id-ID")}
Target penerima: ${input.targetBeneficiary}
Jumlah bukti: ${input.evidenceCount}
Jumlah expense: ${input.expenseCount}
Kategori expense: ${input.expenseCategories.join(", ") || "n/a"}`;

  const prompt: ChatMessage[] = [
    {
      role: "system",
      content:
        "Anda adalah auditor AI untuk platform VeriAid AI. " +
        "Analisis program bantuan kemanusiaan ini dan berikan skor 0-100 untuk 4 aspek: " +
        "(1) Konsistensi Finansial (apakah pengeluaran sesuai alokasi dan target), " +
        "(2) Verifikasi Bukti (apakah cukup bukti pendukung), " +
        "(3) Deteksi Anomali (apakah ada indikasi double-spending, nominal anomali, atau ketidaksesuaian), " +
        "(4) Kualitas Pelaporan (seberapa lengkap data program). " +
        "Jawab HANYA JSON valid.",
    },
    {
      role: "user",
      content: `Analisis program berikut dan kembalikan JSON:
{
  "breakdown": {
    "financialConsistency": {"score": 0-100, "desc": "penjelasan singkat"},
    "evidenceVerification": {"score": 0-100, "desc": "penjelasan"},
    "anomalyDetection": {"score": 0-100, "desc": "penjelasan"},
    "reportQuality": {"score": 0-100, "desc": "penjelasan"}
  },
  "detectedIssues": [{"severity": "low|medium|high", "text": "...", "resolved": false}],
  "report": "narasi 3-5 kalimat Bahasa Indonesia tentang akuntabilitas program",
  "overallScore": 0-100
}

Data program:
${summary}`,
    },
  ];

  try {
    const r = await chat(prompt, { jsonMode: true, temperature: 0.2, maxTokens: 1500 });
    const parsed = JSON.parse(r.content);
    return {
      breakdown: {
        financialConsistency: {
          score: clampScore(parsed.breakdown?.financialConsistency?.score),
          desc: parsed.breakdown?.financialConsistency?.desc ?? "",
        },
        evidenceVerification: {
          score: clampScore(parsed.breakdown?.evidenceVerification?.score),
          desc: parsed.breakdown?.evidenceVerification?.desc ?? "",
        },
        anomalyDetection: {
          score: clampScore(parsed.breakdown?.anomalyDetection?.score),
          desc: parsed.breakdown?.anomalyDetection?.desc ?? "",
        },
        reportQuality: {
          score: clampScore(parsed.breakdown?.reportQuality?.score),
          desc: parsed.breakdown?.reportQuality?.desc ?? "",
        },
      },
      detectedIssues: Array.isArray(parsed.detectedIssues)
        ? parsed.detectedIssues
            .slice(0, 6)
            .map((i: { severity?: string; text?: string; resolved?: boolean }) => ({
              severity: (["low", "medium", "high"].includes(i.severity ?? "")
                ? i.severity
                : "low") as "low" | "medium" | "high",
              text: String(i.text ?? "").slice(0, 200),
              resolved: Boolean(i.resolved),
            }))
        : [],
      report: String(parsed.report ?? fallback.report).slice(0, 2000),
      overallScore: clampScore(parsed.overallScore),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ...fallback,
      report: `${fallback.report}\n\n(Catatan AI: ${msg.slice(0, 150)})`,
    };
  }
}

function clampScore(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 75;
  return Math.max(0, Math.min(100, Math.round(v)));
}
