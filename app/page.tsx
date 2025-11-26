"use client";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function HomePage() {
  return (
    <main className="flex flex-col flex-1 bg-linear-to-b from-primary-300/50 dark:from-primary-900/60 to-white dark:to-black pt-12 md:pt-4 lg:pt-0 h-full text-black dark:text-white">
      {/* Hero Section */}
      <section className="flex flex-col flex-1 justify-center items-center px-6 text-center">
        <h1 className="mb-4 font-bold text-5xl fancy-title">
          Storm<span className="text-primary-500">Weaver</span>
        </h1>
        <p className="opacity-90 max-w-2xl text-lg md:text-xl">
          Forge characters, shape destinies, and channel the powers of the Cosmere. StormWeaver helps you create,
          manage, and track your heroes across the worlds of Brandon Sanderson.
        </p>

        <div className="flex gap-4 mt-8">
          <Link href="/dashboard">
            <Button>Enter App</Button>
          </Link>
          <Link href="/auth/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </section>

      {/* Feature Preview */}
      <section className="bg-white/40 dark:bg-black/30 backdrop-blur-md px-6 py-16 border-black/10 dark:border-white/10 border-t">
        <h2 className="mb-10 font-bold text-3xl text-center fancy-title">What StormWeaver Can Do</h2>
        <div className="gap-8 grid grid-cols-1 md:grid-cols-3 mx-auto max-w-6xl">
          <Card>
            <h3 className="mb-2 font-semibold text-xl">Cosmere Character Builder</h3>
            <p className="opacity-80">Create characters using Investiture systems, attributes, talents, and more.</p>
          </Card>
          <Card>
            <h3 className="mb-2 font-semibold text-xl">Talent & Skill Management</h3>
            <p className="opacity-80">Track talent tiers, passive bonuses, and advancement based on level.</p>
          </Card>
          <Card>
            <h3 className="mb-2 font-semibold text-xl">Character Dashboard</h3>
            <p className="opacity-80">Access all your characters with fast navigation and organized summaries.</p>
          </Card>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="opacity-70 py-8 text-sm text-center">
        StormWeaver is a fan-made tool inspired by the works of Brandon Sanderson. This app is not affiliated with
        Dragonsteel or the official Cosmere RPG.
      </footer>
    </main>
  );
}
