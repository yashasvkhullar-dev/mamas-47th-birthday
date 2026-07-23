"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Letter text ─────────────────────────────────────────────────────────────

const LETTER_PARAGRAPHS = [
  "My dearest Mama,",
  "Forty-seven years of you in this world — and every single one of them has made mine immeasurably better.",
  "I don't think there are words big enough for what you are to me, but I'm going to try anyway, because today is your day and you deserve to hear it all.",
  "You were my first home before I even had a name for what home meant. Every skinned knee, every 3 AM fever, every proud moment and every quiet failure — you were there, holding it all so gently that I never once felt the weight of it. You taught me how to be kind without being told to. You taught me how to try again without being afraid. Everything good in me, I can trace back to you.",
  "I know I don't say it enough. I know I get busy, distracted, wrapped up in my own little world — but not one day goes by where I don't carry you with me. In the way I laugh, in the way I care for people, in the way I still, without thinking, reach for the phone just to tell you something small because I know you'll actually want to hear it.",
  "You are the softest place I know and the strongest person I've ever met, somehow, all at once. You have carried so much for so many people for so long, and today I just want you to put it all down for a while and let yourself be celebrated the way you deserve — endlessly, and without condition.",
  "So here's a little bit of my heart, built into pixels and buttons and silly animations, because I wanted to give you something that took time, the way you've given me time my whole life without ever asking for anything back.",
  "Happy birthday, Mama. Thank you for choosing me, every single day, for 47 years and counting.",
  "I love you more than this website — or any website — could ever hold.",
  "Always your son,\n🐼",
];

// ─── Envelope SVG ────────────────────────────────────────────────────────────

function EnvelopeSVG({ flapOpen }: { flapOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 280 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ overflow: "visible" }}
    >
      {/* Envelope body */}
      <rect
        x="10"
        y="50"
        width="260"
        height="145"
        rx="12"
        fill="#FFD9E8"
        stroke="#E7C4D4"
        strokeWidth="1.5"
      />

      {/* Inner shadow / paper peek */}
      <rect x="30" y="60" width="220" height="10" rx="2" fill="#FFF8F3" opacity="0.5" />

      {/* Bottom fold lines */}
      <line x1="10" y1="195" x2="140" y2="120" stroke="#E7C4D4" strokeWidth="1" opacity="0.5" />
      <line x1="270" y1="195" x2="140" y2="120" stroke="#E7C4D4" strokeWidth="1" opacity="0.5" />

      {/* Flap (triangle) — rotate from top edge when opening */}
      <g
        style={{
          transformOrigin: "140px 50px",
          transition: "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: flapOpen ? "rotateX(180deg)" : "rotateX(0deg)",
        }}
      >
        <polygon
          points="10,50 140,2 270,50"
          fill={flapOpen ? "#F5C4D8" : "#FFD9E8"}
          stroke="#E7C4D4"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Tiny panda sticker on the flap */}
        <g transform="translate(125, 18)" opacity={flapOpen ? 0 : 1}>
          {/* Panda face */}
          <circle cx="15" cy="14" r="10" fill="white" />
          {/* Ears */}
          <circle cx="7" cy="6" r="5" fill="#3D3D3D" />
          <circle cx="23" cy="6" r="5" fill="#3D3D3D" />
          {/* Eye patches */}
          <ellipse cx="10" cy="13" rx="4" ry="3.5" fill="#3D3D3D" />
          <ellipse cx="20" cy="13" rx="4" ry="3.5" fill="#3D3D3D" />
          {/* Eyes */}
          <circle cx="10" cy="12.5" r="1.5" fill="white" />
          <circle cx="20" cy="12.5" r="1.5" fill="white" />
          {/* Nose */}
          <ellipse cx="15" cy="17" rx="2" ry="1.5" fill="#3D3D3D" />
          {/* Blush cheeks */}
          <circle cx="7" cy="17" r="2.5" fill="#FFB3C6" opacity="0.6" />
          <circle cx="23" cy="17" r="2.5" fill="#FFB3C6" opacity="0.6" />
        </g>
      </g>

      {/* Heart wax seal — centered on the flap join */}
      <g transform="translate(140, 50)" style={{ opacity: flapOpen ? 0 : 1, transition: "opacity 0.3s" }}>
        <circle cx="0" cy="0" r="16" fill="#8A4A5E" />
        <circle cx="0" cy="0" r="14" fill="#A05A70" />
        {/* Wax drips */}
        <ellipse cx="-8" cy="12" rx="3" ry="4" fill="#8A4A5E" opacity="0.7" />
        <ellipse cx="9" cy="10" rx="2.5" ry="3" fill="#8A4A5E" opacity="0.6" />
        {/* Heart symbol inside */}
        <path
          d="M0 -2 C-3 -7, -10 -5, -8 0 C-6 4, 0 8, 0 8 C0 8, 6 4, 8 0 C10 -5, 3 -7, 0 -2Z"
          fill="#FFD9E8"
        />
      </g>
    </svg>
  );
}

