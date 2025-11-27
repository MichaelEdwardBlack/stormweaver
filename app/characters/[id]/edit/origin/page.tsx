import { ExpandableCard } from "@/components/ui/cards/ExpandableCard";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { HumanDescription } from "./components/HumanDescription";
import { SingerDescription } from "./components/SingerDescription";
import { revalidatePath } from "next/cache";

export default async function OriginPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  const { id } = await params;
  const character = await prisma.character.findUnique({
    where: { id: id, userId: session.user.id },
  });
  const ancestry = character?.ancestry;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-bold">Select Ancestry</div>
      <ExpandableCard
        title="Human"
        description="Most of Roshar is divided into human-ruled nations with majority-human populations."
        action={async () => {
          "use server";
          await prisma.character.update({
            where: { id: id, userId: session.user.id },
            data: {
              ancestry: "Human",
            },
          });
          revalidatePath(`/characters/${id}/edit/origin`);
        }}
        actionLabel={ancestry === "Human" ? "Selected" : "Select"}
        className={ancestry === "Human" ? "border-2 border-accent-500" : ""}
        actionClassName={ancestry === "Human" ? "bg-accent-500" : ""}
      >
        <HumanDescription />
      </ExpandableCard>
      <ExpandableCard
        title="Singer"
        description="Singers are a diverse species with a wide range of physical forms and abilities."
        action={async () => {
          "use server";
          await prisma.character.update({
            where: { id: id, userId: session.user.id },
            data: {
              ancestry: "Singer",
            },
          });
          revalidatePath(`/characters/${id}/edit/origin`);
        }}
        actionLabel={ancestry === "Singer" ? "Selected" : "Select"}
        className={ancestry === "Singer" ? "border-2 border-accent-500" : ""}
        actionClassName={ancestry === "Singer" ? "bg-accent-500" : ""}
      >
        <SingerDescription />
      </ExpandableCard>
    </div>
  );
}
