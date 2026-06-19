"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"organization" | "volunteer">("organization");
  const [organization, setOrganization] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signUp({
      name,
      email,
      password,
      role,
      organization: role === "organization" ? organization : undefined,
    });
    setLoading(false);
    if (result.ok) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? "Pendaftaran gagal.");
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
              Daftar Akun Baru
            </h1>
            <p className="text-ink-500">
              Mulai kelola program bantuan Anda hari ini.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-[var(--shadow-card-lg)] border border-ink-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-ink-700 mb-1.5"
                >
                  Nama Lengkap
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Citra Wijaya"
                  className="w-full px-4 py-3 text-base bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-sm font-semibold text-ink-700 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@organisasi.id"
                  className="w-full px-4 py-3 text-base bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-password"
                  className="block text-sm font-semibold text-ink-700 mb-1.5"
                >
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-4 py-3 text-base bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-1.5">
                  Daftar Sebagai
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("organization")}
                    className={`p-3 text-sm font-semibold rounded-lg border-2 transition-all ${
                      role === "organization"
                        ? "border-teal-500 bg-teal-50 text-teal-800"
                        : "border-ink-200 text-ink-600 hover:border-ink-300"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 mx-auto mb-1"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M3 21h18M5 21V7l8-4 8 4v14M9 9h.01M9 13h.01M9 17h.01M14 9h.01M14 13h.01M14 17h.01"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                    Organisasi
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("volunteer")}
                    className={`p-3 text-sm font-semibold rounded-lg border-2 transition-all ${
                      role === "volunteer"
                        ? "border-teal-500 bg-teal-50 text-teal-800"
                        : "border-ink-200 text-ink-600 hover:border-ink-300"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 mx-auto mb-1"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="8"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M4 21a8 8 0 0116 0"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                    Relawan
                  </button>
                </div>
              </div>

              {role === "organization" && (
                <div>
                  <label
                    htmlFor="org"
                    className="block text-sm font-semibold text-ink-700 mb-1.5"
                  >
                    Nama Organisasi
                  </label>
                  <input
                    id="org"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Yayasan Tangguh Bencana"
                    className="w-full px-4 py-3 text-base bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              )}

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
                {loading ? "Mendaftar..." : "Daftar"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-ink-200 text-center text-sm text-ink-500">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-semibold text-teal-700 hover:text-teal-900"
              >
                Masuk di sini
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
