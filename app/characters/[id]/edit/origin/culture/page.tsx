import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CulturePicker } from "./CulturePicker";

export default async function CulturePage() {
  const session = await auth();
  if (!session) redirect("/auth/login");
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
      <CulturePicker />
    </div>
  );
}
