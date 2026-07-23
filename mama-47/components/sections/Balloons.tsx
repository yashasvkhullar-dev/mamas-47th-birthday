"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Balloon config ──────────────────────────────────────────────────────────

const BALLOON_COLORS = [
  "#FFD9E8", // blush
  "#E7D9F7", // lavender
  "#F4C77B", // gold
  "#FFB3C6", // soft pink
  "#B5EAD7", // mint
  "#C7CEEA", // periwinkle
  "#FFDAC1", // peach
  "#FF9AA2", // coral
  "#E2F0CB", // lime
  "#DCD3FF", // lilac
];

interface BalloonData {
  id: number;
  color: string;
  x: number; // horizontal position %
  delay: number;
  drift: number; // horizontal sway amount
  size: number;
  speed: number; // duration of float-up
}

function generateBalloons(count: number): BalloonData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: BALLOON_COLORS[i % BALLOON_COLORS.length],
    x: 8 + (i * (84 / count)) + (Math.random() * 6 - 3),
    delay: Math.random() * 1.2,
    drift: 15 + Math.random() * 25,
    size: 48 + Math.random() * 20,
    speed: 3.5 + Math.random() * 2,
  }));
}

// ─── Single Balloon SVG ──────────────────────────────────────────────────────

function BalloonSVG({
  color,
  size,
}: {
  color: string;
  size: number;
}) {
  // Darken color slightly for the string
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 60 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Balloon body */}
      <ellipse cx="30" cy="28" rx="22" ry="26" fill={color} />
      {/* Highlight */}
      <ellipse cx="22" cy="18" rx="6" ry="8" fill="white" opacity="0.35" />
      {/* Knot */}
      <polygon points="27,54 30,58 33,54" fill={color} />
      {/* String */}
      <path
        d="M30 58 Q32 68 28 78"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

// ─── Single Balloon Component ────────────────────────────────────────────────

function Balloon({
  balloon,
  onPop,
}: {
  balloon: BalloonData;
  onPop: (id: number, x: number, y: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handlePop = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      onPop(balloon.id, rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  };

  return (
    <motion.div
      ref={ref}
      className="absolute cursor-pointer select-none"
      style={{
        left: `${balloon.x}%`,
        bottom: 0,
        zIndex: 10,
      }}
      initial={{ y: 100, opacity: 0 }}
      animate={{
        y: [100, -(window?.innerHeight || 600) * 0.65],
        x: [0, balloon.drift, -balloon.drift * 0.6, balloon.drift * 0.4, 0],
        opacity: 1,
      }}
      transition={{
        y: {
          duration: balloon.speed,
          delay: balloon.delay,
          ease: "easeOut",
        },
        x: {
          duration: balloon.speed * 1.5,
          delay: balloon.delay,
          repeat: Infinity,
          ease: "easeInOut",
        },
        opacity: {
          duration: 0.4,
          delay: balloon.delay,
        },
      }}
      whileHover={{ scale: 1.12 }}
      onClick={handlePop}
      exit={{
        scale: [1, 1.4, 0],
        opacity: [1, 0.8, 0],
        transition: { duration: 0.25, ease: "easeOut" },
      }}
    >
      <BalloonSVG color={balloon.color} size={balloon.size} />
    </motion.div>
  );
}

// ─── Main Balloons Section ───────────────────────────────────────────────────

interface BalloonsProps {
  onComplete: () => void;
}

export default function Balloons({ onComplete }: BalloonsProps) {
  const [balloons, setBalloons] = useState<BalloonData[]>([]);
  const [popped, setPopped] = useState<Set<number>>(new Set());
  const [allPopped, setAllPopped] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Generate balloons client-side only (avoids SSR hydration mismatch with window/random)
  useEffect(() => {
    setBalloons(generateBalloons(10));
  }, []);

  const totalBalloons = balloons.length;

  const handlePop = useCallback(
    (id: number, x: number, y: number) => {
      setPopped((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);

        // Trigger confetti at pop position
        import("canvas-confetti").then((confettiModule) => {
          const confetti = confettiModule.default;
          confetti({
            particleCount: 25,
            spread: 50,
            startVelocity: 15,
            origin: {
              x: x / window.innerWidth,
              y: y / window.innerHeight,
            },
            colors: ["#FFD9E8", "#E7D9F7", "#F4C77B", "#FFB3C6", "#B5EAD7"],
            gravity: 0.8,
            scalar: 0.8,
            ticks: 100,
          });
        });

        // Check if all popped
        if (next.size >= totalBalloons && totalBalloons > 0) {
          setTimeout(() => setAllPopped(true), 500);
          setTimeout(() => onCompleteRef.current(), 3000);
        }

        return next;
      });
    },
    [totalBalloons]
  );

  const remaining = totalBalloons - popped.size;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative flex flex-col items-center gap-6 text-center px-4 min-h-[60vh] justify-center w-full"
    >
      <motion.span className="text-5xl sm:text-6xl">🎈</motion.span>

      <h2 className="font-caveat text-3xl sm:text-4xl font-bold text-rose">
        Let the colors fly 🎈
      </h2>

      <p className="font-quicksand text-rose/60 text-base sm:text-lg max-w-sm">
        Pop all the balloons!{" "}
        <span className="text-rose font-medium">{remaining}</span> remaining
      </p>

      {/* Balloon field */}
      <div className="relative w-full" style={{ height: "45vh", minHeight: 320 }}>
        <AnimatePresence>
          {balloons
            .filter((b) => !popped.has(b.id))
            .map((b) => (
              <Balloon key={b.id} balloon={b} onPop={handlePop} />
            ))}
        </AnimatePresence>
      </div>

      {/* "Almost there" message after all popped */}
      <AnimatePresence>
        {allPopped && (
          <motion.div
            key="almost-there"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.p
              className="font-caveat text-2xl sm:text-3xl text-rose"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              Almost there... 🐼
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
