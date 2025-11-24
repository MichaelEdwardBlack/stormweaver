"use client";

import Link from "next/link";
import { FeatureCard } from "./components/FeatureCard";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();
  return (
    <main>
      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-6 border-white/10 border-b">
        <h1 className="font-bold text-2xl tracking-wide">StormWeaver</h1>
        {session ? (
          <Link
            href="/api/auth/signout"
            className="bg-red-500 hover:bg-red-400 shadow-lg px-4 py-2 rounded-lg transition"
          >
            Logout
          </Link>
        ) : (
          <Link
            href="/api/auth/signin"
            className="bg-emerald-500 hover:bg-emerald-400 shadow-lg px-4 py-2 rounded-lg transition"
          >
            Login
          </Link>
        )}
      </header>

      {/* HERO */}
      <section className="flex flex-col items-center mt-20 px-4 text-center">
        <h2 className="drop-shadow-lg mb-4 font-extrabold text-4xl tracking-tight">Build Your Legend in the Cosmere</h2>
        <p className="max-w-2xl text-slate-300 text-lg">
          Create, customize, and manage your characters for the fan-made
          <span className="font-semibold text-white"> Cosmere RPG</span>. Track attributes, skills, talents, equipment,
          investiture, and more — all in one beautiful interface.
        </p>

        <Link
          href="/characters"
          className="bg-indigo-600 hover:bg-indigo-500 shadow-xl mt-8 px-6 py-3 rounded-xl font-semibold text-lg transition"
        >
          Enter the Forge
        </Link>
      </section>

      {/* FEATURES */}
      <section className="gap-8 grid grid-cols-1 md:grid-cols-3 mt-24 px-8 pb-24">
        <FeatureCard
          title="Character Builder"
          description="Fully customize stats, abilities, talents, and equipment with rules-accurate validation."
        />
        <FeatureCard
          title="Dice Roller"
          description="Integrated 3D physics dice roller with modifiers, toasts for results, and history tracking."
        />
        <FeatureCard
          title="Talent & Progression System"
          description="Automatically unlock and apply modifiers, skill boosts, and tier-based passives."
        />
      </section>

      {/* DISCLAIMER */}
      <footer className="px-4 pb-10 text-slate-400 text-sm text-center">
        <p className="opacity-80">
          This project is a <b>fan-made</b> tool for the Cosmere RPG. It is{" "}
          <b>
            not affiliated with Brandon Sanderson, Dragonsteel Entertainment, or the official Cosmere tabletop teams
          </b>
          .
        </p>
      </footer>
    </main>
  );
}
