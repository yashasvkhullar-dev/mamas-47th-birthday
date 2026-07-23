"use client";

import { motion, type Variants } from "framer-motion";
import clsx from "clsx";

// ─── Types ───────────────────────────────────────────────────────────────────
export type PandaPose =
  | "peeking"
  | "waving"
  | "sleeping"
  | "holding-heart"
  | "jumping"
  | "loading-spin";

export interface KawaiiPandaProps {
  /** Pixel size (width & height of the SVG viewBox mapping) */
  size?: number;
  /** Which pose to render */
  pose?: PandaPose;
  /** Enable a gentle breathing/bob idle loop */
  idle?: boolean;
  /** Extra CSS class for the wrapper */
  className?: string;
  /** Accessible label override */
  ariaLabel?: string;
}

// ─── Animation Presets ───────────────────────────────────────────────────────

/** Subtle breathing idle loop applied to the outermost wrapper */
const idleBreathing: Variants = {
  idle: {
    y: [0, -3, 0],
    scale: [1, 1.015, 1],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

/** Spinning loader */
const spinVariant: Variants = {
  spin: {
    rotate: 360,
    transition: { duration: 1.6, repeat: Infinity, ease: "linear" },
  },
};

/** Jumping bounce */
const jumpVariant: Variants = {
  jump: {
    y: [0, -14, 0, -8, 0],
    scaleY: [1, 1.08, 0.94, 1.04, 1],
    transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
  },
};

// ─── Palette Constants ───────────────────────────────────────────────────────
const C = {
  body: "#FFFFFF",
  dark: "#3D3D3D",
  darkSoft: "#555555",
  blush: "#FFD9E8",
  gold: "#F4C77B",
  rose: "#8A4A5E",
  lavender: "#E7D9F7",
  heartRed: "#E8637A",
  stroke: "#3D3D3D",
} as const;

// ─── Sub-components (pose-specific overlays) ─────────────────────────────────

/** Waving right paw */
function WavingPaw() {
  return (
    <motion.g
      animate={{ rotate: [0, 20, -8, 15, 0] }}
      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      style={{ originX: "88px", originY: "72px" }}
    >
      {/* Arm */}
      <ellipse cx="98" cy="68" rx="13" ry="10" fill={C.body} stroke={C.stroke} strokeWidth="2" />
      {/* Paw pads */}
      <circle cx="92" cy="64" r="2.5" fill={C.blush} />
      <circle cx="98" cy="62" r="2.5" fill={C.blush} />
      <circle cx="104" cy="64" r="2.5" fill={C.blush} />
    </motion.g>
  );
}

/** Peeking paw from the bottom */
function PeekingPaws() {
  return (
    <g>
      {/* Left paw gripping bottom edge */}
      <ellipse cx="40" cy="98" rx="11" ry="8" fill={C.body} stroke={C.stroke} strokeWidth="1.5" />
      <circle cx="35" cy="95" r="2" fill={C.blush} />
      <circle cx="40" cy="93" r="2" fill={C.blush} />
      <circle cx="45" cy="95" r="2" fill={C.blush} />
      {/* Right paw */}
      <ellipse cx="80" cy="98" rx="11" ry="8" fill={C.body} stroke={C.stroke} strokeWidth="1.5" />
      <circle cx="75" cy="95" r="2" fill={C.blush} />
      <circle cx="80" cy="93" r="2" fill={C.blush} />
      <circle cx="85" cy="95" r="2" fill={C.blush} />
    </g>
  );
}

/** Sleeping eyes (closed arcs) + zzz */
function SleepingOverlay() {
  return (
    <g>
      {/* Closed left eye */}
      <path d="M36 50 Q43 44 50 50" stroke={C.dark} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Closed right eye */}
      <path d="M70 50 Q77 44 84 50" stroke={C.dark} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Zzz floating */}
      <motion.g
        animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <text x="92" y="28" fill={C.lavender} fontSize="12" fontFamily="sans-serif" fontWeight="700">z</text>
        <text x="100" y="18" fill={C.lavender} fontSize="9" fontFamily="sans-serif" fontWeight="700" opacity="0.7">z</text>
        <text x="106" y="10" fill={C.lavender} fontSize="7" fontFamily="sans-serif" fontWeight="700" opacity="0.4">z</text>
      </motion.g>
      {/* Sleepy blush — more prominent */}
      <circle cx="35" cy="58" r="7" fill={C.blush} opacity="0.5" />
      <circle cx="85" cy="58" r="7" fill={C.blush} opacity="0.5" />
    </g>
  );
}

/** Heart held in front of body */
function HoldingHeartOverlay() {
  return (
    <g>
      {/* Left paw */}
      <ellipse cx="48" cy="85" rx="10" ry="8" fill={C.body} stroke={C.stroke} strokeWidth="1.5" />
      {/* Right paw */}
      <ellipse cx="72" cy="85" rx="10" ry="8" fill={C.body} stroke={C.stroke} strokeWidth="1.5" />
      {/* Heart */}
      <motion.g
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "60px", originY: "85px" }}
      >
        <path
          d="M60 96 C60 96 47 84 47 77 C47 72 52 69 56 72 C58 74 60 76 60 76 C60 76 62 74 64 72 C68 69 73 72 73 77 C73 84 60 96 60 96Z"
          fill={C.heartRed}
          stroke={C.rose}
          strokeWidth="1"
        />
        {/* Heart shine */}
        <circle cx="54" cy="76" r="2" fill="white" opacity="0.4" />
      </motion.g>
    </g>
  );
}

