/**
 * Result of attempting to refresh the authenticated session.
 *
 * refreshed:
 *   New access/refresh cookies were issued successfully.
 *
 * expired:
 *   Backend explicitly rejected the refresh credentials.
 *   The user must authenticate again.
 *
 * failed:
 *   Refresh could not be completed because of a temporary/network/server
 *   problem. We should NOT destroy the user's session for this.
 */
type RefreshResult = "refreshed" | "expired" | "failed";

/**
 * Only one refresh request is allowed at a time.
 *
 * Many dashboard components may request data simultaneously. When the
 * access token expires, they can all receive 401 together.
 *
 * Without this lock, each request would attempt to rotate the same
 * refresh token independently.
 */
let refreshPromise: Promise<RefreshResult> | null = null;

/**
 * Incremented whenever a refresh completes successfully.
 *
 * This allows requests that received an old 401 slightly later to notice
 * that another request already refreshed the session and simply retry.
 */
let refreshGeneration = 0;

/**
 * Prevent several simultaneous failed requests from all trying to log the
 * user out and redirect at once.
 */
let sessionExpiryPromise: Promise<void> | null = null;

/**
 * Attempt to refresh the session through the Next.js BFF.
 */
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

      /**
       * 401/403 means the refresh credentials themselves are no longer
       * usable: expired, revoked, missing, etc.
       *
       * That is a real expired session.
       */
      if (response.status === 401 || response.status === 403) {
        return "expired";
      }

      /**
       * 500/502/503/etc. are not proof that the refresh token is invalid.
       * Don't throw the user out because the server had a temporary issue.
       */
      return "failed";
    } catch {
      /**
       * Network failure.
       *
       * Again, do not destroy the session just because the server could
       * not be reached.
       */
      return "failed";
    }
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

/**
 * Clear the local BFF cookies and send the user back to login.
 *
 * We use the existing logout route because it clears both HttpOnly auth
 * cookies even when the backend logout request itself fails.
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
    } catch {
      /**
       * We still redirect.
       *
       * The logout BFF normally clears cookies, but even if this request
       * has a network problem, the app should stop presenting the stale
       * authenticated dashboard.
       */
    }

    /**
     * Use location.replace rather than router.push.
     *
     * A hard navigation:
     * - resets AuthProvider state,
     * - prevents returning to the stale protected page with Back,
     * - starts a fresh authentication lifecycle.
     */
    window.location.replace("/login?reason=session-expired");
  })();

  return sessionExpiryPromise;
}

/**
 * Authenticated browser fetch helper.
 *
 * Request lifecycle:
 *
 * request
 *   ↓
 * 2xx/etc. → return response
 *
 * 401
 *   ↓
 * Did another request already refresh?
 *   ├─ yes → retry once
 *   └─ no  → refresh
 *              ↓
 *        refreshed → retry once
 *        expired   → logout + redirect
 *        failed    → return response to caller
 */
export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const generationAtStart = refreshGeneration;

  let response = await fetch(input, {
    ...init,

    credentials: "include",
  });

  if (response.status !== 401) {
    return response;
  }

  /**
   * Another request may have successfully refreshed while this original
   * request was still in flight.
   *
   * If so, simply retry with the new cookies rather than rotating the
   * refresh token again.
   */
  if (refreshGeneration !== generationAtStart) {
    const retryResponse = await fetch(input, {
      ...init,

      credentials: "include",
    });

    /**
     * A retry that still returns 401 means the refreshed session is not
     * usable. Treat it as an expired session instead of leaking
     * "Unauthorized" into dashboard UI.
     */
    if (retryResponse.status === 401) {
      await expireBrowserSession();
    }

    return retryResponse;
  }

  const refreshResult = await refreshSession();

  /**
   * Refresh credentials are genuinely invalid/expired/revoked.
   */
  if (refreshResult === "expired") {
    await expireBrowserSession();

    return response;
  }

  /**
   * Temporary refresh failure.
   *
   * Do NOT clear auth cookies or force logout here.
   */
  if (refreshResult === "failed") {
    return response;
  }

  /**
   * Refresh succeeded.
   * Retry the original request once using the newly written cookies.
   */
  response = await fetch(input, {
    ...init,

    credentials: "include",
  });

  /**
   * A successful refresh followed immediately by another 401 indicates
   * the resulting access session still cannot authorize this request.
   *
   * At this point keeping the stale dashboard visible is misleading, so
   * terminate the browser session.
   */
  if (response.status === 401) {
    await expireBrowserSession();
  }

  return response;
}
