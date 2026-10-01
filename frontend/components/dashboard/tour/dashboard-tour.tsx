"use client";

import { useCallback, useEffect, useState } from "react";

import { AnimatePresence } from "motion/react";

import { TourOverlay, type TourTargetRect } from "./tour-overlay";

import { TourPopover } from "./tour-popover";

import { useDashboardTour } from "./use-dashboard-tour";

type PopoverPosition = {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
};

/**
 * DashboardTour
 *
 * Responsible for the browser/DOM side of onboarding:
 *
 * - finding [data-tour] elements
 * - scrolling targets into view
 * - measuring spotlight coordinates
 * - positioning the explanation card
 * - keyboard navigation
 *
 * Product state and persistence remain inside DashboardTourProvider.
 */
export function DashboardTour() {
  const {
    active,
    currentStep,
    currentStepIndex,
    totalSteps,
    isFirstStep,
    isLastStep,
    isMobile,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
  } = useDashboardTour();

  const [targetRect, setTargetRect] = useState<TourTargetRect | null>(null);

  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({});

  const targetId = currentStep
    ? isMobile
      ? currentStep.mobileTarget
      : currentStep.desktopTarget
    : undefined;

  const measureTarget = useCallback(() => {
    if (!active || !currentStep || !targetId) {
      setTargetRect(null);

      setPopoverPosition({});

      return false;
    }

    const element = document.querySelector<HTMLElement>(
      `[data-tour="${targetId}"]`,
    );

    if (!element) {
      return false;
    }

    const rect = element.getBoundingClientRect();

    const nextRect = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    setTargetRect(nextRect);

    setPopoverPosition(calculatePopoverPosition(nextRect, isMobile));

    return true;
  }, [active, currentStep, targetId, isMobile]);

  /**
   * Find and measure the target after every step.
   *
   * Mobile Settings/Support need a few retries because Radix Sheet is
   * mounted/animated after the step changes.
   */
  useEffect(() => {
    if (!active || !currentStep) {
      setTargetRect(null);

      return;
    }

    if (!targetId) {
      setTargetRect(null);

      return;
    }

    let cancelled = false;

    let attempts = 0;

    let retryTimer: number | undefined;

    const locate = () => {
      if (cancelled) {
        return;
      }

      const element = document.querySelector<HTMLElement>(
        `[data-tour="${targetId}"]`,
      );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });

        window.setTimeout(() => {
          if (!cancelled) {
            measureTarget();
          }
        }, 260);

        return;
      }

      attempts += 1;

      /**
       * Missing targets must never crash or permanently trap onboarding.
       *
       * Retry while responsive UI/portals mount. If it still cannot be
       * found, simply advance to the next step.
       */
      if (attempts < 12) {
        retryTimer = window.setTimeout(locate, 120);

        return;
      }

      nextStep();
    };

    locate();

    return () => {
      cancelled = true;

      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
    };
  }, [active, currentStep, targetId, measureTarget, nextStep]);

  /**
   * Keep spotlight aligned during scrolling/resizing.
   */
  useEffect(() => {
    if (!active) {
      return;
    }

    const update = () => {
      measureTarget();
    };

    window.addEventListener("resize", update);

    window.addEventListener("scroll", update, true);

    return () => {
      window.removeEventListener("resize", update);

      window.removeEventListener("scroll", update, true);
    };
  }, [active, measureTarget]);

  /**
   * Keyboard support:
   * Esc       → Skip
   * ArrowLeft → Back
   * ArrowRight→ Next
   */
  useEffect(() => {
    if (!active) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        skipTour();

        return;
      }

      if (event.key === "ArrowLeft" && !isFirstStep) {
        previousStep();

        return;
      }

      if (event.key === "ArrowRight" && !isLastStep) {
        nextStep();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, isFirstStep, isLastStep, nextStep, previousStep, skipTour]);

  if (!active || !currentStep) {
    return null;
  }

  const centered = !targetId;

  return (
    <AnimatePresence>
      <div
        key="dashboard-tour"
        className="
          fixed
          inset-0
          z-[79]
        "
      >
        <TourOverlay targetRect={targetRect} />

        <TourPopover
          step={currentStep}
          stepNumber={currentStepIndex + 1}
          totalSteps={totalSteps}
          isFirst={isFirstStep}
          isLast={isLastStep}
          isCentered={centered}
          style={popoverPosition}
          onBack={previousStep}
          onNext={nextStep}
          onSkip={skipTour}
          onComplete={completeTour}
        />
      </div>
    </AnimatePresence>
  );
}

/**
 * Keep the tour card comfortably inside the viewport.
 *
 * Mobile:
 * - targets in the lower half get a top explanation card
 * - targets in the upper half get a bottom explanation card
 *
 * Desktop:
 * - prefer placing the card beside the target
 * - fall back to above/below when horizontal space is limited
 */
function calculatePopoverPosition(
  rect: TourTargetRect,
  isMobile: boolean,
): PopoverPosition {
  const viewportWidth = window.innerWidth;

  const viewportHeight = window.innerHeight;

  const gap = 18;

  if (isMobile) {
    if (rect.top > viewportHeight * 0.5) {
      return {
        top: 18,
        left: 16,
      };
    }

    return {
      bottom: 18,
      left: 16,
    };
  }

  const cardWidth = 390;

  const roomOnRight = viewportWidth - (rect.left + rect.width);

  if (roomOnRight > cardWidth + 40) {
    return {
      top: Math.max(20, Math.min(rect.top, viewportHeight - 360)),

      left: rect.left + rect.width + gap,
    };
  }

  if (rect.left > cardWidth + 40) {
    return {
      top: Math.max(20, Math.min(rect.top, viewportHeight - 360)),

      left: rect.left - cardWidth - gap,
    };
  }

  const below = rect.top + rect.height + gap;

  if (below < viewportHeight - 340) {
    return {
      top: below,

      left: Math.max(20, Math.min(rect.left, viewportWidth - cardWidth - 20)),
    };
  }

  return {
    top: Math.max(20, rect.top - 330 - gap),

    left: Math.max(20, Math.min(rect.left, viewportWidth - cardWidth - 20)),
  };
}
