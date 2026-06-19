"use client";

import { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

interface ShareModalProps {
  programId: string;
  programTitle: string;
}

export function ShareModal({ programId, programTitle }: ShareModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Donation short URL: /d/{programId}
  const donateUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/d/${programId}`
      : `https://veriaid-ai.vercel.app/d/${programId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(donateUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = donateUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWA = () => {
    const text = encodeURIComponent(
      `Bantu program "${programTitle}" via VeriAid AI — donasi Anda bisa dilacak real-time:\n${donateUrl}`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100 transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none">
          <path
            d="M8 12a3 3 0 100-6 3 3 0 000 6zM12 12a3 3 0 100-6 3 3 0 000 6zM3 12a3 3 0 100-6 3 3 0 000 6zM17 12a3 3 0 100-6 3 3 0 000 6z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M8 9V6m0 9v-3M12 9V6m0 9v-3M3 9V6m0 9v-3M17 9V6m0 9v-3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        Share
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 lg:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Tutup"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 inline-flex items-center justify-center text-ink-500 hover:bg-ink-50 hover:text-ink-900 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="text-center mb-5">
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-teal-600 px-3 py-1.5 bg-teal-500/10 rounded-full">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M13 4l3 3-9 9H4v-3l9-9z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Bagikan & Terima Donasi
              </span>
              <h3 className="font-display font-extrabold text-xl text-ink-900 mt-3">
                {programTitle}
              </h3>
              <p className="text-sm text-ink-500 mt-1">
                Scan QR atau bagikan link ke calon donatur
              </p>
            </div>

            <div className="flex justify-center mb-5">
              <div className="p-4 bg-white border-4 border-teal-800 rounded-2xl shadow-[var(--shadow-card-lg)]">
                <QRCodeSVG
                  value={donateUrl}
                  size={180}
                  level="H"
                  bgColor="#ffffff"
                  fgColor="#0F4C5C"
                  marginSize={0}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
                Link Donasi
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={donateUrl}
                  className="flex-1 px-3 py-2.5 text-sm bg-ink-50 border border-ink-200 rounded-lg text-ink-700 font-mono truncate"
                  onClick={(e) => e.currentTarget.select()}
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                    copied
                      ? "bg-success text-white"
                      : "bg-teal-800 text-white hover:bg-teal-900"
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M5 10l4 4 6-8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Tersalin
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                        <rect
                          x="6"
                          y="6"
                          width="10"
                          height="10"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <path
                          d="M14 6V5a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2h1"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleShareWA}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a8 8 0 00-6.9 12L2 18l4.1-1.1A8 8 0 1010 2zm4.5 11.4c-.2.6-1.1 1.1-1.6 1.2-.4 0-.9.1-3-.6-2.6-.9-4.2-3.4-4.3-3.6-.1-.2-1-1.4-1-2.6 0-1.3.7-1.9.9-2.2.2-.3.5-.3.6-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.3.5c-.1.1-.2.3-.3.4-.1.1-.2.3-.1.5.2.3.7 1.2 1.6 1.9 1.1.9 2 1.2 2.3 1.3.2.1.4.1.5 0l.6-.8c.2-.2.4-.2.6-.1l1.7.8c.2.1.4.2.4.3 0 .1 0 .7-.2 1.3z" />
                </svg>
                WhatsApp
              </button>
              <Link
                href={`/d/${programId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-ink-800 bg-white border border-ink-200 rounded-lg hover:border-teal-500 hover:text-teal-800 hover:bg-ink-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M11 4l5 5-9 9H2v-5l9-9z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Preview Page
              </Link>
            </div>

            <p className="text-xs text-ink-400 text-center mt-4">
              Link ini publik — siapa saja bisa scan QR untuk memantau program
              dan donasi
            </p>
          </div>
        </div>
      )}
    </>
  );
}