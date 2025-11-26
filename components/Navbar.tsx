"use client";

import Link from "next/link";
import { useState } from "react";
import { FaX } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import { LoginLogoutButton } from "./LoginLogoutButton";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="top-0 z-50 sticky bg-white/70 dark:bg-neutral-900/40 shadow-lg backdrop-blur-lg border-white/20 dark:border-neutral-700/40 border-b w-full">
      {/* Main navbar */}
      <div className="flex justify-between items-center mx-auto px-6 py-3 max-w-7xl">
        {/* Logo */}
        <Link href="/" className="font-semibold text-neutral-900 dark:text-white text-lg tracking-tight">
          StormWeaver
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/dashboard"
            className="text-neutral-700 hover:text-primary-500 dark:hover:text-primary-300 dark:text-neutral-200 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/characters"
            className="text-neutral-700 hover:text-primary-500 dark:hover:text-primary-300 dark:text-neutral-200 transition"
          >
            Characters
          </Link>
          <Link
            href="/settings"
            className="text-neutral-700 hover:text-primary-500 dark:hover:text-primary-300 dark:text-neutral-200 transition"
          >
            Settings
          </Link>
          <LoginLogoutButton />
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-neutral-900 dark:text-neutral-200" onClick={() => setOpen(!open)}>
          {open ? <FaX /> : <GiHamburgerMenu />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden top-full left-0 z-40 absolute flex flex-col space-y-3 bg-white/70 dark:bg-neutral-900/40 shadow-lg backdrop-blur-lg px-6 py-4 border-white/20 dark:border-neutral-700/40 border-t w-full"
          >
            <Link href="/dashboard" className="text-neutral-900 dark:text-neutral-200" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
            <Link href="/characters" className="text-neutral-900 dark:text-neutral-200" onClick={() => setOpen(false)}>
              Characters
            </Link>
            <Link href="/settings" className="text-neutral-900 dark:text-neutral-200" onClick={() => setOpen(false)}>
              Settings
            </Link>
            <LoginLogoutButton onClick={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
