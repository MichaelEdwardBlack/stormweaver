"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function deleteCharacter(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.character.delete({
    where: { id, userId: session.user.id },
  });

  redirect("/characters");
}
