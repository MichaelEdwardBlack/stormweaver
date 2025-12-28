import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CharacterCreationProgress } from "./CharacterCreationProgress";

export default async function NewCharacterPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  return <CharacterCreationProgress userId={session.user.id} />;
}
