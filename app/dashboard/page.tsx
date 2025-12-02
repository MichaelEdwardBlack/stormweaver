import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { AnimatedCardGrid } from "./components/AnimatedCardGrid";
import { HoverCard } from "@/components/ui/cards/HoverCard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }

  const characters = await prisma.character.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-5xl px-5 py-10 mx-auto">
      {/* Header */}
      <h1 className="text-4xl font-bold text-transparent bg-linear-to-br from-primary-700 to-primary-500 dark:from-primary-300 dark:to-primary-100 bg-clip-text">
        Dashboard
      </h1>

      <p className="mt-6 dark:text-neutral-300 text-neutral-500">
        Welcome back,
        <span className="font-semibold text-black dark:text-white"> {session.user.name}</span>.
      </p>

      {/* Quick Actions */}
      <AnimatedCardGrid className="mt-10">
        <Link href="/characters/new">
          <HoverCard className="h-full hover:bg-primary-50 dark:hover:bg-primary-950/20">
            <h2 className="mb-2 text-xl font-semibold text-primary-500 dark:text-primary-200">➕ Create Character</h2>
            <p className="text-sm dark:text-neutral-300 text-neutral-500">
              Start building a new hero for your Cosmere adventures.
            </p>
          </HoverCard>
        </Link>

        {/* My Characters */}
        <Link href="/characters">
          <HoverCard className="h-full hover:bg-green-50 dark:hover:bg-green-950/20">
            <h2 className="mb-2 text-xl font-semibold text-green-500 dark:text-green-200">📜 My Characters</h2>
            <p className="text-sm dark:text-neutral-300 text-neutral-500">
              View, edit, or delete your existing characters.
            </p>
          </HoverCard>
        </Link>

        {/* Talent Browser */}
        <Link href="/talents">
          <HoverCard className="h-full hover:bg-accent-50 dark:hover:bg-accent-950/20">
            <h2 className="mb-2 text-xl font-semibold dark:text-accent-200 text-accent-500">⭐ Talent Browser</h2>
            <p className="text-sm dark:text-neutral-300 text-neutral-500">Explore talent trees and plan your builds.</p>
          </HoverCard>
        </Link>
      </AnimatedCardGrid>

      {/* Character List */}
      <h2 className="mt-12 mb-4 text-2xl font-semibold text-black dark:text-white">Your Characters</h2>

      {characters.length === 0 ? (
        <p className="italic text-neutral-400">You haven't created any characters yet.</p>
      ) : (
        <div className="space-y-4">
          {characters.map((c) => (
            <Link
              key={c.id}
              href={`/characters/${c.id}`}
              className="block p-5 transition border rounded-lg shadow-md border-white/10 bg-white/5 hover:bg-white/10 dark:bg-neutral-900/40 dark:hover:bg-neutral-900/60 backdrop-blur-md"
            >
              <h3 className="text-xl font-bold dark:text-primary-200 text-primary-800">
                {c.name !== "" ? c.name : "Unnamed"}
              </h3>
              <p className="text-sm dark:text-neutral-300 text-neutral-500">
                {c.ancestry} • Level {c.level}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
