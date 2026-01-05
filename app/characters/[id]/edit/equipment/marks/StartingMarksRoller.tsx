"use client";

import { DieRollerInput } from "@/components/dice/DieRollerInput";
import { clearPurchasedEquipment, updateCharacterMarks } from "@/lib/actions/character";
import { StartingKits } from "@/lib/data/startingKits";
import { useCharacter } from "@/services/CharacterProvider";
import { startTransition, useOptimistic } from "react";

export const StartingMarksRoller = () => {
  const character = useCharacter().character;
  const startingKit = StartingKits.find((kit) => kit.name === character.startingKit);
  const [optimisticMarks, setOptimisticMarks] = useOptimistic(character.marks, (_previous, next: number) => next);
  return (
    <div className="flex flex-col gap-2">
      <div>Roll {startingKit?.spheres} to determine how many marks you start with</div>
      <DieRollerInput
        dice={startingKit!.spheres}
        onChange={async (value) => {
          startTransition(() => {
            setOptimisticMarks(value);
          });
          await updateCharacterMarks(character.id, value);
          await clearPurchasedEquipment(character.id);
        }}
        initialValue={optimisticMarks}
      />
    </div>
  );
};
