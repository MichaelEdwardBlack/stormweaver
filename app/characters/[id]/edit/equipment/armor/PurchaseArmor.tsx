"use client";

import { getArmor, Item } from "@/lib/actions/equipment";
import { useCharacter } from "@/services/CharacterProvider";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import { LoadingTable } from "../components/LoadingTable";
import { ArmorTable } from "../components/ArmorTable";
import { useToast } from "@/services/ToastProvider";
import { addCharacterItem, removeCharacterItem, updateCharacterMarks } from "@/lib/actions/character";
import { CurrentMarks } from "../components/CurrentMarks";

export const PurchaseArmor = () => {
  const character = useCharacter().character;
  const [isLoaded, setIsLoaded] = useState(false);
  const [armors, setArmor] = useState<Item[]>([]);
  const { toast } = useToast();
  const [characterArmor, setCharacterArmor] = useOptimistic(
    character.itemInstances.filter((e) => e.item.type === "armor").map((e) => e.item),
    (_previous, next: Item[]) => next
  );
  const [characterMarks, setCharacterMarks] = useOptimistic(character.marks, (_previous, next: number) => next);

  const fetchArmor = () => {
    startTransition(async () => {
      try {
        const response = await getArmor();
        setArmor(response);
        setIsLoaded(true);
      } catch (error) {
        toast({
          title: "Error",
          message: "Error fetching armors:" + error,
          variant: "error",
        });
      }
    });
  };
  useEffect(() => {
    fetchArmor();
  }, []);

  const onSelect = (armor: Item) => {
    if ((armor.price ?? 0) > character.marks) return;
    const newMarks = characterMarks - (armor.price ?? 0);
    addCharacterItem(character.id, armor.id);
    updateCharacterMarks(character.id, newMarks);
    startTransition(() => {
      setCharacterArmor([...characterArmor, armor]);
      setCharacterMarks(newMarks);
    });
  };

  const onRemove = (armor: Item) => {
    const newMarks = characterMarks + (armor.price ?? 0);
    removeCharacterItem(character.id, armor.id);
    updateCharacterMarks(character.id, newMarks);
    startTransition(() => {
      const indexToDelete = characterArmor.findIndex((a) => a.id === armor.id);
      setCharacterArmor(characterArmor.filter((a, i) => i !== indexToDelete));
      setCharacterMarks(newMarks);
    });
  };

  if (!isLoaded) {
    return <LoadingTable />;
  } else {
    return (
      <div className="flex flex-col gap-4">
        <div>Purchase Armor</div>
        <CurrentMarks className="sticky z-10 -top-8" marks={characterMarks} />
        <div>These armors will be added to you inventory in addition to your starting kit armors (if any)</div>
        <div>Starting kit armors:</div>
        <ul>
          {characterArmor
            .filter((a) => a.acquisition === "startingKit")
            .map((a, i) => (
              <li key={i}>{a.name}</li>
            ))}
        </ul>
        <ArmorTable
          armorList={armors}
          characterArmor={characterArmor}
          onSelect={onSelect}
          onRemove={onRemove}
          canIncrement={(item) => (item.price ?? 0) <= characterMarks}
        />
      </div>
    );
  }
};