// ─── Wax Seal "Continue" Button ──────────────────────────────────────────────

function WaxSealButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex flex-col items-center gap-2 cursor-pointer group mt-8"
    >
      {/* Seal circle */}
      <div className="relative">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          {/* Wavy seal edge */}
          <path
            d="M36 2 C40 8, 46 4, 48 2 C52 6, 56 10, 62 8 C62 14, 68 16, 70 18 C66 22, 68 28, 70 32 C66 34, 64 38, 66 42 C62 44, 60 48, 62 52 C58 52, 54 56, 52 60 C48 58, 44 60, 40 62 C38 58, 34 58, 32 62 C28 60, 24 58, 20 60 C18 56, 14 52, 10 52 C12 48, 10 44, 6 42 C8 38, 6 34, 2 32 C4 28, 6 22, 2 18 C4 16, 10 14, 10 8 C16 10, 20 6, 20 2 C24 4, 28 8, 32 4 C34 6, 36 2, 36 2Z"
            fill="#8A4A5E"
          />
          <path
            d="M36 6 C39 11, 44 8, 46 6 C49 9, 53 13, 58 11 C58 16, 63 18, 65 20 C62 23, 63 28, 65 31 C62 33, 60 36, 62 40 C59 41, 57 45, 58 48 C55 48, 52 52, 50 55 C47 53, 43 55, 40 57 C38 54, 35 54, 33 57 C30 55, 26 53, 23 55 C21 52, 18 48, 14 48 C16 45, 14 41, 10 40 C12 36, 10 33, 7 31 C9 28, 10 23, 7 20 C9 18, 14 16, 14 11 C19 13, 22 9, 22 6 C25 8, 29 11, 32 7 C34 9, 36 6, 36 6Z"
            fill="#A05A70"
          />
          {/* Heart in center */}
          <path
            d="M36 28 C32 20, 20 22, 22 30 C24 36, 36 46, 36 46 C36 46, 48 36, 50 30 C52 22, 40 20, 36 28Z"
            fill="#FFD9E8"
          />
        </svg>
        {/* Pulse ring on hover */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-rose/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <span className="font-caveat text-rose/70 text-lg group-hover:text-rose transition-colors">
        Continue 💌
      </span>
    </motion.button>
  );
}

// ─── Typewriter paragraph reveal ─────────────────────────────────────────────

