"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Countdown from "@/components/sections/Countdown";
import YesNoGate from "@/components/sections/YesNoGate";
import LightsOn from "@/components/sections/LightsOn";
import MusicPlayer from "@/components/sections/MusicPlayer";
import Balloons from "@/components/sections/Balloons";
import LoveLetter from "@/components/sections/LoveLetter";
import VirtualHug from "@/components/sections/VirtualHug";
import PhotoGallery from "@/components/sections/PhotoGallery";
import ReasonsCards from "@/components/sections/ReasonsCards";
import { useBirthdayStore } from "@/lib/store";

// ─── Step definitions ────────────────────────────────────────────────────────

type JourneyStep =
  | "countdown"
  | "yesNoGate"
  | "lightsOn"
  | "musicPlayer"
  | "balloons"
  | "loveLetter"
  | "virtualHug"
  | "photoGallery"
  | "reasonsCards";

const STEP_ORDER: JourneyStep[] = [
  "countdown",
  "yesNoGate",
  "lightsOn",
  "musicPlayer",
  "balloons",
  "loveLetter",
  "virtualHug",
  "photoGallery",
  "reasonsCards",
];

// ─── Floating background orbs (shared across all steps) ─────────────────────

function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${30 + i * 18}px`,
            height: `${30 + i * 18}px`,
            background:
              i % 4 === 0
                ? "rgba(255,217,232,0.25)"
                : i % 4 === 1
                ? "rgba(231,217,247,0.2)"
                : i % 4 === 2
                ? "rgba(244,199,123,0.18)"
                : "rgba(255,217,232,0.15)",
            left: `${5 + ((i * 13) % 85)}%`,
            top: `${8 + ((i * 17 + 5) % 75)}%`,
          }}
          animate={{
            y: [0, -15 - i * 3, 0],
            scale: [1, 1.08, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 4 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
}

// ─── Section reveal wrapper ─────────────────────────────────────────────────

function RevealSection({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Auto-scroll this section into view when it mounts
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function Home() {
  const countdownComplete = useBirthdayStore((s) => s.countdownComplete);
  const setCountdownComplete = useBirthdayStore((s) => s.setCountdownComplete);
  const goToNextStep = useBirthdayStore((s) => s.goToNextStep);

  // Track which journey steps have been completed (unlocks the next one)
  const [completedSteps, setCompletedSteps] = useState<Set<JourneyStep>>(
    new Set()
  );

  const markComplete = useCallback((step: JourneyStep) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(step);
      return next;
    });
  }, []);

  const handleCountdownComplete = useCallback(() => {
    setCountdownComplete();
    markComplete("countdown");
  }, [setCountdownComplete, markComplete]);

  // Determine which steps to show
  const visibleSteps: JourneyStep[] = [];
  for (const step of STEP_ORDER) {
    if (step === "countdown") {
      visibleSteps.push(step);
      if (!completedSteps.has(step)) break;
      continue;
    }
    // Only show if the previous step is completed
    const prevIndex = STEP_ORDER.indexOf(step) - 1;
    if (prevIndex >= 0 && completedSteps.has(STEP_ORDER[prevIndex])) {
      visibleSteps.push(step);
      if (!completedSteps.has(step)) break;
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center relative overflow-x-hidden">
      <BackgroundOrbs />

      {/* Content stack */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center">
        {/* ── Countdown ── */}
        {!countdownComplete && (
          <div className="min-h-screen w-full flex items-center justify-center px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key="countdown"
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeIn" }}
              >
                <Countdown onComplete={handleCountdownComplete} />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* ── Journey sections (post-countdown) ── */}
        {countdownComplete && (
          <div className="w-full flex flex-col items-center gap-0 py-12">
            {/* YesNoGate */}
            {visibleSteps.includes("yesNoGate") && (
              <RevealSection id="yesno">
                <YesNoGate
                  onComplete={() => {
                    markComplete("yesNoGate");
                    goToNextStep(); // advance store step
                  }}
                />
              </RevealSection>
            )}

            {/* LightsOn */}
            {visibleSteps.includes("lightsOn") && (
              <RevealSection id="lights">
                <LightsOn
                  onComplete={() => {
                    markComplete("lightsOn");
                    goToNextStep();
                  }}
                />
              </RevealSection>
            )}

            {/* MusicPlayer */}
            {visibleSteps.includes("musicPlayer") && (
              <RevealSection id="music">
                <MusicPlayer
                  onComplete={() => {
                    markComplete("musicPlayer");
                    goToNextStep();
                  }}
                />
              </RevealSection>
            )}

            {/* Balloons */}
            {visibleSteps.includes("balloons") && (
              <RevealSection id="balloons">
                <Balloons
                  onComplete={() => {
                    markComplete("balloons");
                    goToNextStep();
                  }}
                />
              </RevealSection>
            )}

            {/* LoveLetter */}
            {visibleSteps.includes("loveLetter") && (
              <RevealSection id="love-letter">
                <LoveLetter
                  onComplete={() => {
                    markComplete("loveLetter");
                    goToNextStep();
                  }}
                />
              </RevealSection>
            )}

            {/* VirtualHug */}
            {visibleSteps.includes("virtualHug") && (
              <RevealSection id="virtual-hug">
                <VirtualHug
                  onComplete={() => {
                    markComplete("virtualHug");
                    goToNextStep();
                  }}
                />
              </RevealSection>
            )}

            {/* PhotoGallery */}
            {visibleSteps.includes("photoGallery") && (
              <RevealSection id="photo-gallery">
                <PhotoGallery
                  onComplete={() => {
                    markComplete("photoGallery");
                    goToNextStep();
                  }}
                />
              </RevealSection>
            )}

            {/* Reasons Cards */}
            {visibleSteps.includes("reasonsCards") && (
              <RevealSection id="reasons-cards">
                <ReasonsCards
                  onComplete={() => {
                    markComplete("reasonsCards");
                    goToNextStep();
                  }}
                />
              </RevealSection>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <motion.footer
        className="fixed bottom-0 left-0 right-0 text-center py-4 z-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-rose/30 text-xs font-quicksand">
          Made with{" "}
          <motion.span
            className="inline-block"
            animate={{ scale: [1, 1.3, 1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ❤️
          </motion.span>{" "}
          by Yashasv Khullar
        </p>
      </motion.footer>
    </main>
  );
}
