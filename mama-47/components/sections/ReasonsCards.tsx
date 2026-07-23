"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REASONS, Reason } from "@/lib/reasons";

// ─── Individual Card Component ───────────────────────────────────────────────

function ReasonCard({
  reason,
  onFlip,
}: {
  reason: Reason;
  onFlip: (id: number) => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      onFlip(reason.id);
    } else {
      setIsFlipped(false);
    }
  };

  return (
    <div
      className="group w-full aspect-[3/4] cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={handleFlip}
    >
      <motion.div
        className="w-full h-full relative transition-all duration-500"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-4 
            bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm
            hover:shadow-md transition-shadow"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <span className="text-4xl md:text-5xl font-quicksand font-bold text-rose/80 mb-2">
            #{reason.id}
          </span>
          <span className="text-xl">🐼</span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex items-center justify-center p-3 md:p-4
            bg-gradient-to-br from-blush/90 to-lavender/90 backdrop-blur-md 
            border border-white/50 rounded-2xl shadow-md overflow-hidden"
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden", 
            transform: "rotateY(180deg)" 
          }}
        >
          <p className="text-center text-xs md:text-sm font-quicksand text-rose/90 leading-tight md:leading-snug font-medium">
            {reason.back}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Section Component ──────────────────────────────────────────────────

interface ReasonsCardsProps {
  onComplete: () => void;
}

export default function ReasonsCards({ onComplete }: ReasonsCardsProps) {
  // Track which unique cards have been flipped
  const [flippedIds, setFlippedIds] = useState<Set<number>>(new Set());

  const handleFlip = (id: number) => {
    setFlippedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // Show continue button if at least 3 cards have been flipped
  const showContinue = flippedIds.size >= 3;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 md:py-24 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-quicksand font-semibold text-rose/90 mb-4">
          10 Reasons Why...
        </h2>
        <p className="text-rose/70 font-quicksand text-lg">
          Tap a card to reveal 💌
        </p>
      </motion.div>

      {/* Grid: 2 cols mobile, 5 cols desktop */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 w-full mb-16">
        {REASONS.map((reason, i) => (
          <motion.div
            key={reason.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <ReasonCard reason={reason} onFlip={handleFlip} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showContinue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-rose/70 font-quicksand italic text-sm">
              (You can read the rest, or keep going!)
            </p>
            <button
              onClick={onComplete}
              className="px-8 py-4 bg-white/80 backdrop-blur-md border border-rose/20 
                rounded-full text-rose/80 font-quicksand font-semibold shadow-sm hover:shadow-md 
                hover:bg-white transition-all hover:-translate-y-1"
            >
              Continue ❤️
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
