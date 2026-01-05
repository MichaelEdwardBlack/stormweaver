"use client";

import { GlossaryText } from "@/components/GlossaryText";
import { Button } from "@/components/ui/buttons/Button";
import { Item } from "@/lib/actions/equipment";

type SelectOrPurchaseWeaponsProps = {
  weaponList: Item[];
  characterWeapons: Item[];
  isFree?: boolean;
  canIncrement?: (weapon: Item) => boolean;
  onSelect: (weapon: Item) => void;
  onRemove: (weapon: Item) => void;
};

export const WeaponTable = ({
  weaponList,
  characterWeapons,
  isFree = false,
  onSelect,
  onRemove,
  canIncrement,
}: SelectOrPurchaseWeaponsProps) => {
  const getRangeText = (weapon: Item) => {
    if (weapon.weapon?.isRanged) {
      return `Ranged [${weapon.weapon?.shortRange}/${weapon.weapon?.longRange}]`;
    } else if ((weapon.weapon?.reach ?? 0) > 5) {
      return `Melee [+${weapon.weapon!.reach - 5}]`;
    } else {
      return "Melee";
    }
  };
  return (
    <table>
      <thead>
        <tr>
          <th>Quantity</th>
          <th>Name</th>
          <th>Damage</th>
          <th>Range</th>
          <th>Traits</th>
          <th>Expert Traits</th>
          <th>Weight</th>
          {!isFree && <th>Price</th>}
        </tr>
      </thead>
      <tbody>
        {weaponList.map((weapon, i) => {
          const quantity = characterWeapons.filter((w) => w.id === weapon.id).length;
          return (
            <tr key={i}>
              <td>
                <div className="flex flex-row gap-2 items-center">
                  <Button
                    color={quantity === 0 ? "neutral" : "primary"}
                    disabled={quantity === 0}
                    onClick={() => onRemove(weapon)}
                    className="px-3 py-1"
                  >
                    -
                  </Button>
                  {quantity}
                  <Button
                    color={canIncrement?.(weapon) ? "primary" : "neutral"}
                    disabled={!canIncrement?.(weapon)}
                    onClick={() => onSelect(weapon)}
                    className="px-3 py-1"
                  >
                    +
                  </Button>
                </div>
              </td>
              <td>{weapon.name}</td>
              <td>
                {weapon.modifierSource?.modifiers[0].diceValue} {weapon.modifierSource?.modifiers[0].damageType}
              </td>
              <td>{getRangeText(weapon)}</td>
              <td>
                <GlossaryText text={weapon.weapon?.traits.join(", ") ?? ""} />
              </td>
              <td>
                <GlossaryText text={weapon.weapon?.expertTraits.join(", ") ?? ""} />
              </td>
              <td>{weapon.weight}</td>
              {!isFree && <td>{weapon.price} mk</td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
