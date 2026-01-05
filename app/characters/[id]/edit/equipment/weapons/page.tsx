import { GiPlainDagger } from "react-icons/gi";
import { PurchaseWeapons } from "./PurchaseWeapons";

export default function WeaponsPage() {
  return (
    <div className="flex flex-col">
      <h1 className="flex items-center gap-2 p-2 text-accent-400">
        <GiPlainDagger /> Purchase Weapons
      </h1>
      <PurchaseWeapons />
    </div>
  );
}
