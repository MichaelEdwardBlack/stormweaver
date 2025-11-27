import { Button } from "@/components/ui/buttons/Button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CharactersPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const characters = await prisma.character.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="w-full max-w-6xl px-6 py-10 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50">Your Characters</h2>

        <Link href="/characters/new">
          <Button color="accent">+ Create New</Button>
        </Link>
      </div>

      {characters.length === 0 ? (
        <p className="italic text-neutral-500 dark:text-neutral-400">You haven't created any characters yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((c) => (
            <Link
              key={c.id}
              href={`/characters/${c.id}`}
              className="block p-5 transition-all duration-150 border shadow-sm group rounded-xl border-neutral-300/20 dark:border-neutral-700/30 bg-neutral-50/40 dark:bg-neutral-900/40 backdrop-blur-md hover:border-primary-500/50 dark:hover:border-primary-400/50 hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 hover:shadow-md"
            >
              <h3 className="text-xl font-bold transition-colors text-primary-700 dark:text-primary-200 group-hover:text-primary-600 dark:group-hover:text-primary-300">
                {c.name}
              </h3>

              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {c.ancestry} • Level {c.level}
              </p>

              <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-500">
                Updated {new Date(c.updatedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
