"use client";

import { getStartingWeapons, Item } from "@/lib/actions/equipment";
import { useCharacter } from "@/services/CharacterProvider";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import { LoadingTable } from "../components/LoadingTable";
import { WeaponTable } from "../components/WeaponTable";
import { useToast } from "@/services/ToastProvider";
import { StartingKits } from "@/lib/data/startingKits";
import { addCharacterItem, removeCharacterItem } from "@/lib/actions/character";

export const StartingWeaponPicker = () => {
  const character = useCharacter().character;
  const [isLoaded, setIsLoaded] = useState(false);
  const [weapons, setWeapons] = useState<Item[]>([]);
  const { toast } = useToast();
  const startingKit = StartingKits.find((kit) => kit.name === character.startingKit);
  const totalStartingWeapons = startingKit?.weapons.amount ?? 0;
  const [characterWeapons, setCharacterWeapons] = useOptimistic(
    character.itemInstances.filter((e) => e.item.type === "weapon").map((e) => e.item),
    (_previous, next: Item[]) => next
  );
  const startingCharacterWeapons = characterWeapons.filter((w) => w.acquisition === "startingKit");

  const fetchWeapons = () => {
    startTransition(async () => {
      try {
        const response = await getStartingWeapons(character.startingKit);
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
    if (startingCharacterWeapons.length >= totalStartingWeapons) return;
    addCharacterItem(character.id, weapon.id);
    startTransition(() => {
      setCharacterWeapons([...characterWeapons, weapon]);
    });
  };

  const onRemove = (weapon: Item) => {
    removeCharacterItem(character.id, weapon.id);
    startTransition(() => {
      const indexToDelete = characterWeapons.findIndex((w) => w.id === weapon.id);
      setCharacterWeapons(characterWeapons.filter((w, i) => i !== indexToDelete));
    });
  };

  if (!isLoaded) {
    return <LoadingTable />;
  } else {
    return (
      <div className="flex flex-col gap-4">
        <div>
          Select {totalStartingWeapons} Starting Weapon{totalStartingWeapons > 1 ? "s" : ""}
        </div>
        <WeaponTable
          weaponList={weapons}
          characterWeapons={characterWeapons}
          isFree={true}
          onSelect={onSelect}
          onRemove={onRemove}
          canIncrement={(_weapon) => startingCharacterWeapons.length < totalStartingWeapons}
        />
      </div>
    );
  }
};
