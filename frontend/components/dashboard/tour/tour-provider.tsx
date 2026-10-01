"use client";

import { createContext, useEffect, useMemo, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import {
  DASHBOARD_TOUR_STEPS,
  getDashboardTourStorageKey,
  type DashboardTourStep,
} from "./tour-data";

type DashboardTourContextValue = {
  active: boolean;

  currentStep: DashboardTourStep | null;

  currentStepIndex: number;

  totalSteps: number;

  isFirstStep: boolean;
  isLastStep: boolean;

  isMobile: boolean;

  mobileMoreOpen: boolean;

  setMobileMoreOpen: (open: boolean) => void;

  nextStep: () => void;

  previousStep: () => void;

  skipTour: () => void;

  completeTour: () => void;

  restartTour: () => void;
};

export const DashboardTourContext =
  createContext<DashboardTourContextValue | null>(null);

type DashboardTourProviderProps = {
  userUid: string;
  children: React.ReactNode;
};

/**
 * DashboardTourProvider
 *
 * Owns persistent and cross-page onboarding state.
 *
 * Important implementation decisions:
 *
 * 1. Completion is stored per user, not globally per browser.
 *    This means a second Mecho account using the same computer can still
 *    receive its own first-time onboarding.
 *
 * 2. The automatic tour only starts on /dashboard.
 *    We do not unexpectedly launch onboarding while someone is already
 *    deep inside Settings, Library, Projects, etc.
 *
 * 3. The provider also owns the mobile More sheet state. This allows the
 *    tour to open the sheet automatically before spotlighting Settings
 *    and Support.
 */
export function DashboardTourProvider({
  userUid,
  children,
}: DashboardTourProviderProps) {
  const router = useRouter();

  const pathname = usePathname();

  const [active, setActive] = useState(false);

  const [stepIndex, setStepIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  /**
   * Incrementing restartToken allows a manual restart to trigger the
   * dashboard-start effect even when the provider itself never unmounts.
   */
  const [restartToken, setRestartToken] = useState(0);

  /**
   * Tailwind's lg breakpoint begins at 1024px.
   *
   * Keep tour responsive logic aligned with the exact same breakpoint
   * used by the dashboard navigation.
   */
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");

    const update = () => {
      setIsMobile(media.matches);
    };

    update();

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  /**
   * Remove steps that don't exist in the current responsive layout.
   *
   * Desktop:
   * Welcome → Composer → Create → Projects → Library → Settings →
   * Support → Finish
   *
   * Mobile adds the More step before Settings.
   */
  const visibleSteps = useMemo(
    () =>
      DASHBOARD_TOUR_STEPS.filter((step) => {
        if (step.mobileOnly && !isMobile) {
          return false;
        }

        if (step.desktopOnly && isMobile) {
          return false;
        }

        return true;
      }),
    [isMobile],
  );

  /**
   * Responsive changes while the tour is open should never leave the
   * index pointing past the end of the available step collection.
   */
  useEffect(() => {
    setStepIndex((current) =>
      Math.min(current, Math.max(0, visibleSteps.length - 1)),
    );
  }, [visibleSteps.length]);

  const currentStep = visibleSteps[stepIndex] ?? null;

  /**
   * Auto-start onboarding only on the main dashboard and only when this
   * account has not completed/skipped the current tour version.
   */
  useEffect(() => {
    if (pathname !== "/dashboard") {
      return;
    }

    const storageKey = getDashboardTourStorageKey(userUid);

    const completed = window.localStorage.getItem(storageKey);

    if (completed) {
      return;
    }

    const timer = window.setTimeout(() => {
      setStepIndex(0);
      setActive(true);
    }, 700);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname, restartToken, userUid]);

  /**
   * Mobile Settings and Support only exist inside the More sheet.
   *
   * Open it before DashboardTour searches the DOM for those targets.
   */
  useEffect(() => {
    if (!active || !isMobile || !currentStep) {
      return;
    }

    /**
     * Settings and Support live inside the mobile More sheet,
     * so the tour needs to open it before trying to highlight
     * those navigation items.
     */
    if (currentStep.id === "settings" || currentStep.id === "support") {
      setMobileMoreOpen(true);

      return;
    }

    /**
     * Every other mobile tour step should keep the More sheet closed.
     *
     * No extra condition is needed here because TypeScript has already
     * narrowed out "settings" and "support" after the return above.
     */
    setMobileMoreOpen(false);
  }, [active, currentStep, isMobile]);

  function markCompleted() {
    window.localStorage.setItem(getDashboardTourStorageKey(userUid), "true");
  }

  function nextStep() {
    if (stepIndex >= visibleSteps.length - 1) {
      completeTour();

      return;
    }

    setStepIndex((current) => current + 1);
  }

  function previousStep() {
    setStepIndex((current) => Math.max(0, current - 1));
  }

  function skipTour() {
    markCompleted();

    setActive(false);
    setStepIndex(0);
    setMobileMoreOpen(false);
  }

  function completeTour() {
    markCompleted();

    setActive(false);
    setStepIndex(0);
    setMobileMoreOpen(false);
  }

  /**
   * Restart can be triggered from Settings or Support.
   *
   * We clear completion, return to the main dashboard, and allow the
   * normal dashboard start effect to launch the tour again.
   */
  function restartTour() {
    window.localStorage.removeItem(getDashboardTourStorageKey(userUid));

    setActive(false);
    setStepIndex(0);
    setMobileMoreOpen(false);

    setRestartToken((current) => current + 1);

    if (pathname !== "/dashboard") {
      router.push("/dashboard");

      return;
    }

    window.setTimeout(() => {
      setActive(true);
    }, 200);
  }

  const value = useMemo<DashboardTourContextValue>(
    () => ({
      active,

      currentStep,

      currentStepIndex: stepIndex,

      totalSteps: visibleSteps.length,

      isFirstStep: stepIndex === 0,

      isLastStep: stepIndex === visibleSteps.length - 1,

      isMobile,

      mobileMoreOpen,

      setMobileMoreOpen,

      nextStep,

      previousStep,

      skipTour,

      completeTour,

      restartTour,
    }),
    [
      active,
      currentStep,
      stepIndex,
      visibleSteps.length,
      isMobile,
      mobileMoreOpen,
    ],
  );

  return (
    <DashboardTourContext.Provider value={value}>
      {children}
    </DashboardTourContext.Provider>
  );
}
