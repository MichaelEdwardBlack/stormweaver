"use client";

import { cn } from "@/lib/utils/styles";
import { motion } from "framer-motion";

export const AnimatedCardGrid = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn("grid gap-6 w-full max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      {children}
    </motion.div>
  );
};
