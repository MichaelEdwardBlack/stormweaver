import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AncestryPicker } from "./components/AncestryPicker";

export default async function OriginPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  const { id } = await params;
  const character = await prisma.character.findUnique({
    where: { id: id, userId: session.user.id },
  });
  const ancestry = character?.ancestry;

  return <AncestryPicker characterId={id} ancestry={ancestry} />;
}
