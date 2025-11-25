import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  console.log("session", session);
  if (!session) {
    redirect("/auth/login");
  }

  const characters = await prisma.character.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto px-5 py-10 max-w-5xl">
      {/* Header */}
      <h1 className="mb-6 font-bold text-amber-400 text-4xl">StormWeaver Dashboard</h1>

      <p className="mb-10 text-slate-300">
        Welcome back,
        <span className="font-semibold text-white"> {session.user.name}</span>.
      </p>

      {/* Quick Actions */}
      <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3 mb-12">
        <Link
          href="/builder"
          className="bg-amber-500/20 hover:bg-amber-500/30 p-6 border border-amber-500/40 rounded-xl transition"
        >
          <h2 className="mb-2 font-semibold text-amber-300 text-xl">➕ Create Character</h2>
          <p className="text-slate-300 text-sm">Start building a new hero for your Cosmere adventures.</p>
        </Link>

        <Link
          href="/characters"
          className="bg-sky-500/20 hover:bg-sky-500/30 p-6 border border-sky-500/40 rounded-xl transition"
        >
          <h2 className="mb-2 font-semibold text-sky-300 text-xl">📜 My Characters</h2>
          <p className="text-slate-300 text-sm">View, edit, or delete your existing characters.</p>
        </Link>

        <Link
          href="/talents"
          className="bg-purple-500/20 hover:bg-purple-500/30 p-6 border border-purple-500/40 rounded-xl transition"
        >
          <h2 className="mb-2 font-semibold text-purple-300 text-xl">⭐ Talent Browser</h2>
          <p className="text-slate-300 text-sm">Explore talent trees and plan your builds.</p>
        </Link>
      </div>

      {/* Character List Section */}
      <h2 className="mb-4 font-semibold text-white text-2xl">Your Characters</h2>

      {characters.length === 0 ? (
        <p className="text-slate-400 italic">You haven't created any characters yet.</p>
      ) : (
        <div className="space-y-4">
          {characters.map((c) => (
            <Link
              key={c.id}
              href={`/characters/${c.id}`}
              className="block hover:bg-slate-700/40 p-5 border border-slate-700 rounded-lg transition"
            >
              <h3 className="font-bold text-amber-300 text-xl">{c.name}</h3>
              <p className="text-slate-300 text-sm">
                {c.ancestry} • Level {c.level}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
