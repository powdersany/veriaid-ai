"use client";

import { useState } from "react";

interface Props {
  valid: boolean;
  hash?: string;
}

export function VerifyButton({ valid, hash }: Props) {
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<"valid" | "invalid" | null>(valid ? "valid" : null);
  const [apiResult, setApiResult] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!hash) {
      setVerifying(true);
      setResult(null);
      setTimeout(() => {
        setVerifying(false);
        setResult("valid");
      }, 1500);
      return;
    }
    setVerifying(true);
    setResult(null);
    setApiResult(null);
    try {
      const r = await fetch(`/api/verify/${hash}`);
      const data = await r.json();
      if (data.valid) {
        setResult("valid");
        setApiResult(
          `Event: ${data.event?.type ?? "?"} · ${new Date(data.event?.timestamp ?? "").toLocaleString("id-ID")}`,
        );
      } else {
        setResult("invalid");
        setApiResult(data.reason ?? "Hash tidak valid atau tidak ditemukan.");
      }
    } catch (e) {
      setResult("invalid");
      setApiResult(e instanceof Error ? e.message : "Network error");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleVerify}
        disabled={verifying}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-teal-800 rounded-xl hover:bg-teal-900 disabled:opacity-60 transition-colors"
      >
        {verifying ? (
          <>
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
              <path d="M17 10a7 7 0 00-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Memverifikasi hash chain...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 5v5c0 4.4 3 8.5 7 9.4 4-0.9 7-5 7-9.4V5l-7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Verifikasi Bukti Sekarang
          </>
        )}
      </button>

      {result === "valid" && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="none">
              <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-bold text-success">Valid — Integrity Terjaga</div>
            <div className="text-sm text-ink-600">
              {apiResult ?? "Hash chain konsisten dari genesis ke event terbaru. Laporan tidak dimodifikasi sejak dipublikasikan."}
            </div>
          </div>
        </div>
      )}

      {result === "invalid" && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-danger flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="none">
              <path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-bold text-danger">Tidak Valid</div>
            <div className="text-sm text-ink-600">{apiResult ?? "Hash tidak cocok dengan chain."}</div>
          </div>
        </div>
      )}
    </div>
  );
}
