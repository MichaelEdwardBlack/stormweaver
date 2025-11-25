"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { FaX } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-transparent border-amber-300 border-b-2">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-amber-400 text-2xl tracking-wide">
            StormWeaver
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/characters" className="hover:text-amber-300">
              Characters
            </Link>
            <Link href="/builder" className="hover:text-amber-300">
              Builder
            </Link>
            <Link href="/rules" className="hover:text-amber-300">
              Rules
            </Link>

            {/* Auth Buttons */}
            {session ? (
              <button onClick={() => signOut()} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md">
                Logout
              </button>
            ) : (
              <button onClick={() => signIn()} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md">
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
            {open ? <FaX size={28} /> : <GiHamburgerMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-slate-700 border-slate-600 border-t">
          <div className="space-y-3 px-4 py-3">
            <Link href="/characters" className="block hover:text-amber-300" onClick={() => setOpen(false)}>
              Characters
            </Link>
            <Link href="/builder" className="block hover:text-amber-300" onClick={() => setOpen(false)}>
              Builder
            </Link>
            <Link href="/rules" className="block hover:text-amber-300" onClick={() => setOpen(false)}>
              Rules
            </Link>

            {/* Auth Buttons */}
            {session ? (
              <button
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className="block bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md w-full text-left"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  signIn();
                }}
                className="block bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md w-full text-left"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