/** Party hat on top */
function PartyHat() {
  return (
    <g>
      <polygon points="60,8 50,30 70,30" fill={C.gold} stroke={C.rose} strokeWidth="1" />
      <circle cx="60" cy="7" r="3.5" fill={C.blush} />
      {/* Tiny stripe on hat */}
      <line x1="55" y1="20" x2="65" y2="20" stroke={C.rose} strokeWidth="0.8" opacity="0.4" />
    </g>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function KawaiiPanda({
  size = 72,
  pose = "peeking",
  idle = true,
  className,
  ariaLabel,
}: KawaiiPandaProps) {
  const isSleeping = pose === "sleeping";
  const isSpinning = pose === "loading-spin";
  const isJumping = pose === "jumping";

  // Determine wrapper animation
  const wrapperVariant = isSpinning
    ? "spin"
    : isJumping
    ? "jump"
    : idle
    ? "idle"
    : undefined;

  const wrapperVariants = isSpinning
    ? spinVariant
    : isJumping
    ? jumpVariant
    : idle
    ? idleBreathing
    : undefined;

  const label =
    ariaLabel ?? `Kawaii panda ${pose === "loading-spin" ? "loading" : pose}`;

  return (
    <motion.div
      className={clsx("inline-flex select-none", className)}
      variants={wrapperVariants}
      animate={wrapperVariant}
      aria-label={label}
      role="img"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Ears ── */}
        <circle cx="32" cy="26" r="17" fill={C.dark} />
        <circle cx="88" cy="26" r="17" fill={C.dark} />
        {/* Inner ear highlights */}
        <circle cx="32" cy="26" r="9" fill={C.darkSoft} />
        <circle cx="88" cy="26" r="9" fill={C.darkSoft} />

        {/* ── Head ── */}
        <circle cx="60" cy="52" r="36" fill={C.body} stroke={C.stroke} strokeWidth="2" />

        {/* ── Party hat (always present — it's her birthday!) ── */}
        <PartyHat />

        {/* ── Eye patches ── */}
        {!isSleeping && (
          <>
            <ellipse cx="43" cy="48" rx="11" ry="9" fill={C.dark} transform="rotate(-6 43 48)" />
            <ellipse cx="77" cy="48" rx="11" ry="9" fill={C.dark} transform="rotate(6 77 48)" />
          </>
        )}

        {/* ── Eyes (normal open) ── */}
        {!isSleeping && (
          <>
            {/* Left eye */}
            <circle cx="44" cy="47" r="4.5" fill={C.body} />
            <circle cx="45" cy="46" r="2" fill={C.dark} />
            <circle cx="46.5" cy="44.5" r="0.8" fill={C.body} />
            {/* Right eye */}
            <circle cx="76" cy="47" r="4.5" fill={C.body} />
            <circle cx="77" cy="46" r="2" fill={C.dark} />
            <circle cx="78.5" cy="44.5" r="0.8" fill={C.body} />
          </>
        )}

        {/* ── Nose ── */}
        <ellipse cx="60" cy="57" rx="3.5" ry="2.5" fill={C.dark} />
        {/* Nose highlight */}
        <circle cx="58.5" cy="56" r="1" fill={C.darkSoft} />

        {/* ── Blush cheeks (default — sleeping overrides with bigger ones) ── */}
        {!isSleeping && (
          <>
            <circle cx="33" cy="59" r="6" fill={C.blush} opacity="0.6" />
            <circle cx="87" cy="59" r="6" fill={C.blush} opacity="0.6" />
          </>
        )}

        {/* ── Mouth ── */}
        {!isSleeping && (
          <path
            d="M55 63 Q60 69 65 63"
            stroke={C.dark}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* ── Body (small rounded body below head) ── */}
        {pose !== "peeking" && (
          <>
            <ellipse cx="60" cy="92" rx="28" ry="18" fill={C.body} stroke={C.stroke} strokeWidth="1.5" />
            {/* Belly circle */}
            <circle cx="60" cy="90" r="10" fill="#F8F8F8" stroke={C.stroke} strokeWidth="0.5" opacity="0.5" />
          </>
        )}

        {/* ── Pose-specific overlays ── */}
        {pose === "sleeping" && <SleepingOverlay />}
        {pose === "waving" && <WavingPaw />}
        {pose === "peeking" && <PeekingPaws />}
        {pose === "holding-heart" && <HoldingHeartOverlay />}

        {/* ── Loading ring (for spin pose) ── */}
        {isSpinning && (
          <circle
            cx="60"
            cy="52"
            r="42"
            fill="none"
            stroke={C.blush}
            strokeWidth="3"
            strokeDasharray="40 200"
            strokeLinecap="round"
            opacity="0.6"
          />
        )}
      </svg>
    </motion.div>
  );
}
