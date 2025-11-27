"use client";
import Link from "next/link";
import { Button } from "@/components/ui/buttons/Button";
import { Card } from "@/components/ui/cards/Card";

export default function HomePage() {
  return (
    <main className="flex flex-col flex-1 h-full pt-12 text-black bg-linear-to-b from-primary-100 dark:from-primary-950 to-white dark:to-black md:pt-4 lg:pt-0 dark:text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 px-6 text-center">
        <h1 className="mb-4 text-5xl font-bold fancy-title">
          Storm<span className="text-primary-500">Weaver</span>
        </h1>
        <p className="max-w-2xl text-lg opacity-90 md:text-xl">
          Forge characters, shape destinies, and channel the powers of the Cosmere. StormWeaver helps you create,
          manage, and track your heroes across the worlds of Brandon Sanderson.
        </p>

        <div className="flex gap-4 my-8 md:mb-0">
          <Link href="/dashboard">
            <Button>Start Building</Button>
          </Link>
        </div>
      </section>
      {/* Feature Preview */}
      <section className="px-6 py-16 border-t bg-white/40 dark:bg-black/30 backdrop-blur-md border-black/10 dark:border-white/10">
        <h2 className="mb-10 text-3xl font-bold text-center fancy-title">What StormWeaver Can Do</h2>
        <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-3">
          <Card>
            <h3 className="mb-2 text-xl font-semibold">Cosmere Character Builder</h3>
            <p className="opacity-80">Create characters using Investiture systems, attributes, talents, and more.</p>
          </Card>
          <Card>
            <h3 className="mb-2 text-xl font-semibold">Talent & Skill Management</h3>
            <p className="opacity-80">Track talent tiers, passive bonuses, and advancement based on level.</p>
          </Card>
          <Card>
            <h3 className="mb-2 text-xl font-semibold">Character Dashboard</h3>
            <p className="opacity-80">Access all your characters with fast navigation and organized summaries.</p>
          </Card>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="py-8 text-sm text-center opacity-70">
        StormWeaver is a fan-made tool inspired by the works of Brandon Sanderson. This app is not affiliated with
        Dragonsteel or the official Cosmere RPG.
      </footer>
    </main>
  );
}
