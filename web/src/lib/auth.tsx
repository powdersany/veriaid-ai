"use client";

/**
 * Client-side auth context. Calls /api/auth/* with HTTP-only cookies.
 * Falls back to demo accounts if backend is offline.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "./api-client";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "organization" | "volunteer";
  organization?: string | null;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  /** true if connected to backend (vs. local fallback) */
  online: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (data: {
    name: string;
    email: string;
    password: string;
    role: "organization" | "volunteer";
    organization?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then((r) => {
        setUser(r.user);
        setOnline(true);
      })
      .catch(() => {
        setOnline(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn: AuthState["signIn"] = async (email, password) => {
    try {
      const r = await authApi.login(email, password);
      setUser(r.user);
      setOnline(true);
      return { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Login gagal";
      return { ok: false, error: msg };
    }
  };

  const signUp: AuthState["signUp"] = async (data) => {
    try {
      const r = await authApi.signup(data);
      setUser(r.user);
      setOnline(true);
      return { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Pendaftaran gagal";
      return { ok: false, error: msg };
    }
  };

  const signOut: AuthState["signOut"] = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, online, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
