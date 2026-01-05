"use client";

import { ExpandableCard } from "@/components/ui/cards/ExpandableCard";
import { updateCharacterKit } from "@/lib/actions/character";
import { StartingKits, StartingKitType } from "@/lib/data/startingKits";
import { useCharacter } from "@/services/CharacterProvider";
import { startTransition, useOptimistic } from "react";
import { GiLightBackpack } from "react-icons/gi";

export const StartingKitPicker = () => {
  const character = useCharacter().character;
  const [optimisticKit, setOptimisticKit] = useOptimistic(
    character.startingKit,
    (_previous, next: string | null) => next
  );

  const joinListWith = (list: string[], conjunction: "and" | "or") => {
    if (list.length === 2) {
      return list.join(` ${conjunction} `);
    }
    return list.reduce(
      (acc, curr, i, arr) =>
        i === 0 ? curr : i === arr.length - 1 ? `${acc}, ${conjunction} ${curr}` : `${acc}, ${curr}`,
      ""
    );
  };

  const formatWeaponsList = (kit: StartingKitType) => {
    if (kit.weapons.amount === 0) return "";
    const weaponArray: string[] = [];
    if (kit.weapons.names) {
      weaponArray.push(...kit.weapons.names);
    }
    if (kit.weapons.type) {
      let weaponString = kit.weapons.type + " weapon";
      if (kit.weapons.amount > 1) weaponString += "s";
      weaponArray.push(weaponString);
    }

    return `${kit.weapons.amount} ${joinListWith(weaponArray, "or")}`;
  };

  const toggle = (kitName: string) => {
    if (optimisticKit === kitName) {
      startTransition(() => {
        setOptimisticKit(null);
      });
      updateCharacterKit(character.id, null);
    } else {
      startTransition(() => {
        setOptimisticKit(kitName);
      });
      updateCharacterKit(character.id, kitName);
    }
  };
  return (
    <div>
      <h1 className="flex items-center gap-2 p-2 text-accent-400">
        <GiLightBackpack /> Starting Kits
      </h1>
      <div className="flex flex-col gap-3">
        {StartingKits.map((kit, i) => (
          <ExpandableCard
            key={i}
            title={kit.name + " Kit"}
            action={() => toggle(kit.name)}
            actionLabel="Select"
            actionClassName={optimisticKit === kit.name ? "bg-accent-400 dark:bg-accent-600" : ""}
          >
            {kit.weapons.amount > 0 && (
              <div>
                <strong>Weapons:</strong> {formatWeaponsList(kit)}
              </div>
            )}
            {kit.armor.length > 0 && (
              <div>
                <strong>Armor:</strong> {joinListWith(kit.armor, "and")}
              </div>
            )}
            <div>
              <strong>Equipment:</strong> {kit.equipment}
            </div>
            <div>
              <strong>Spheres:</strong> {kit.spheres}
            </div>
            {kit.expertise && (
              <div>
                <strong>Expertise:</strong> {kit.expertise}
              </div>
            )}
            {kit.connection && (
              <div>
                <strong>Connection:</strong> {kit.connection}
              </div>
            )}
          </ExpandableCard>
        ))}
      </div>
    </div>
  );
};
