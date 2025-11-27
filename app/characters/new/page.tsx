import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoadingScreen from "./loading";

export default async function NewCharacterPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  // Show the loading screen immediately
  // (React renders this while server work happens)
  const loading = <LoadingScreen />;

  // Create the new character with defaults
  const character = await prisma.character.create({
    data: {
      userId: session.user.id,
      name: "",
      level: 1,
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3 seconds

  // Redirect to edit page
  redirect(`/characters/${character.id}/edit`);

  // Fallback (should never render, but React requires a return)
  return loading;
}
