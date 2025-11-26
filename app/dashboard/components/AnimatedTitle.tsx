"use client";
import { motion } from "framer-motion";

export const AnimatedTitle = () => {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-4xl font-semibold mb-10 
          bg-clip-text text-transparent 
          bg-linear-to-br from-blue-600 to-cyan-400
          dark:from-blue-300 dark:to-cyan-200"
    >
      Dashboard
    </motion.h1>
  );
};
