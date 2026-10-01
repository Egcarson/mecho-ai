/**
 * A tour step may target different elements depending on whether the
 * dashboard is using its desktop or mobile navigation.
 *
 * Steps without a target are rendered as centered introduction/completion
 * cards rather than spotlight tooltips.
 */
export type DashboardTourStep = {
  id:
    | "welcome"
    | "composer"
    | "create"
    | "projects"
    | "library"
    | "more"
    | "settings"
    | "support"
    | "finish";

  title: string;
  description: string;

  desktopTarget?: string;
  mobileTarget?: string;

  /**
   * Used for navigation concepts that only exist in one responsive layout.
   *
   * "More" is mobile-only because desktop already exposes Settings/Support
   * directly in the sidebar.
   */
  mobileOnly?: boolean;
  desktopOnly?: boolean;
};

export const DASHBOARD_TOUR_STEPS: DashboardTourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Mecho",
    description:
      "Your workspace for turning ideas into social content, campaigns, speeches and creative media.",
  },

  {
    id: "composer",
    title: "Start with an idea",
    description:
      "Tell Mecho what you want to achieve in your own words. You do not need to know which workflow to choose first.",
    desktopTarget: "smart-composer",
    mobileTarget: "smart-composer",
  },

  {
    id: "create",
    title: "Create your way",
    description:
      "Already know what you want to make? Jump directly into Social, Campaign or Speech from Create.",
    desktopTarget: "desktop-create",
    mobileTarget: "mobile-create",
  },

  {
    id: "projects",
    title: "Keep work organised",
    description:
      "Your work is organised into projects so you can return, continue creating and keep related generations together.",
    desktopTarget: "desktop-projects",
    mobileTarget: "mobile-projects",
  },

  {
    id: "library",
    title: "Your creative assets",
    description:
      "Library keeps generated images, voice files and other reusable media together in one place.",
    desktopTarget: "desktop-library",
    mobileTarget: "mobile-library",
  },

  {
    id: "more",
    title: "More tools",
    description:
      "History, Settings and Support live here on mobile. We'll show you the important ones next.",
    mobileTarget: "mobile-more",
    mobileOnly: true,
  },

  {
    id: "settings",
    title: "Make Mecho yours",
    description:
      "Manage your profile, creative preferences, password and account settings here.",
    desktopTarget: "desktop-settings",
    mobileTarget: "mobile-settings",
  },

  {
    id: "support",
    title: "Help when you need it",
    description:
      "Find answers, browse common questions or contact Mecho Support whenever something needs attention.",
    desktopTarget: "desktop-support",
    mobileTarget: "mobile-support",
  },

  {
    id: "finish",
    title: "You're ready",
    description:
      "Start with an idea and let Mecho help shape the message, creative direction and final output.",
  },
];

/**
 * Bump this value whenever the onboarding changes significantly enough
 * that existing users should be shown the new version.
 */
export const DASHBOARD_TOUR_VERSION = "v1";

export function getDashboardTourStorageKey(userUid: string) {
  return `mecho_dashboard_tour_${DASHBOARD_TOUR_VERSION}:${userUid}`;
}
