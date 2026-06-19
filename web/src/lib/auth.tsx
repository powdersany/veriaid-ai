"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { demoUsers } from "./demo-users";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "organization" | "volunteer";
  organization?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (data: {
    name: string;
    email: string;
    password: string;
    role: "organization" | "volunteer";
    organization?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthState | null>(null);
const STORAGE_KEY = "veriaid_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const signIn: AuthState["signIn"] = async (email, password) => {
    if (!email || !password) {
      return { ok: false, error: "Email dan password wajib diisi." };
    }
    if (!email.includes("@")) {
      return { ok: false, error: "Format email tidak valid." };
    }
    if (password.length < 6) {
      return { ok: false, error: "Password minimal 6 karakter." };
    }
    // Check demo accounts first
    const demo = demoUsers.find(
      (d) => d.email.toLowerCase() === email.toLowerCase() && d.password === password,
    );
    const u: User = demo
      ? {
          id: demo.id,
          name: demo.name,
          email: demo.email,
          role: demo.role,
          organization: demo.organization,
          createdAt: demo.createdAt,
        }
      : {
          id: `usr_${Date.now()}`,
          name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          email,
          role: "organization",
          createdAt: new Date().toISOString(),
        };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    return { ok: true };
  };

  const signUp: AuthState["signUp"] = async (data) => {
    if (!data.name || !data.email || !data.password) {
      return { ok: false, error: "Semua field wajib diisi." };
    }
    if (!data.email.includes("@")) {
      return { ok: false, error: "Format email tidak valid." };
    }
    if (data.password.length < 6) {
      return { ok: false, error: "Password minimal 6 karakter." };
    }
    const u: User = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      organization: data.organization,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    return { ok: true };
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
