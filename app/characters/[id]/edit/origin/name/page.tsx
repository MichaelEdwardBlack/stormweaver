import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NameInput } from "./NameInput";
import { ExpertiseType } from "@/lib/generated/prisma/enums";

export default async function NamePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  const { id } = await params;
  const character = await prisma.character.findUnique({
    where: { id: id, userId: session.user.id },
  });
  const culture = await prisma.characterExpertise.findMany({
    where: { characterId: id, isOrigin: true, type: ExpertiseType.cultural },
  });

  return (
    <NameInput characterId={id} characterName={character?.name ?? ""} characterCulture={culture.map((c) => c.name)} />
  );
}
