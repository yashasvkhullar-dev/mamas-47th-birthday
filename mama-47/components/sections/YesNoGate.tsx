"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import SoftButton from "@/components/ui/SoftButton";

// ─── Animated counter 0 → 47 ────────────────────────────────────────────────

function AgeCounter({ onComplete }: { onComplete: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const TARGET = 47;

  useEffect(() => {
    if (!isInView || done) return;

    // Animate from 0 to 47 over ~2s with ease-out feel
    const totalDuration = 2000;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      // ease-out cubic
      const t = Math.min(elapsed / totalDuration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(eased * TARGET);

      setCount(val);

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        setDone(true);
        setTimeout(onComplete, 600);
      }
    }

    requestAnimationFrame(tick);
  }, [isInView, done, onComplete]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <span className="font-caveat text-2xl sm:text-3xl text-rose/70">
        Happy Birthday Mama 🐼💗
      </span>

      {/* Big animated number */}
      <motion.span
        className="font-quicksand font-bold text-rose leading-none"
        style={{ fontSize: "clamp(5rem, 15vw, 10rem)" }}
        animate={
          done
            ? {
                scale: [1, 1.1, 1],
                textShadow: [
                  "0 0 0px rgba(138,74,94,0)",
                  "0 0 30px rgba(244,199,123,0.5)",
                  "0 0 0px rgba(138,74,94,0)",
                ],
              }
            : {}
        }
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        {count}
      </motion.span>

      <motion.span
        className="text-rose/40 font-quicksand text-base tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0.4 }}
      >
        years of love
      </motion.span>
    </motion.div>
  );
}

// ─── Dodge "No" Button ───────────────────────────────────────────────────────

function DodgeNoButton({ attempts, onAttempt }: { attempts: number; onAttempt: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dodged, setDodged] = useState(false);

  const relocate = useCallback(() => {
    const container = containerRef.current?.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    // keep within container with padding
    const pad = 80;
    const maxX = rect.width - pad * 2;
    const maxY = Math.min(rect.height - pad, 200);
    const newX = Math.random() * maxX - maxX / 2;
    const newY = Math.random() * maxY - maxY / 2;

    setPos({ x: newX, y: newY });
    setDodged(true);
    onAttempt();
  }, [onAttempt]);

  return (
    <motion.div
      ref={containerRef}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 400, damping: 20, mass: 0.8 }}
      onHoverStart={relocate}
      onClick={(e) => {
        e.preventDefault();
        relocate();
      }}
      className="cursor-pointer"
    >
      <motion.div
        animate={dodged ? { rotate: [0, -15, 15, 0] } : {}}
        transition={{ duration: 0.3 }}
      >
        <SoftButton variant="ghost" size="sm" className="opacity-60 pointer-events-none">
          Hmm, not yet...
        </SoftButton>
      </motion.div>

      {/* Teasing caption after 3 failed attempts */}
      <AnimatePresence>
        {attempts >= 3 && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-caveat text-sm text-rose/50 text-center mt-2 whitespace-nowrap"
          >
            aww, come on, you know you want to 🐼
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main YesNoGate ──────────────────────────────────────────────────────────

interface YesNoGateProps {
  onComplete: () => void;
}

export default function YesNoGate({ onComplete }: YesNoGateProps) {
  const [phase, setPhase] = useState<"counter" | "question" | "celebrating">("counter");
  const [noAttempts, setNoAttempts] = useState(0);

  const handleCounterDone = useCallback(() => {
    setPhase("question");
  }, []);

  const handleYes = () => {
    setPhase("celebrating");
    setTimeout(() => {
      onComplete();
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-8 text-center px-4 min-h-[60vh] justify-center"
    >
      {/* Phase 1: Age counter */}
      <AgeCounter onComplete={handleCounterDone} />

      {/* Phase 2: Question + Buttons */}
      <AnimatePresence>
        {(phase === "question" || phase === "celebrating") && (
          <motion.div
            key="question-block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="font-quicksand text-lg sm:text-xl text-rose/70 max-w-md">
              Would you like to see what I made for you? 🐼🩷
            </p>

            {phase === "question" && (
              <motion.div
                className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ minHeight: 120, minWidth: 320 }}
              >
                <SoftButton
                  onClick={handleYes}
                  variant="primary"
                  size="lg"
                  className="min-w-[160px] text-lg z-10"
                >
                  Yes, let&apos;s go! 🎂
                </SoftButton>

                <DodgeNoButton
                  attempts={noAttempts}
                  onAttempt={() => setNoAttempts((c) => c + 1)}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 3: Celebration */}
      <AnimatePresence>
        {phase === "celebrating" && (
          <motion.div
            key="celebrate"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.span
              className="text-6xl"
              animate={{ scale: [1, 1.4, 1], rotate: [0, 15, -10, 0] }}
              transition={{ duration: 0.8 }}
            >
              🥳
            </motion.span>
            <p className="font-caveat text-2xl sm:text-3xl text-rose">
              Yay! Let&apos;s celebrate!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
