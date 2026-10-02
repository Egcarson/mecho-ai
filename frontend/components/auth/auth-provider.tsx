"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { authFetch } from "@/lib/auth-fetch";
import type { AuthUser } from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Resolve the browser's current session.
   *
   * authFetch may refresh an expired access token, but session discovery is
   * different from a protected application request:
   *
   * A 401 here can simply mean the visitor is not logged in.
   *
   * Therefore refreshUser explicitly disables the session-expired redirect.
   */
  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    setLoading(true);

    try {
      const response = await authFetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
        redirectOnSessionExpiry: false,
      });

      if (!response.ok) {
        setUser(null);
        return null;
      }

      const data = (await response.json()) as AuthUser;

      setUser(data);

      return data;
    } catch (error) {
      console.error("AUTH USER RESTORE ERROR:", error);

      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Restore an existing browser session once when the provider mounts.
   *
   * Logged-out visitors resolve normally to:
   *
   * user = null
   * loading = false
   *
   * They are not redirected by the auth layer.
   */
  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  /**
   * Explicit logout.
   *
   * The logout BFF revokes the refresh token when possible and always clears
   * the browser cookies. Navigation remains the responsibility of the
   * component that initiated logout.
   */
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
