/**
 * Result of attempting to refresh the authenticated session.
 *
 * refreshed:
 *   New access/refresh cookies were issued successfully.
 *
 * expired:
 *   Refresh credentials were explicitly rejected.
 *
 * failed:
 *   Refresh could not complete because of a temporary/network/server issue.
 */
type RefreshResult = "refreshed" | "expired" | "failed";

/**
 * Only one refresh request may run at a time.
 *
 * Multiple authenticated requests can fail with 401 together when the
 * access token expires. They must share one refresh operation so rotating
 * refresh tokens are not used concurrently.
 */
let refreshPromise: Promise<RefreshResult> | null = null;

/**
 * Incremented after every successful refresh.
 *
 * Requests that started before another request refreshed the session can
 * detect that newer cookies already exist and retry directly.
 */
let refreshGeneration = 0;

/**
 * Prevent multiple requests from trying to expire and redirect the browser
 * at the same time.
 */
let sessionExpiryPromise: Promise<void> | null = null;

/**
 * Refresh the current session through the Next.js BFF.
 *
 * This is the ONLY refresh pipeline used by authenticated browser requests.
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
       * These mean the refresh credentials are actually unusable:
       * expired, revoked, missing, invalid, etc.
       */
      if (response.status === 401 || response.status === 403) {
        return "expired";
      }

      /**
       * A server failure is not proof that the user session is invalid.
       */
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
 * Clear the BFF cookies and move the browser to login.
 *
 * This should only happen when we have strong evidence that the session has
 * genuinely expired or the freshly refreshed session is still unusable.
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
 * Perform an authenticated browser request.
 *
 * Flow:
 *
 * request
 *   ↓
 * not 401 → return response
 *
 * 401
 *   ↓
 * has another request already refreshed?
 *   ├─ yes → retry once with fresh cookies
 *   └─ no  → run shared refresh
 *              ↓
 *        refreshed → retry once
 *        expired   → clear session + redirect
 *        failed    → return original 401 to caller
 */
export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const generationAtStart = refreshGeneration;

  let response = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (response.status !== 401) {
    return response;
  }

  /**
   * Another request may have refreshed the session while this request was
   * still in flight.
   */
  if (refreshGeneration !== generationAtStart) {
    const retryResponse = await fetch(input, {
      ...init,
      credentials: "include",
    });

    if (retryResponse.status === 401) {
      await expireBrowserSession();
    }

    return retryResponse;
  }

  const refreshResult = await refreshSession();

  /**
   * Refresh credentials are genuinely invalid.
   */
  if (refreshResult === "expired") {
    await expireBrowserSession();

    return response;
  }

  /**
   * Temporary refresh failure.
   *
   * Do not destroy the browser session here. Let the caller surface the
   * request error instead.
   */
  if (refreshResult === "failed") {
    return response;
  }

  /**
   * Refresh succeeded.
   * Retry the original request once using the new cookies.
   */
  response = await fetch(input, {
    ...init,
    credentials: "include",
  });

  /**
   * A successful refresh immediately followed by another 401 means the new
   * session still cannot authorize this request.
   */
  if (response.status === 401) {
    await expireBrowserSession();
  }

  return response;
}
