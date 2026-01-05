"use client";

import { GlossaryText } from "@/components/GlossaryText";
import { Button } from "@/components/ui/buttons/Button";
import { Item } from "@/lib/actions/equipment";

type ArmorTableProps = {
  armorList: Item[];
  characterArmor: Item[];
  canIncrement?: (armor: Item) => boolean;
  onSelect: (armor: Item) => void;
  onRemove: (armor: Item) => void;
};

export const ArmorTable = ({ armorList, characterArmor, onSelect, onRemove, canIncrement }: ArmorTableProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Quantity</th>
          <th>Name</th>
          <th>Deflect Value</th>
          <th>Traits</th>
          <th>Expert Traits</th>
          <th>Weight</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {armorList.map((armor, i) => {
          const quantity = characterArmor.filter((a) => a.id === armor.id).length;
          return (
            <tr key={i}>
              <td>
                <div className="flex flex-row gap-2 items-center">
                  <Button
                    color={quantity === 0 ? "neutral" : "primary"}
                    disabled={quantity === 0}
                    onClick={() => onRemove(armor)}
                    className="px-3 py-1"
                  >
                    -
                  </Button>
                  {quantity}
                  <Button
                    color={canIncrement?.(armor) ? "primary" : "neutral"}
                    disabled={!canIncrement?.(armor)}
                    onClick={() => onSelect(armor)}
                    className="px-3 py-1"
                  >
                    +
                  </Button>
                </div>
              </td>
              <td>{armor.name}</td>
              <td>{armor.modifierSource?.modifiers[0].value}</td>
              <td>
                <GlossaryText text={armor.armor?.traits.join(", ") ?? ""} />
              </td>
              <td>
                <GlossaryText text={armor.armor?.expertTraits.join(", ") ?? ""} />
              </td>
              <td>{armor.weight}</td>
              <td>{armor.price} mk</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
