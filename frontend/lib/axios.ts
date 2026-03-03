import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { RefreshResponse } from "@/types/auth";

// ─── Constants ───────────────────────────────────────────────────────────────
export const AUTH_LOGOUT_EVENT = "auth:force-logout";

// ─── Single-flight refresh state (module-level) ─────────────────────────────
let refreshPromise: Promise<string> | null = null;

// ─── Auth endpoints excluded from refresh logic ─────────────────────────────
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

function isAuthEndpoint(url?: string): boolean {
  return AUTH_ENDPOINTS.some((ep) => url?.includes(ep));
}

// ─── Cookie helpers ──────────────────────────────────────────────────────────
export function setAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie = "auth-status=authenticated; path=/; SameSite=Lax";
  }
}

export function clearAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie = "auth-status=; path=/; Max-Age=0; SameSite=Lax";
  }
}

// ─── Force logout (dispatches event for AuthContext to listen) ────────────────
function forceLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  clearAuthCookie();

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
  }
}

// ─── Axios instance ──────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor: attach Bearer token ────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor: single-flight refresh queue ───────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only intercept 401s on non-auth endpoints
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // If a refresh is already in-flight, wait for it
    if (refreshPromise) {
      try {
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    // Start a new refresh (single-flight)
    refreshPromise = (async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const { data } = await axios.post<RefreshResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        { refreshToken },
      );

      // Persist new tokens
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setAuthCookie();

      return data.accessToken;
    })()
      .catch((refreshError) => {
        forceLogout();
        throw refreshError;
      })
      .finally(() => {
        refreshPromise = null;
      });

    try {
      const newToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch {
      return Promise.reject(error);
    }
  },
);

export default api;
