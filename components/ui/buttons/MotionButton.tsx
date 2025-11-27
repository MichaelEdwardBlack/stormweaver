"use client";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";

type Props = MotionProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    className?: string;
  };

export const MotionButton: React.FC<Props> = ({ children, className, disabled, ...rest }) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`focus:outline-none ${disabled ? "" : "cursor-pointer"} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </motion.button>
  );
};
