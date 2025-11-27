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
    <nav className="sticky top-0 z-50 w-full border-b shadow-lg bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-white/20 dark:border-neutral-700/40">
      {/* Main navbar */}
      <div className="flex items-center justify-between px-6 py-3 mx-auto max-w-7xl">
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
          StormWeaver
        </Link>

        {/* Desktop links */}
        <div className="items-center hidden gap-6 text-sm md:flex">
          <Link
            href="/dashboard"
            className="transition text-neutral-700 hover:text-primary-500 dark:hover:text-primary-300 dark:text-neutral-200"
          >
            Dashboard
          </Link>
          <Link
            href="/characters"
            className="transition text-neutral-700 hover:text-primary-500 dark:hover:text-primary-300 dark:text-neutral-200"
          >
            Characters
          </Link>
          <Link
            href="/settings"
            className="transition text-neutral-700 hover:text-primary-500 dark:hover:text-primary-300 dark:text-neutral-200"
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
            className="absolute left-0 z-40 flex flex-col w-full px-6 py-4 space-y-3 border-t shadow-lg md:hidden top-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-white/20 dark:border-neutral-700/40"
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
