"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Hardcoded target: July 24, 2026 at 7:00 AM IST (UTC+5:30)
const TARGET_DATE = new Date("2026-07-24T00:00:00+05:30").getTime();

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** A single animated digit that does a flip/pop when value changes */
function CountdownDigit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="
          relative overflow-hidden
          bg-white/60 backdrop-blur-md
          border border-blush/40
          rounded-3xl
          shadow-[0_8px_32px_rgba(138,74,94,0.08),0_2px_8px_rgba(255,217,232,0.3)]
          px-5 py-4 sm:px-7 sm:py-5
          min-w-[80px] sm:min-w-[100px]
          group
          hover:shadow-[0_12px_40px_rgba(138,74,94,0.12),0_4px_16px_rgba(255,217,232,0.4)]
          hover:-translate-y-1
          transition-all duration-300
        "
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blush/10 via-transparent to-lavender/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="
              block text-center relative z-10
              font-quicksand font-bold
              text-[2.5rem] sm:text-[3.5rem]
              leading-none
              text-rose
            "
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>

      <span className="text-xs sm:text-sm font-quicksand font-medium tracking-[0.15em] uppercase text-rose/50">
        {label}
      </span>
    </div>
  );
}

/** Blinking colon separator */
function Separator() {
  return (
    <motion.span
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      className="font-quicksand font-bold text-3xl sm:text-4xl text-blush self-start mt-4 sm:mt-5 select-none"
    >
      :
    </motion.span>
  );
}

interface CountdownProps {
  onComplete: () => void;
}

export default function Countdown({ onComplete }: CountdownProps) {
  const calculateTimeLeft = useCallback((): TimeLeft | null => {
    const diff = TARGET_DATE - Date.now();
    if (diff <= 0) return null;

    const totalSeconds = Math.floor(diff / 1000);
    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  }, []);

  // Start as null to avoid SSR/client hydration mismatch on time values
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    // Check immediately on mount in case target has already passed
    const initial = calculateTimeLeft();
    if (!initial) {
      setHasCompleted(true);
      onComplete();
      return;
    }
    setTimeLeft(initial);

    const tick = () => {
      const remaining = calculateTimeLeft();
      if (!remaining) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setHasCompleted(true);
        // Small delay for the "00:00:00" to render before fading out
        setTimeout(onComplete, 800);
        return;
      }
      setTimeLeft(remaining);
      // Drift-corrected: align to the next whole second
      const drift = Date.now() % 1000;
      timerId = setTimeout(tick, 1000 - drift);
    };

    let timerId = setTimeout(tick, 1000 - (Date.now() % 1000));
    return () => clearTimeout(timerId);
  }, [calculateTimeLeft, onComplete]);

  // If already past the target on mount, render nothing (parent handles transition)
  if (hasCompleted && !timeLeft) return null;

  // Show "--" during SSR / before mount, real values after
  const t = hasMounted && timeLeft
    ? timeLeft
    : { hours: -1, minutes: -1, seconds: -1 };
  const display = (n: number) => (n < 0 ? "--" : pad(n));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40, scale: 0.95 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center gap-8"
    >
      {/* Sparkle + subtitle */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.span
          className="text-2xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          ✨
        </motion.span>
        <span className="font-caveat text-xl sm:text-2xl text-rose/70">
          Get Ready to Celebrate
        </span>
      </motion.div>

      {/* Title */}
      <div className="text-center">
        <h1 className="font-quicksand font-bold text-3xl sm:text-5xl text-rose leading-tight">
          Mama&apos;s{" "}
          <span className="text-gold drop-shadow-[0_0_20px_rgba(244,199,123,0.4)]">
            47th
          </span>{" "}
          Birthday
        </h1>
        <motion.p
          className="mt-3 text-rose/50 font-quicksand text-sm sm:text-base tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Something beautiful is about to begin...
        </motion.p>
      </div>

      {/* Timer digits */}
      <div className="flex items-start gap-2 sm:gap-4">
        <CountdownDigit value={display(t.hours)} label="Hours" />
        <Separator />
        <CountdownDigit value={display(t.minutes)} label="Minutes" />
        <Separator />
        <CountdownDigit value={display(t.seconds)} label="Seconds" />
      </div>

      {/* Date badge */}
      <motion.div
        className="
          inline-flex items-center gap-2
          bg-white/50 backdrop-blur-sm
          border border-blush/30
          rounded-full
          px-5 py-2
          text-sm text-rose/60 font-quicksand
        "
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <span>🗓️</span>
        <span>July 24, 2026</span>
      </motion.div>

      {/* Hearts */}
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="text-lg"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            💖
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
