"use client";

import { useContext } from "react";

import { DashboardTourContext } from "./tour-provider";

/**
 * Central accessor for dashboard onboarding.
 *
 * Throwing here is intentional: if a component calls this hook outside
 * DashboardTourProvider, that is a developer/setup error we want to
 * discover immediately rather than silently ignoring.
 */
export function useDashboardTour() {
  const context = useContext(DashboardTourContext);

  if (!context) {
    throw new Error(
      "useDashboardTour must be used inside DashboardTourProvider.",
    );
  }

  return context;
}
