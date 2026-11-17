"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

interface HeroCopyEntranceProps {
  children: ReactNode;
  className?: string;
}

export function HeroCopyEntrance({ children, className = "" }: HeroCopyEntranceProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        delay: 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface HeroCardsEntranceProps {
  children: ReactNode;
  className?: string;
}

export function HeroCardsEntrance({ children, className = "" }: HeroCardsEntranceProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.95,
        delay: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
