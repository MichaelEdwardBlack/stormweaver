"use client";

import { useOptimistic, startTransition } from "react";
import { ExpandableCard } from "@/components/ui/cards/ExpandableCard";
import { HumanDescription } from "./HumanDescription";
import { SingerDescription } from "./SingerDescription";
import { Ancestry } from "@/lib/generated/prisma/enums";
import { updateAncestry } from "@/lib/actions/character";
import { useCharacter } from "@/services/CharacterProvider";

export function AncestryPicker() {
  const character = useCharacter().character;
  const characterId = character.id;
  const ancestry = character.ancestry;
  const [optimisticAncestry, setAncestry] = useOptimistic(
    ancestry,
    (_currentAncestry, newAncestry: Ancestry | null) => {
      return newAncestry;
    }
  );
  const select = async (newAncestry: Ancestry) => {
    if (newAncestry === optimisticAncestry) return;
    const previous = optimisticAncestry;

    // Perform optimistic update inside a transition to satisfy React
    startTransition(() => setAncestry(newAncestry));

    try {
      await updateAncestry(characterId, newAncestry);
    } catch (err) {
      // Rollback inside transition
      startTransition(() => setAncestry(previous));
      console.error(err);
      // Optionally show a user-facing error here
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold">Select Ancestry</h1>
      <ExpandableCard
        title="Human"
        description="Most of Roshar is divided into human-ruled nations with majority-human populations."
        action={() => select("Human")}
        actionLabel={optimisticAncestry === "Human" ? "Selected" : "Select"}
        className={optimisticAncestry === "Human" ? "border-2 border-accent-500" : ""}
        actionClassName={optimisticAncestry === "Human" ? "bg-accent-400 dark:bg-accent-600" : ""}
      >
        <HumanDescription />
      </ExpandableCard>

      <ExpandableCard
        title="Singer"
        description="Singers are a diverse species with a wide range of physical forms and abilities."
        action={() => select("Singer")}
        actionLabel={optimisticAncestry === "Singer" ? "Selected" : "Select"}
        className={optimisticAncestry === "Singer" ? "border-2 border-accent-500" : ""}
        actionClassName={optimisticAncestry === "Singer" ? "bg-accent-400 dark:bg-accent-600" : ""}
      >
        <SingerDescription />
      </ExpandableCard>
    </div>
  );
}
