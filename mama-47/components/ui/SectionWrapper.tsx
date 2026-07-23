"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function SectionWrapper({
  children,
  className,
  id,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={clsx(
        "min-h-screen w-full flex flex-col items-center justify-center px-6 py-12",
        className
      )}
    >
      {children}
    </motion.section>
  );
}
