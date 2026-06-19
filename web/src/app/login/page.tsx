"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.ok) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? "Login gagal.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-ink-50">
      <div className="container-page py-6">
        <Logo />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-extrabold text-ink-900 mb-2">
              Masuk ke Akun Anda
            </h1>
            <p className="text-ink-500">
              Kelola program bantuan dan akses dashboard organisasi.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-[var(--shadow-card-lg)] border border-ink-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-ink-700 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@organisasi.id"
                  className="w-full px-4 py-3 text-base bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-ink-700 mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-4 py-3 text-base bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10 9v4m0 4h.01M10 2a8 8 0 100 16 8 8 0 000-16z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 disabled:opacity-60 transition-colors"
              >
                {loading ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeOpacity="0.25"
                      />
                      <path
                        d="M17 10a7 7 0 00-7-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-ink-200 text-center text-sm text-ink-500">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-teal-700 hover:text-teal-900"
              >
                Daftar di sini
              </Link>
            </div>
          </div>

          <p className="text-xs text-center text-ink-400 mt-6">
            Demo: gunakan email apapun + password minimal 6 karakter
          </p>

          <div className="mt-4 p-4 bg-gradient-to-br from-teal-50 to-amber-50 border border-teal-200 rounded-xl">
            <p className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-2">
              Akun Demo (1-klik login)
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("demo@veriaid.ai");
                  setPassword("veriaid2026");
                }}
                className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-teal-200 hover:border-teal-500 hover:bg-teal-50 transition-colors text-left group"
              >
                <div>
                  <div className="text-sm font-semibold text-ink-900">
                    Syahnahl (Demo Owner)
                  </div>
                  <div className="text-xs text-ink-500 font-mono mt-0.5">
                    demo@veriaid.ai · veriaid2026
                  </div>
                </div>
                <span className="text-xs font-semibold text-teal-700 group-hover:text-teal-900">
                  Isi →
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("volunteer@veriaid.ai");
                  setPassword("veriaid2026");
                }}
                className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-teal-200 hover:border-teal-500 hover:bg-teal-50 transition-colors text-left group"
              >
                <div>
                  <div className="text-sm font-semibold text-ink-900">
                    Rina志愿者 (Demo Volunteer)
                  </div>
                  <div className="text-xs text-ink-500 font-mono mt-0.5">
                    volunteer@veriaid.ai · veriaid2026
                  </div>
                </div>
                <span className="text-xs font-semibold text-teal-700 group-hover:text-teal-900">
                  Isi →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
