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
   * Resolve the current authenticated user.
   *
   * Token refreshing is intentionally delegated to authFetch so the
   * application has one refresh pipeline and one refresh-token lock.
   */
  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    setLoading(true);

    try {
      const response = await authFetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
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
   * Restore the browser session once when the application mounts.
   */
  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  /**
   * Explicit logout.
   *
   * The component initiating logout remains responsible for navigation.
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
