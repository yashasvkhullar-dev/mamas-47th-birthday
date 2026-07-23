"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SoftButton from "@/components/ui/SoftButton";

interface LightsOnProps {
  onComplete: () => void;
}

export default function LightsOn({ onComplete }: LightsOnProps) {
  const [lightsOn, setLightsOn] = useState(false);

  const handleToggle = () => {
    setLightsOn(true);
    // Let the light animation play before advancing
    setTimeout(onComplete, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative flex flex-col items-center gap-8 text-center px-4 min-h-[50vh] justify-center w-full"
    >
      {/* Dark overlay that fades out when lights turn on */}
      <AnimatePresence>
        {!lightsOn && (
          <motion.div
            key="dark-overlay"
            className="fixed inset-0 z-30 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(40,20,40,0.75) 0%, rgba(20,10,25,0.9) 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        className="relative z-40 flex flex-col items-center gap-6"
        animate={{
          filter: lightsOn ? "brightness(1)" : "brightness(0.85)",
        }}
        transition={{ duration: 1.2 }}
      >
        {/* Lightbulb icon */}
        <motion.span
          className="text-5xl sm:text-6xl"
          animate={
            lightsOn
              ? {
                  scale: [1, 1.3, 1],
                  filter: [
                    "drop-shadow(0 0 0px rgba(244,199,123,0))",
                    "drop-shadow(0 0 40px rgba(244,199,123,0.9))",
                    "drop-shadow(0 0 15px rgba(244,199,123,0.5))",
                  ],
                }
              : { scale: 1 }
          }
          transition={{ duration: 1 }}
        >
          💡
        </motion.span>

        <h2 className="font-caveat text-3xl sm:text-4xl font-bold text-rose">
          The stage is set 💡
        </h2>

        <p className="font-quicksand text-rose/60 text-base sm:text-lg max-w-sm">
          Every celebration needs the perfect ambience...
        </p>

        {!lightsOn ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SoftButton onClick={handleToggle} variant="primary" size="lg">
              ✨ Turn on the lights
            </SoftButton>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-2"
          >
            {/* Sparkle burst */}
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {["✨", "🌟", "💫", "🌟", "✨"].map((s, i) => (
                <motion.span
                  key={i}
                  className="text-2xl"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.12, type: "spring" }}
                >
                  {s}
                </motion.span>
              ))}
            </motion.div>
            <p className="font-caveat text-xl text-gold">
              Beautiful! ✨
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
