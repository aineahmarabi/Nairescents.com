"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthUser { id: string; name: string; email: string; }
interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("naire_user");
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
  }, []);

  async function login(email: string, password: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Login failed."); }
    const u: AuthUser = await res.json();
    setUser(u);
    localStorage.setItem("naire_user", JSON.stringify(u));
  }

  async function signup(name: string, email: string, password: string) {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Sign up failed."); }
    const u: AuthUser = await res.json();
    setUser(u);
    localStorage.setItem("naire_user", JSON.stringify(u));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("naire_user");
  }

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
