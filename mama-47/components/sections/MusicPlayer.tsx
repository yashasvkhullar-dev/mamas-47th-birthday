"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SoftButton from "@/components/ui/SoftButton";

interface MusicPlayerProps {
  onComplete: () => void;
}

/** Simple animated equalizer bars */
function EqualizerBars({ playing }: { playing: boolean }) {
  const barCount = 5;
  return (
    <div className="flex items-end gap-[3px] h-8">
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[4px] rounded-full bg-rose/60"
          animate={
            playing
              ? {
                  height: [8, 20 + Math.random() * 12, 10, 28 - i * 3, 14],
                }
              : { height: 6 }
          }
          transition={
            playing
              ? {
                  duration: 0.8 + i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.08,
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

/** Floating music notes */
function FloatingNotes({ playing }: { playing: boolean }) {
  if (!playing) return null;

  const notes = ["🎵", "🎶", "🎵", "♪", "🎶"];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {notes.map((note, i) => (
        <motion.span
          key={i}
          className="absolute text-lg sm:text-xl"
          initial={{
            x: `${20 + i * 15}%`,
            y: "100%",
            opacity: 0,
          }}
          animate={{
            y: "-20%",
            opacity: [0, 0.7, 0.7, 0],
            x: `${20 + i * 15 + (i % 2 === 0 ? 8 : -8)}%`,
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut",
          }}
        >
          {note}
        </motion.span>
      ))}
    </div>
  );
}

export default function MusicPlayer({ onComplete }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const howlRef = useRef<import("howler").Howl | null>(null);

  // Dynamically import Howler only on client
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      howlRef.current?.unload();
    };
  }, []);

  const handlePlay = async () => {
    if (hasStarted) return;

    try {
      const { Howl } = await import("howler");

      const sound = new Howl({
        src: ["/audio/birthday-song.mp3"],
        loop: true,
        volume: 0.35,
        html5: true,
        onplay: () => {
          setIsPlaying(true);
          setHasStarted(true);
          // Auto-advance after a brief listen
          setTimeout(onComplete, 3000);
        },
        onloaderror: () => {
          // If the file isn't there yet, still advance
          console.warn("Audio file not found — advancing anyway");
          setHasStarted(true);
          setIsPlaying(true);
          setTimeout(onComplete, 2000);
        },
      });

      howlRef.current = sound;
      sound.play();
    } catch {
      // Fallback: advance even if Howler fails
      setHasStarted(true);
      setIsPlaying(true);
      setTimeout(onComplete, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative flex flex-col items-center gap-8 text-center px-4 min-h-[50vh] justify-center"
    >
      <FloatingNotes playing={isPlaying} />

      <motion.span
        className="text-5xl sm:text-6xl"
        animate={
          isPlaying
            ? { rotate: [0, -8, 8, -5, 0], scale: [1, 1.1, 1] }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        🎵
      </motion.span>

      <h2 className="font-caveat text-3xl sm:text-4xl font-bold text-rose">
        Music makes it better 🎵
      </h2>

      <p className="font-quicksand text-rose/60 text-base sm:text-lg max-w-sm">
        Every party needs a soundtrack
      </p>

      {!hasStarted ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SoftButton onClick={handlePlay} variant="primary" size="lg">
            <span className="flex items-center gap-3">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ▶️
              </motion.span>
              Play the music
            </span>
          </SoftButton>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <EqualizerBars playing={isPlaying} />
          <p className="font-caveat text-xl text-gold">
            Now we&apos;re vibing! 🎶
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
