// Shared types for the API + frontend.

export type ProgramStatus = "verified" | "in_progress" | "pending_review";
export type UserRole = "organization" | "volunteer";
export type EvidenceType = "foto" | "nota" | "invoice" | "laporan" | "dokumen";
export type EvidenceStatus = "analyzed" | "pending" | "flagged";

export interface AidProgram {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  description: string;
  targetFund: number;
  fundReceived: number;
  fundSpent: number;
  targetBeneficiary: number;
  aidType: string;
  status: ProgramStatus;
  aiScore: number;
  startDate: string; // ISO
  endDate?: string | null;
  coverImage?: string | null;
  organizer: string;
}

export interface Expense {
  id: string;
  programId: string;
  item: string;
  amount: number;
  category: string;
  date: string; // ISO
  note?: string | null;
}

export interface Evidence {
  id: string;
  programId: string;
  name: string;
  type: EvidenceType | string;
  size: string;
  url?: string | null;
  status: EvidenceStatus | string;
  aiNote?: string | null;
  ocrData?: string | null;
  date: string;
}

export interface FundRecord {
  id: string;
  programId: string;
  amount: number;
  source: string;
  donorName?: string | null;
  note?: string | null;
  createdAt: string;
}

export interface AnalysisBreakdown {
  financialConsistency: { score: number; desc: string };
  evidenceVerification: { score: number; desc: string };
  anomalyDetection: { score: number; desc: string };
  reportQuality: { score: number; desc: string };
}

export interface DetectedIssue {
  severity: "low" | "medium" | "high";
  text: string;
  resolved: boolean;
}

export interface Analysis {
  id: string;
  programId: string;
  aiScore: number;
  breakdown: string; // JSON string of AnalysisBreakdown
  detectedIssues: string; // JSON string of DetectedIssue[]
  report: string;
  createdAt: string;
}

export interface ProofEvent {
  event: string;
  eventType?: string;
  timestamp: string;
  data: Record<string, unknown>;
  previousHash: string;
  currentHash: string;
  sequence: number;
  shortHash?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string | null;
  createdAt?: string;
}
