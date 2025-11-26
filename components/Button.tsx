import React from "react";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";

type Props = MotionProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    variant?: "primary" | "accent" | "destructive" | "other";
    className?: string;
  };

export const Button: React.FC<Props> = ({ children, className = "", variant = "primary", disabled, ...rest }) => {
  const variantClass =
    variant === "primary"
      ? `
    bg-gradient-to-r from-primary-500 to-primary-400 
    text-white
    hover:from-primary-400 hover:to-primary-300
    shadow-primary-500/50
    px-4 py-2 rounded-lg font-medium
  `
      : variant === "accent"
      ? `
    bg-gradient-to-r from-accent-600 to-accent-500
    text-black
    hover:from-accent-500 hover:to-accent-400
    shadow-accent-500/50
    px-4 py-2 rounded-lg font-semibold
  `
      : variant === "destructive"
      ? ` 
    bg-gradient-to-r from-red-600 to-red-500
    text-black
    hover:from-red-500 hover:to-red-400
    shadow-red-500/50
    px-4 py-2 rounded-lg font-semibold
  `
      : className;
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`${variantClass} w-full focus:outline-none ${disabled ? "" : "cursor-pointer"}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </motion.button>
  );
};
