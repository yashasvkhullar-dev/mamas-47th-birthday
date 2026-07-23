"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────

interface VirtualHugProps {
  onComplete: () => void;
}

type HugPhase = "invite" | "hugging" | "settled";

// ─── Panda SVG: Open Arms Pose ───────────────────────────────────────────────

function PandaOpenArms({ size = 160 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left arm extended outward */}
      <motion.g
        animate={{ rotate: [0, -5, 0, 5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "65px", originY: "110px" }}
      >
        <ellipse cx="38" cy="108" rx="28" ry="12" fill="white" stroke="#3D3D3D" strokeWidth="2" transform="rotate(-25 38 108)" />
        <circle cx="18" cy="98" r="3" fill="#FFD9E8" />
        <circle cx="24" cy="94" r="3" fill="#FFD9E8" />
        <circle cx="14" cy="104" r="2.5" fill="#FFD9E8" />
      </motion.g>

      {/* Right arm extended outward */}
      <motion.g
        animate={{ rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
        style={{ originX: "135px", originY: "110px" }}
      >
        <ellipse cx="162" cy="108" rx="28" ry="12" fill="white" stroke="#3D3D3D" strokeWidth="2" transform="rotate(25 162 108)" />
        <circle cx="182" cy="98" r="3" fill="#FFD9E8" />
        <circle cx="176" cy="94" r="3" fill="#FFD9E8" />
        <circle cx="186" cy="104" r="2.5" fill="#FFD9E8" />
      </motion.g>

      {/* Body */}
      <ellipse cx="100" cy="130" rx="38" ry="28" fill="white" stroke="#3D3D3D" strokeWidth="2" />
      <circle cx="100" cy="127" r="16" fill="#F8F8F8" stroke="#3D3D3D" strokeWidth="0.5" opacity="0.5" />

      {/* Ears */}
      <circle cx="62" cy="42" r="22" fill="#3D3D3D" />
      <circle cx="138" cy="42" r="22" fill="#3D3D3D" />
      <circle cx="62" cy="42" r="12" fill="#555555" />
      <circle cx="138" cy="42" r="12" fill="#555555" />

      {/* Head */}
      <circle cx="100" cy="72" r="44" fill="white" stroke="#3D3D3D" strokeWidth="2" />

      {/* Party hat */}
      <polygon points="100,16 88,42 112,42" fill="#F4C77B" stroke="#8A4A5E" strokeWidth="1" />
      <circle cx="100" cy="15" r="4.5" fill="#FFD9E8" />

      {/* Eye patches */}
      <ellipse cx="82" cy="66" rx="14" ry="12" fill="#3D3D3D" transform="rotate(-6 82 66)" />
      <ellipse cx="118" cy="66" rx="14" ry="12" fill="#3D3D3D" transform="rotate(6 118 66)" />

      {/* Eyes — happy squint */}
      <path d="M76 64 Q82 58 88 64" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M112 64 Q118 58 124 64" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <ellipse cx="100" cy="77" rx="4.5" ry="3" fill="#3D3D3D" />
      <circle cx="98" cy="76" r="1.2" fill="#555555" />

      {/* Big smile */}
      <path d="M90 83 Q100 93 110 83" stroke="#3D3D3D" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Blush cheeks (extra rosy) */}
      <circle cx="68" cy="80" r="8" fill="#FFD9E8" opacity="0.7" />
      <circle cx="132" cy="80" r="8" fill="#FFD9E8" opacity="0.7" />
    </svg>
  );
}

// ─── Panda SVG: Hugging Pose ─────────────────────────────────────────────────

function PandaHugging({ size = 160 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <ellipse cx="100" cy="130" rx="38" ry="28" fill="white" stroke="#3D3D3D" strokeWidth="2" />
      <circle cx="100" cy="127" r="16" fill="#F8F8F8" stroke="#3D3D3D" strokeWidth="0.5" opacity="0.5" />

      {/* Left arm wrapping inward */}
      <motion.g
        initial={{ rotate: -25, x: -20 }}
        animate={{ rotate: 15, x: 10 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ originX: "65px", originY: "115px" }}
      >
        <ellipse cx="55" cy="115" rx="26" ry="11" fill="white" stroke="#3D3D3D" strokeWidth="2" transform="rotate(30 55 115)" />
        <circle cx="68" cy="102" r="3" fill="#FFD9E8" />
        <circle cx="74" cy="106" r="3" fill="#FFD9E8" />
      </motion.g>

      {/* Right arm wrapping inward */}
      <motion.g
        initial={{ rotate: 25, x: 20 }}
        animate={{ rotate: -15, x: -10 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ originX: "135px", originY: "115px" }}
      >
        <ellipse cx="145" cy="115" rx="26" ry="11" fill="white" stroke="#3D3D3D" strokeWidth="2" transform="rotate(-30 145 115)" />
        <circle cx="132" cy="102" r="3" fill="#FFD9E8" />
        <circle cx="126" cy="106" r="3" fill="#FFD9E8" />
      </motion.g>

      {/* Small heart between arms */}
      <motion.g
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "100px", originY: "118px" }}
      >
        <path
          d="M100 126 C100 126 90 118 90 112 C90 108 94 106 97 108 C99 110 100 111 100 111 C100 111 101 110 103 108 C106 106 110 108 110 112 C110 118 100 126 100 126Z"
          fill="#E8637A"
          stroke="#8A4A5E"
          strokeWidth="0.8"
        />
        <circle cx="94" cy="111" r="1.5" fill="white" opacity="0.5" />
      </motion.g>

      {/* Ears */}
      <circle cx="62" cy="42" r="22" fill="#3D3D3D" />
      <circle cx="138" cy="42" r="22" fill="#3D3D3D" />
      <circle cx="62" cy="42" r="12" fill="#555555" />
      <circle cx="138" cy="42" r="12" fill="#555555" />

      {/* Head */}
      <circle cx="100" cy="72" r="44" fill="white" stroke="#3D3D3D" strokeWidth="2" />

      {/* Party hat */}
      <polygon points="100,16 88,42 112,42" fill="#F4C77B" stroke="#8A4A5E" strokeWidth="1" />
      <circle cx="100" cy="15" r="4.5" fill="#FFD9E8" />

      {/* Eye patches */}
      <ellipse cx="82" cy="66" rx="14" ry="12" fill="#3D3D3D" transform="rotate(-6 82 66)" />
      <ellipse cx="118" cy="66" rx="14" ry="12" fill="#3D3D3D" transform="rotate(6 118 66)" />

      {/* Closed happy eyes */}
      <path d="M76 64 Q82 58 88 64" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M112 64 Q118 58 124 64" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <ellipse cx="100" cy="77" rx="4.5" ry="3" fill="#3D3D3D" />

      {/* Warm smile */}
      <path d="M90 83 Q100 95 110 83" stroke="#3D3D3D" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Extra rosy blush */}
      <circle cx="68" cy="80" r="9" fill="#FFD9E8" opacity="0.8" />
      <circle cx="132" cy="80" r="9" fill="#FFD9E8" opacity="0.8" />
    </svg>
  );
}

