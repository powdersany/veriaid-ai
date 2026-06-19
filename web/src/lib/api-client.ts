/**
 * Frontend API client. Uses fetch with credentials for cookie-based auth.
 * For server components / server actions, prefer direct prisma/db access.
 */
const BASE = "";

export class APIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "APIError";
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  });
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new APIError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ===== Auth =====
export const authApi = {
  async login(email: string, password: string) {
    return request<{ user: import("./types").User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  async signup(data: {
    name: string;
    email: string;
    password: string;
    role: "organization" | "volunteer";
    organization?: string;
  }) {
    return request<{ user: import("./types").User }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async logout() {
    return request<{ ok: true }>("/api/auth/logout", { method: "POST" });
  },
  async me() {
    return request<{ user: import("./types").User | null }>("/api/auth/me");
  },
};

// ===== Programs =====
export const programsApi = {
  async list(params: { status?: string; category?: string } = {}) {
    const qs = new URLSearchParams();
    if (params.status) qs.set("status", params.status);
    if (params.category) qs.set("category", params.category);
    return request<{ programs: import("./types").AidProgram[] }>(
      `/api/programs${qs.size ? `?${qs}` : ""}`,
    );
  },
  async mine() {
    return request<{ programs: import("./types").AidProgram[] }>("/api/programs/me");
  },
  async get(id: string) {
    return request<{
      program: import("./types").AidProgram;
      expenses: import("./types").Expense[];
      evidence: import("./types").Evidence[];
      funds: import("./types").FundRecord[];
      analyses: import("./types").Analysis[];
      proof: import("./types").ProofEvent[];
    }>(`/api/programs/${id}`);
  },
  async create(data: Partial<import("./types").AidProgram>) {
    return request<{ program: import("./types").AidProgram }>("/api/programs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async fund(id: string, data: { amount: number; donorName?: string; note?: string; method?: "qris" | "bank" }) {
    return request<{ donation: import("./types").FundRecord; program: import("./types").AidProgram }>(
      `/api/programs/${id}/donations`,
      { method: "POST", body: JSON.stringify(data) },
    );
  },
  async recordExpense(
    id: string,
    data: { item: string; amount: number; category: string; date?: string; note?: string },
  ) {
    return request<{ expense: import("./types").Expense; program: import("./types").AidProgram }>(
      `/api/programs/${id}/expense`,
      { method: "POST", body: JSON.stringify(data) },
    );
  },
  async uploadEvidence(
    id: string,
    data: { name: string; type: string; size: string; aiNote?: string; ocrData?: unknown },
  ) {
    return request<{ evidence: import("./types").Evidence }>(
      `/api/programs/${id}/evidence`,
      { method: "POST", body: JSON.stringify(data) },
    );
  },
  async proof(id: string) {
    return request<{
      program: { id: string; slug: string; title: string; status: string; aiScore: number };
      verificationId: string;
      isValid: boolean;
      brokenAt: number | null;
      eventCount: number;
      chain: import("./types").ProofEvent[];
    }>(`/api/programs/${id}/proof`);
  },
  async analyze(id: string) {
    return request<{ analysis: import("./types").Analysis & {
      breakdown: import("./types").AnalysisBreakdown;
      detectedIssues: import("./types").DetectedIssue[];
    } }>(`/api/programs/${id}/analyze`, { method: "POST" });
  },
};

// ===== Verify =====
export const verifyApi = {
  async hash(hash: string) {
    return request<{
      valid: boolean;
      event?: { type: string; timestamp: string; data: unknown; sequence: number };
      program?: { id: string; slug: string; title: string; status: string; aiScore: number };
    }>(`/api/verify/${hash}`);
  },
};

// ===== Health =====
export const healthApi = {
  async check() {
    return request<{
      status: string;
      db: { ok: boolean; error: string | null };
      ai: { configured: boolean };
    }>("/api/health");
  },
};
