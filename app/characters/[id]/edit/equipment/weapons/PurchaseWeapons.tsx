"use client";

import { getWeapons, Item } from "@/lib/actions/equipment";
import { useCharacter } from "@/services/CharacterProvider";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import { LoadingTable } from "../components/LoadingTable";
import { WeaponTable } from "../components/WeaponTable";
import { useToast } from "@/services/ToastProvider";
import { addCharacterItem, removeCharacterItem, updateCharacterMarks } from "@/lib/actions/character";
import { CurrentMarks } from "../components/CurrentMarks";

export const PurchaseWeapons = () => {
  const character = useCharacter().character;
  const [isLoaded, setIsLoaded] = useState(false);
  const [weapons, setWeapons] = useState<Item[]>([]);
  const { toast } = useToast();
  const [characterWeapons, setCharacterWeapons] = useOptimistic(
    character.itemInstances.filter((e) => e.item.type === "weapon").map((e) => e.item),
    (_previous, next: Item[]) => next
  );
  const [characterMarks, setCharacterMarks] = useOptimistic(character.marks, (_previous, next: number) => next);

  const fetchWeapons = () => {
    startTransition(async () => {
      try {
        const response = await getWeapons();
        setWeapons(response);
        setIsLoaded(true);
      } catch (error) {
        toast({
          title: "Error",
          message: "Error fetching weapons:" + error,
          variant: "error",
        });
      }
    });
  };
  useEffect(() => {
    fetchWeapons();
  }, []);

  const onSelect = (weapon: Item) => {
    if ((weapon.price ?? 0) > character.marks) return;
    const newMarks = characterMarks - (weapon.price ?? 0);
    addCharacterItem(character.id, weapon.id);
    updateCharacterMarks(character.id, newMarks);
    startTransition(() => {
      setCharacterWeapons([...characterWeapons, weapon]);
      setCharacterMarks(newMarks);
    });
  };

  const onRemove = (weapon: Item) => {
    const newMarks = characterMarks + (weapon.price ?? 0);
    removeCharacterItem(character.id, weapon.id);
    updateCharacterMarks(character.id, newMarks);
    startTransition(() => {
      const indexToDelete = characterWeapons.findIndex((w) => w.id === weapon.id);
      setCharacterWeapons(characterWeapons.filter((w, i) => i !== indexToDelete));
      setCharacterMarks(newMarks);
    });
  };

  if (!isLoaded) {
    return <LoadingTable />;
  } else {
    return (
      <div className="flex flex-col gap-4">
        <div>Purchase Weapons</div>
        <CurrentMarks className="sticky z-10 -top-8" marks={characterMarks} />
        <div>These weapons will be added to you inventory in addition to your starting kit weapons (if any)</div>
        <div>Starting kit weapons:</div>
        <ul>
          {characterWeapons
            .filter((w) => w.acquisition === "startingKit")
            .map((w, i) => (
              <li key={i}>{w.name}</li>
            ))}
        </ul>
        <WeaponTable
          weaponList={weapons}
          characterWeapons={characterWeapons}
          isFree={false}
          onSelect={onSelect}
          onRemove={onRemove}
          canIncrement={(item) => (item.price ?? 0) <= characterMarks}
        />
      </div>
    );
  }
};