function TypewriterParagraph({
  text,
  delay,
  onComplete,
}: {
  text: string;
  delay: number;
  onComplete?: () => void;
}) {
  const [visibleChars, setVisibleChars] = useState(0);
  const isFirstParagraph = text.startsWith("My dearest");
  const isLastParagraph = text.startsWith("Always your");

  useEffect(() => {
    const startTimer = setTimeout(() => {
      // Speed: ~30ms per char, faster for longer paragraphs
      const charDelay = text.length > 150 ? 15 : text.length > 80 ? 22 : 30;
      let charIndex = 0;

      const interval = setInterval(() => {
        charIndex++;
        setVisibleChars(charIndex);
        if (charIndex >= text.length) {
          clearInterval(interval);
          onComplete?.();
        }
      }, charDelay);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [text, delay, onComplete]);

  // Split text to handle the emoji on its own line
  const lines = text.split("\n");

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000, duration: 0.3 }}
      className={`font-caveat text-rose leading-relaxed whitespace-pre-line ${
        isFirstParagraph
          ? "text-2xl sm:text-3xl font-bold"
          : isLastParagraph
          ? "text-xl sm:text-2xl text-right mt-6"
          : "text-lg sm:text-xl"
      }`}
    >
      {lines.map((line, li) => (
        <span key={li}>
          {li > 0 && <br />}
          {line.split("").map((char, ci) => {
            const globalIndex =
              lines.slice(0, li).reduce((acc, l) => acc + l.length + 1, 0) + ci;
            return (
              <span
                key={`${li}-${ci}`}
                style={{
                  opacity: globalIndex < visibleChars ? 1 : 0,
                  transition: "opacity 0.05s",
                }}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
      {/* Cursor blink at the end of the currently-typing paragraph */}
      {visibleChars > 0 && visibleChars < text.length && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-rose/40 ml-[1px] align-text-bottom"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </motion.p>
  );
}

// ─── Main LoveLetter Component ───────────────────────────────────────────────

interface LoveLetterProps {
  onComplete: () => void;
}

export default function LoveLetter({ onComplete }: LoveLetterProps) {
  const [phase, setPhase] = useState<
    "envelope" | "opening" | "sliding" | "reading" | "done"
  >("envelope");

  const [completedParagraphs, setCompletedParagraphs] = useState(0);
  const allDone = completedParagraphs >= LETTER_PARAGRAPHS.length;

  const handleEnvelopeClick = () => {
    if (phase !== "envelope") return;
    setPhase("opening");
    // Flap opens → letter slides out → reading
    setTimeout(() => setPhase("sliding"), 700);
    setTimeout(() => setPhase("reading"), 1600);
  };

  const handleParagraphComplete = useCallback(() => {
    setCompletedParagraphs((c) => c + 1);
  }, []);

  // Calculate delay for each paragraph based on estimated type times of prior paragraphs
  const getCumulativeDelay = (index: number): number => {
    let total = 400; // initial reading-start delay
    for (let i = 0; i < index; i++) {
      const text = LETTER_PARAGRAPHS[i];
      const charDelay = text.length > 150 ? 15 : text.length > 80 ? 22 : 30;
      total += text.length * charDelay + 300; // +300ms gap between paragraphs
    }
    return total;
  };

  const handleFoldBack = () => {
    setPhase("envelope");
    setCompletedParagraphs(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative flex flex-col items-center gap-6 text-center px-4 min-h-[60vh] justify-center w-full"
    >
      {/* Phase: Envelope */}
      <AnimatePresence mode="wait">
        {(phase === "envelope" || phase === "opening") && (
          <motion.div
            key="envelope-phase"
            exit={{ opacity: 0, scale: 0.8, y: -40 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Envelope with bob animation */}
            <motion.div
              className="w-56 h-40 sm:w-72 sm:h-52 cursor-pointer relative"
              animate={
                phase === "envelope"
                  ? { y: [0, -8, 0] }
                  : {}
              }
              transition={
                phase === "envelope"
                  ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  : {}
              }
              onClick={handleEnvelopeClick}
              whileHover={phase === "envelope" ? { scale: 1.05 } : {}}
              style={{ perspective: "600px" }}
            >
              <EnvelopeSVG flapOpen={phase === "opening"} />

              {/* Glow on hover */}
              {phase === "envelope" && (
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(255,217,232,0)",
                      "0 0 25px rgba(255,217,232,0.4)",
                      "0 0 0px rgba(255,217,232,0)",
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </motion.div>

            {/* Caption */}
            <motion.p
              className="font-caveat text-xl sm:text-2xl text-rose/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              For you, Mama 💌
            </motion.p>

            {phase === "envelope" && (
              <motion.p
                className="font-quicksand text-sm text-rose/40"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                tap to open
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase: Letter sliding out */}
      <AnimatePresence>
        {phase === "sliding" && (
          <motion.div
            key="sliding-letter"
            initial={{ y: 50, scale: 0.6, opacity: 0 }}
            animate={{ y: 0, scale: 0.85, opacity: 1 }}
            exit={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-72 h-40 bg-cream rounded-xl shadow-lg border border-blush/30 flex items-center justify-center"
          >
            <motion.span
              className="font-caveat text-rose/50 text-lg"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              unfolding...
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase: Reading (the letter card) */}
      <AnimatePresence>
        {(phase === "reading" || phase === "done") && (
          <motion.div
            key="letter-card"
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 22,
              duration: 0.8,
            }}
            className="relative w-full max-w-2xl mx-auto"
          >
            {/* Paper card */}
            <div
              className="relative rounded-3xl shadow-2xl overflow-hidden border border-blush/20"
              style={{
                background: `
                  linear-gradient(
                    180deg,
                    #FFF8F3 0%,
                    #FFFAF6 30%,
                    #FFF5EE 70%,
                    #FFF8F3 100%
                  )
                `,
              }}
            >
              {/* Subtle paper grain texture overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Fold line (subtle horizontal line across the middle) */}
              <div
                className="absolute left-8 right-8 pointer-events-none"
                style={{
                  top: "50%",
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, rgba(138,74,94,0.06) 30%, rgba(138,74,94,0.06) 70%, transparent)",
                }}
              />

              {/* Letter content */}
              <div className="relative z-10 px-8 sm:px-12 py-10 sm:py-14 flex flex-col gap-5">
                {/* Close / fold back button */}
                <motion.button
                  onClick={handleFoldBack}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blush/30 flex items-center justify-center text-rose/40 hover:text-rose/70 hover:bg-blush/50 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Fold letter back"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </motion.button>

                {/* Decorative top flourish */}
                <motion.div
                  className="flex justify-center gap-1 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {["✦", "·", "·", "💌", "·", "·", "✦"].map((c, i) => (
                    <span
                      key={i}
                      className="text-rose/25 text-sm"
                    >
                      {c}
                    </span>
                  ))}
                </motion.div>

                {/* Paragraphs with typewriter reveal */}
                {LETTER_PARAGRAPHS.map((text, i) => (
                  <TypewriterParagraph
                    key={i}
                    text={text}
                    delay={getCumulativeDelay(i)}
                    onComplete={
                      i === LETTER_PARAGRAPHS.length - 1
                        ? () => {
                            handleParagraphComplete();
                            setPhase("done");
                          }
                        : handleParagraphComplete
                    }
                  />
                ))}

                {/* Wax seal Continue button — appears after all text is typed */}
                <AnimatePresence>
                  {allDone && phase === "done" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex justify-center"
                    >
                      <WaxSealButton onClick={onComplete} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
