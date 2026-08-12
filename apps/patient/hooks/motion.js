export const easeOut = [0.22, 1, 0.36, 1];

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => {
    if (prefersReducedMotion()) {
      return { opacity: 1, y: 0, transition: { duration: 0 } };
    }
    return {
      opacity: 1,
      y: 0,
      transition: {
        delay: typeof i === "number" ? 0.05 * i : 0,
        duration: 0.4,
        ease: easeOut,
      },
    };
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: () => {
    if (prefersReducedMotion()) {
      return { opacity: 1, transition: { duration: 0 } };
    }
    return {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.08,
      },
    };
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: () => {
    if (prefersReducedMotion()) {
      return { opacity: 1, y: 0, transition: { duration: 0 } };
    }
    return {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: easeOut },
    };
  },
};

export const scaleTap = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring", stiffness: 420, damping: 28 },
};

/** Disable hover/tap scale when user prefers reduced motion. */
export function getScaleTap() {
  if (prefersReducedMotion()) {
    return {
      whileHover: undefined,
      whileTap: undefined,
      transition: { duration: 0 },
    };
  }
  return scaleTap;
}
