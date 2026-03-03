"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/types/auth";
import api, {
  AUTH_LOGOUT_EVENT,
  setAuthCookie,
  clearAuthCookie,
} from "@/lib/axios";

// ─── Context type ────────────────────────────────────────────────────────────
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: AuthUser, accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ── Rehydrate from localStorage (useEffect, not useState initializer) ──
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("accessToken");
      const storedRefresh = localStorage.getItem("refreshToken");

      if (storedUser && storedToken && storedRefresh) {
        const parsed: AuthUser = JSON.parse(storedUser);
        // Basic shape check — if corrupt, clear everything
        if (parsed.id && parsed.email && parsed.role) {
          setUser(parsed);
        } else {
          throw new Error("Corrupt user data");
        }
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      clearAuthCookie();
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Login: persist to localStorage + cookie + state ──
  const login = useCallback(
    (userData: AuthUser, accessToken: string, refreshToken: string) => {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setAuthCookie();
      setUser(userData);
    },
    [],
  );

  // ── Logout: call backend, then clear everything ──
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch {
      // Ignore — we clear state regardless
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      clearAuthCookie();
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  // ── Listen for force-logout from Axios interceptor ──
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      router.push("/login");
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, handleForceLogout);
    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleForceLogout);
    };
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !loading && !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