// ─── Floating Heart Particle ─────────────────────────────────────────────────

function FloatingHeart({ delay, x }: { delay: number; x: number }) {
  const hearts = ["💖", "💕", "💗", "🩷", "💓", "🤍"];
  const heart = hearts[Math.floor(Math.random() * hearts.length)];
  const size = 14 + Math.random() * 18;

  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${x}%`, bottom: -30, fontSize: size }}
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 0.9, 0.9, 0],
        y: [0, -300 - Math.random() * 400],
        x: [0, (Math.random() - 0.5) * 80],
        rotate: [0, (Math.random() - 0.5) * 40],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay: delay,
        ease: "easeOut",
      }}
    >
      {heart}
    </motion.div>
  );
}

// ─── Main VirtualHug Component ───────────────────────────────────────────────

export default function VirtualHug({ onComplete }: VirtualHugProps) {
  const [phase, setPhase] = useState<HugPhase>("invite");
  const [hearts, setHearts] = useState<{ id: number; delay: number; x: number }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const heartIdRef = useRef(0);

  // Start the hug animation
  const triggerHug = useCallback(() => {
    if (phase !== "invite") return;
    setPhase("hugging");

    // Play heartbeat audio
    try {
      audioRef.current = new Audio("/audio/heartbeat.mp3");
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    } catch {
      // Audio not available — graceful fallback
    }

    // Spawn floating hearts in waves
    const newHearts: { id: number; delay: number; x: number }[] = [];
    for (let i = 0; i < 30; i++) {
      newHearts.push({
        id: heartIdRef.current++,
        delay: i * 0.15,
        x: 5 + Math.random() * 90,
      });
    }
    setHearts(newHearts);

    // After ~3.5s, settle
    setTimeout(() => {
      setPhase("settled");
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }, 3500);
  }, [phase]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative flex flex-col items-center gap-8 text-center px-4 min-h-[70vh] justify-center w-full"
    >
      {/* ── Full-screen glow overlay during hug ── */}
      <AnimatePresence>
        {phase === "hugging" && (
          <motion.div
            key="glow-overlay"
            className="fixed inset-0 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Radial glow pulse */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at center, rgba(255,217,232,0.5) 0%, rgba(244,199,123,0.25) 35%, rgba(231,217,247,0.15) 60%, transparent 80%)",
              }}
              animate={{
                scale: [0.3, 1.2, 1.0, 1.15, 1.0],
                opacity: [0, 0.9, 0.7, 0.85, 0.6],
              }}
              transition={{ duration: 3.5, ease: "easeInOut" }}
            />

            {/* Second pulse ring */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at center, rgba(255,217,232,0.3) 0%, transparent 50%)",
              }}
              animate={{
                scale: [0.5, 1.5, 1.0],
                opacity: [0.5, 0, 0.3],
              }}
              transition={{ duration: 2, repeat: 1, ease: "easeOut" }}
            />

            {/* Floating hearts container */}
            <div className="absolute inset-0 overflow-hidden">
              {hearts.map((h) => (
                <FloatingHeart key={h.id} delay={h.delay} x={h.x} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Invite Phase ── */}
      <AnimatePresence mode="wait">
        {phase === "invite" && (
          <motion.div
            key="invite"
            className="flex flex-col items-center gap-6"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            {/* Prompt text */}
            <motion.p
              className="font-caveat text-2xl sm:text-3xl text-rose/80 leading-relaxed max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Come here, Mama. Let me give you a hug. 🤗
            </motion.p>

            {/* Panda button */}
            <motion.button
              onClick={triggerHug}
              className="relative cursor-pointer rounded-full p-6 focus:outline-none group"
              style={{
                background: "radial-gradient(circle, rgba(255,217,232,0.6) 0%, rgba(231,217,247,0.4) 60%, transparent 100%)",
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
            >
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-blush/40"
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Outer glow */}
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(255,217,232,0)",
                    "0 0 40px rgba(255,217,232,0.5)",
                    "0 0 0px rgba(255,217,232,0)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              <PandaOpenArms size={160} />
            </motion.button>

            <motion.p
              className="font-quicksand text-sm text-rose/40"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              tap for a hug
            </motion.p>
          </motion.div>
        )}

        {/* ── Hugging Phase ── */}
        {phase === "hugging" && (
          <motion.div
            key="hugging"
            className="relative z-50 flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            {/* Gentle bob */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <PandaHugging size={180} />
            </motion.div>

            <motion.p
              className="font-caveat text-xl sm:text-2xl text-rose/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0.8] }}
              transition={{ delay: 0.5, duration: 2 }}
            >
              *squeeeeeze* 🤗💖
            </motion.p>
          </motion.div>
        )}

        {/* ── Settled Phase ── */}
        {phase === "settled" && (
          <motion.div
            key="settled"
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Gentle bob on settled panda */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <PandaHugging size={140} />
            </motion.div>

            <motion.p
              className="font-caveat text-xl sm:text-2xl text-rose/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              I love you, Mama. Always. 💛
            </motion.p>

            {/* Continue button */}
            <motion.button
              onClick={onComplete}
              className="mt-4 px-8 py-3.5 rounded-full font-quicksand font-medium text-rose cursor-pointer
                         bg-blush/60 hover:bg-blush active:scale-95 transition-all duration-200
                         shadow-md hover:shadow-lg border border-blush/30"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Continue to Photo Gallery 📸
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
