"use client";
import { cn } from "@/lib/utils/styles";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string; // allow extra classes
  onClick?: () => void;
}

export const HoverCard = ({ children, className, onClick }: CardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "bg-white/50 dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),rgba(0,0,0,0))] dark:bg-neutral-900/60 shadow-xl dark:shadow-[0_8px_24px_rgba(0,0,0,0.45),0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-xl p-6 border border-white/50 dark:border-neutral-700/40 rounded-xl",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
