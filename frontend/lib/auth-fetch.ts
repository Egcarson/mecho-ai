/**
 * Result of attempting to refresh the authenticated session.
 *
 * refreshed:
 *   New access/refresh cookies were issued successfully.
 *
 * expired:
 *   Refresh credentials were missing, expired, revoked, or invalid.
 *
 * failed:
 *   Refresh could not complete because of a temporary/network/server issue.
 */
type RefreshResult = "refreshed" | "expired" | "failed";

type AuthFetchInit = RequestInit & {
  /**
   * Protected application requests should redirect when the refresh session
   * has genuinely expired.
   *
   * Session-bootstrap requests such as /api/auth/me must disable this because
   * a 401 is also the normal state for a logged-out or brand-new visitor.
   */
  redirectOnSessionExpiry?: boolean;
};

/**
 * Only one refresh request may run at a time.
 *
 * Several protected requests can fail together when the access token expires.
 * They must share one refresh operation so rotating refresh tokens are not
 * consumed concurrently.
 */
let refreshPromise: Promise<RefreshResult> | null = null;

/**
 * Incremented whenever a refresh succeeds.
 *
 * Requests that began before another request refreshed the session can detect
 * that newer cookies are already available and retry without refreshing again.
 */
let refreshGeneration = 0;

/**
 * Prevent several protected requests from triggering duplicate logout and
 * redirect operations when a session genuinely expires.
 */
let sessionExpiryPromise: Promise<void> | null = null;

async function refreshSession(): Promise<RefreshResult> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      if (response.ok) {
        refreshGeneration += 1;
        return "refreshed";
      }

      if (response.status === 401 || response.status === 403) {
        return "expired";
      }

      return "failed";
    } catch (error) {
      console.error("AUTH REFRESH ERROR:", error);
      return "failed";
    }
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

/**
 * Clear browser-side auth cookies and send an authenticated user back to login.
 *
 * This is for protected application requests only. Public session discovery
 * must never call this merely because no session exists.
 */
async function expireBrowserSession() {
  if (typeof window === "undefined") {
    return;
  }

  if (sessionExpiryPromise) {
    return sessionExpiryPromise;
  }

  sessionExpiryPromise = (async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch (error) {
      console.error("SESSION CLEANUP ERROR:", error);
    }

    window.location.replace("/login?reason=session-expired");
  })();

  return sessionExpiryPromise;
}

/**
 * Authenticated browser fetch with one shared refresh pipeline.
 *
 * Normal protected request:
 *
 * request
 *   ↓
 * 401
 *   ↓
 * refresh
 *   ├─ refreshed → retry request
 *   ├─ expired   → clear session + redirect
 *   └─ failed    → return original 401
 *
 * Session bootstrap:
 *
 * /api/auth/me
 *   ↓
 * 401
 *   ↓
 * refresh
 *   ├─ refreshed → retry /me
 *   └─ expired   → simply return 401
 *
 * That distinction prevents logged-out visitors from entering a redirect loop.
 */
export async function authFetch(
  input: RequestInfo | URL,
  init: AuthFetchInit = {},
): Promise<Response> {
  const { redirectOnSessionExpiry = true, ...requestInit } = init;

  const generationAtStart = refreshGeneration;

  let response = await fetch(input, {
    ...requestInit,
    credentials: "include",
  });

  if (response.status !== 401) {
    return response;
  }

  /**
   * Another request may have refreshed the session while this request was
   * still running. Retry once using the newer cookies.
   */
  if (refreshGeneration !== generationAtStart) {
    const retryResponse = await fetch(input, {
      ...requestInit,
      credentials: "include",
    });

    if (retryResponse.status === 401 && redirectOnSessionExpiry) {
      await expireBrowserSession();
    }

    return retryResponse;
  }

  const refreshResult = await refreshSession();

  /**
   * Missing/expired refresh credentials mean different things depending on
   * context:
   *
   * - protected request: the authenticated session has ended;
   * - auth bootstrap: the visitor may simply be logged out.
   */
  if (refreshResult === "expired") {
    if (redirectOnSessionExpiry) {
      await expireBrowserSession();
    }

    return response;
  }

  /**
   * Temporary backend/network failure is not proof that the session should be
   * destroyed.
   */
  if (refreshResult === "failed") {
    return response;
  }

  /**
   * Refresh succeeded. Retry the original request once with the new cookies.
   */
  response = await fetch(input, {
    ...requestInit,
    credentials: "include",
  });

  /**
   * For protected requests, a successful refresh followed immediately by
   * another 401 means the refreshed session still cannot authorize the request.
   *
   * During auth bootstrap we simply return the 401 and let AuthProvider resolve
   * the visitor as logged out.
   */
  if (response.status === 401 && redirectOnSessionExpiry) {
    await expireBrowserSession();
  }

  return response;
}
