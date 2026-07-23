"use client";

import { motion } from "framer-motion";
import KawaiiPanda from "./KawaiiPanda";

/**
 * The persistent corner panda that lives in the bottom-right
 * of every page. Subtle, low z-index, non-interactive.
 */
export default function CornerPanda() {
  return (
    <motion.div
      className="fixed bottom-3 right-3 z-10 pointer-events-none select-none"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.7, type: "spring", bounce: 0.45 }}
    >
      <KawaiiPanda size={64} pose="peeking" idle />
    </motion.div>
  );
}
