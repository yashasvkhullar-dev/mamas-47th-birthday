"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface SoftButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

const variantStyles = {
  primary:
    "bg-blush text-rose hover:bg-lavender active:scale-95 shadow-md hover:shadow-lg",
  secondary:
    "bg-lavender text-rose hover:bg-blush active:scale-95 shadow-sm hover:shadow-md",
  ghost:
    "bg-transparent text-rose hover:bg-blush/30 active:scale-95",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-base rounded-2xl",
  lg: "px-8 py-4 text-lg rounded-3xl",
};

export default function SoftButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
}: SoftButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "font-quicksand font-medium transition-colors duration-200 cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </motion.button>
  );
}
