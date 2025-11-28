import { ExpandableCard } from "@/components/ui/cards/ExpandableCard";
import { auth } from "@/lib/auth";
import { CulturalInfo } from "@/lib/data/culture";
import { ExpertiseType } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function CulturePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  const { id } = await params;
  const culturalExperises = await prisma.characterExpertise.findMany({
    where: { characterId: id, type: ExpertiseType.cultural, isOrigin: true },
  });
  const selectedNames = culturalExperises.map((expertise) => expertise.name);
  const isDisabled = selectedNames.length >= 2;
  return (
    <div className="flex flex-col gap-3">
      <div className="font-bold text-lg">Select 2 Cultural Expertises</div>
      <div className="flex flex-col gap-3">
        <p>
          <strong>Cultural expertises</strong> pertain to regional, social, and linguistic knowledge for a nation,
          culture, subculture, or other group of people.
        </p>
        <p>
          If you have a cultural expertise, you're deeply knowledgeable about that group's traditions, customs, and
          superstitions. You also know their history and current politics. You can communicate with others from that
          group through spoken language, signed language, other forms of communication, or all of the above.
        </p>
        <p>
          <strong>Examples.</strong> You can choose any cultrual expertise from the "Culture" section of chapter 2 - for
          example, a character from Herdaz probably has the Herdazian expertise, while a noble character might have the
          High Society expertise.
        </p>
      </div>
      {CulturalInfo.map((info) => (
        <ExpandableCard
          key={info.name}
          title={info.name}
          description={info.description}
          action={async () => {
            "use server";
            if (selectedNames.includes(info.name)) {
              // removeCulture(info.name);
            } else {
              if (isDisabled) return;
              // addCulture(info.name);
              // removeCulturalExpertise(info.name);
            }
          }}
          actionLabel={selectedNames.includes(info.name) ? "Selected" : "Select"}
          className={selectedNames.includes(info.name) ? "border-2 border-blue-500" : ""}
          actionClassName={
            selectedNames.includes(info.name)
              ? "bg-yellow-600"
              : isDisabled
              ? "bg-gray-800 opacity-50 cursor-not-allowed"
              : ""
          }
        >
          <div className="flex flex-col gap-3">
            {info.descriptions.map((desc, idx) => (
              <p key={idx}>{desc}</p>
            ))}
            <div className="my-4 text-2xl font-bold">{info.name} Names</div>
            <p>{info.names.join(", ")}</p>
            <div className="my-4 text-2xl font-bold">{info.name} Expertise</div>
            <p>{info.expertise}</p>
          </div>
        </ExpandableCard>
      ))}
    </div>
  );
}
