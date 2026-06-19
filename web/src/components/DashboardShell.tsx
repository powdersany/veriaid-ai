"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/dashboard/create", label: "Buat Program", icon: "M12 4v16m8-8H4" },
  { href: "/programs", label: "Lihat Publik", icon: "M3 7h18M3 12h18M3 17h18" },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="text-center">
          <svg
            className="w-10 h-10 mx-auto mb-3 text-teal-600 animate-spin"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
            <path d="M17 10a7 7 0 00-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-ink-500 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex bg-ink-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-ink-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-ink-200 flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-ink-200">
          <Logo />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  active
                    ? "bg-teal-50 text-teal-800"
                    : "text-ink-700 hover:bg-ink-50"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d={item.icon}
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-ink-200">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink-900 truncate">
                {user.name}
              </div>
              <div className="text-xs text-ink-500 truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-2 w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold text-ink-700 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
              <path
                d="M13 4h3a2 2 0 012 2v8a2 2 0 01-2 2h-3M7 12h8m0 0l-3-3m3 3l-3 3M5 4h2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-ink-200 px-4 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-ink-700 hover:bg-ink-50"
            aria-label="Buka menu"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="text-xs text-ink-500">Dashboard Organisasi</div>
            <div className="text-sm font-semibold text-ink-900">
              Hai, {user.name.split(" ")[0]} 👋
            </div>
          </div>
          <Link
            href="/dashboard/create"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Program Baru
          </Link>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
