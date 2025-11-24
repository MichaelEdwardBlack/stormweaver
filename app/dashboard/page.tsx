import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const characters = await prisma.character.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      {/* Header */}
      <h1 className="text-4xl font-bold text-amber-400 mb-6">StormWeaver Dashboard</h1>

      <p className="text-slate-300 mb-10">
        Welcome back,
        <span className="text-white font-semibold"> {session.user.name}</span>.
      </p>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link
          href="/builder"
          className="bg-amber-500/20 border border-amber-500/40 p-6 rounded-xl hover:bg-amber-500/30 transition"
        >
          <h2 className="text-xl font-semibold text-amber-300 mb-2">➕ Create Character</h2>
          <p className="text-slate-300 text-sm">Start building a new hero for your Cosmere adventures.</p>
        </Link>

        <Link
          href="/characters"
          className="bg-sky-500/20 border border-sky-500/40 p-6 rounded-xl hover:bg-sky-500/30 transition"
        >
          <h2 className="text-xl font-semibold text-sky-300 mb-2">📜 My Characters</h2>
          <p className="text-slate-300 text-sm">View, edit, or delete your existing characters.</p>
        </Link>

        <Link
          href="/talents"
          className="bg-purple-500/20 border border-purple-500/40 p-6 rounded-xl hover:bg-purple-500/30 transition"
        >
          <h2 className="text-xl font-semibold text-purple-300 mb-2">⭐ Talent Browser</h2>
          <p className="text-slate-300 text-sm">Explore talent trees and plan your builds.</p>
        </Link>
      </div>

      {/* Character List Section */}
      <h2 className="text-2xl font-semibold text-white mb-4">Your Characters</h2>

      {characters.length === 0 ? (
        <p className="text-slate-400 italic">You haven't created any characters yet.</p>
      ) : (
        <div className="space-y-4">
          {characters.map((c) => (
            <Link
              key={c.id}
              href={`/characters/${c.id}`}
              className="block border border-slate-700 rounded-lg p-5 hover:bg-slate-700/40 transition"
            >
              <h3 className="text-xl font-bold text-amber-300">{c.name}</h3>
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
