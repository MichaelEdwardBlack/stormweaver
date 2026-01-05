import { GiChestArmor } from "react-icons/gi";
import { PurchaseArmor } from "./PurchaseArmor";

export default function ArmorPage() {
  return (
    <div className="flex flex-col">
      <h1 className="flex items-center gap-2 p-2 text-accent-400">
        <GiChestArmor /> Purchase Armor
      </h1>
      <PurchaseArmor />
    </div>
  );
}
