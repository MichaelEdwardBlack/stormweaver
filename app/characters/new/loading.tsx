"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center px-10 py-8 border shadow-lg rounded-2xl bg-neutral-100/40 dark:bg-neutral-900/40 backdrop-blur-lg border-neutral-200/20 dark:border-neutral-700/30"
      >
        {/* Animated Orb */}
        <motion.div
          className="
            w-12 h-12 rounded-full
            bg-linear-to-br from-primary-400 to-primary-600
            dark:from-primary-700 dark:to-primary-500
            shadow-[0_0_30px_-6px_var(--color-primary-500)]
          "
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />

        <p className="mt-5 font-medium text-neutral-700 dark:text-neutral-300">Creating your character…</p>

        <p className="mt-1 text-sm text-neutral-500">Preparing defaults and loading the editor</p>
      </motion.div>
    </div>
  );
}
