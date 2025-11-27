import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { DeleteCharacterButton } from "./components/DeleteCharacterButton";
import { Button } from "@/components/ui/buttons/Button";

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  const { id } = await params;

  const character = await prisma.character.findUnique({
    where: { id: id, userId: session.user.id },
  });

  if (!character) notFound();

  return (
    <div className="w-full max-w-4xl px-6 py-10 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary-300 dark:text-primary-200">
          {character.name || "Untitled Character"}
        </h1>

        <div className="flex gap-3">
          <Link href={`/characters/${character.id}/edit`}>
            <Button>Edit</Button>
          </Link>

          <DeleteCharacterButton id={character.id} />
        </div>
      </div>

      {/* Character Card */}
      <div className="p-6 border shadow-xl rounded-xl border-white/10 dark:border-neutral-700/40 bg-white/5 dark:bg-neutral-900/40 backdrop-blur-md">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">Overview</h2>
        </div>

        <div className="space-y-2 text-neutral-700 dark:text-neutral-300">
          <p>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Name:</span>{" "}
            {character.name || "Unnamed"}
          </p>
          <p>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Level:</span> {character.level}
          </p>
          <p>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Ancestry:</span>{" "}
            {character.ancestry || "Unknown"}
          </p>

          <p>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Last Updated:</span>{" "}
            {character.updatedAt.toLocaleDateString()} at {character.updatedAt.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
