"use client";

import { useState } from "react";

interface PaymentInfoModalProps {
  open: boolean;
  onClose: () => void;
  method: "qris" | "transfer" | "general";
  programTitle: string;
}

const QRIS_IMAGE_URL =
  "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=VeriAid-Donation-Demo";

export function PaymentInfoModal({
  open,
  onClose,
  method,
  programTitle,
}: PaymentInfoModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 lg:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Tutup"
          onClick={onClose}
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
                d="M3 8a7 7 0 0114 0v3a2 2 0 01-2 2h-1v-7h3M3 8v3a2 2 0 002 2h1v-7H3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            {method === "qris"
              ? "Donasi via QRIS"
              : method === "transfer"
              ? "Transfer Bank"
              : "Pilih Metode Donasi"}
          </span>
          <h3 className="font-display font-extrabold text-xl text-ink-900 mt-3">
            {programTitle}
          </h3>
          <p className="text-sm text-ink-500 mt-1">
            Demo MVP — payment gateway coming soon
          </p>
        </div>

        {method === "qris" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-white border-4 border-teal-800 rounded-2xl shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={QRIS_IMAGE_URL}
                  alt="QRIS Code Demo"
                  width={220}
                  height={220}
                  className="block"
                />
              </div>
            </div>
            <div className="text-center text-sm text-ink-600">
              Scan QR di atas dengan aplikasi e-wallet (GoPay, OVO, Dana, ShopeePay)
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              <strong>Demo:</strong> QR ini placeholder. VeriAid AI akan generate
              QRIS dinamis per program setelah integrasi payment gateway.
            </div>
          </div>
        )}

        {method === "transfer" && (
          <div className="space-y-3">
            <p className="text-sm text-ink-600">
              Transfer ke rekening escrow VeriAid AI (rekening bersama, diawasi
              publik):
            </p>
            <div className="space-y-2">
              <BankRow
                bank="BCA"
                account="123-456-7890"
                name="Yayasan VeriAid Indonesia"
              />
              <BankRow
                bank="Mandiri"
                account="123-00-4567890-1"
                name="Yayasan VeriAid Indonesia"
              />
              <BankRow
                bank="BNI"
                account="012-345-6789"
                name="Yayasan VeriAid Indonesia"
              />
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              <strong>Demo:</strong> Nomor rekening di atas placeholder. Setiap
              donasi via transfer akan otomatis tercatat dengan SHA-256 hash
              + bukti transfer di blockchain.
            </div>
          </div>
        )}

        {method === "general" && (
          <div className="space-y-3">
            <p className="text-sm text-ink-600 mb-3">
              Pilih cara donasi yang paling nyaman buat Tuan:
            </p>
            <QrisButton programTitle={programTitle} />
            <TransferButton programTitle={programTitle} />
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-5 px-4 py-2.5 text-sm font-semibold text-ink-700 bg-ink-100 hover:bg-ink-200 rounded-lg transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

function BankRow({
  bank,
  account,
  name,
}: {
  bank: string;
  account: string;
  name: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-3 p-3 bg-ink-50 border border-ink-200 rounded-lg">
      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white border border-ink-200 rounded-md font-bold text-xs text-teal-800">
        {bank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-ink-500">{name}</div>
        <div className="text-sm font-mono font-semibold text-ink-900 truncate">
          {account}
        </div>
      </div>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(account);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            /* ignore */
          }
        }}
        className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
      >
        {copied ? "✓" : "Copy"}
      </button>
    </div>
  );
}

export function QrisButton({
  programTitle,
  className = "",
}: {
  programTitle: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors ${className}`}
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
          <path
            d="M3 8a7 7 0 0114 0v3a2 2 0 01-2 2h-1v-7h3M3 8v3a2 2 0 002 2h1v-7H3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        Donasi via QRIS
      </button>
      <PaymentInfoModal
        open={open}
        onClose={() => setOpen(false)}
        method="qris"
        programTitle={programTitle}
      />
    </>
  );
}

export function TransferButton({
  programTitle,
  className = "",
}: {
  programTitle: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-teal-800 bg-white border-2 border-teal-700 rounded-lg hover:bg-teal-50 transition-colors ${className}`}
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
          <path
            d="M2 6h16M2 6v10a2 2 0 002 2h12a2 2 0 002-2V6M2 6l3-3h10l3 3M7 12h6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        Transfer Bank
      </button>
      <PaymentInfoModal
        open={open}
        onClose={() => setOpen(false)}
        method="transfer"
        programTitle={programTitle}
      />
    </>
  );
}