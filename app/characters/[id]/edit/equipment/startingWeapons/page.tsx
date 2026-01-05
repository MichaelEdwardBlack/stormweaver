import { GiPlainDagger } from "react-icons/gi";
import { StartingWeaponPicker } from "./StartingWeaponPicker";

export default function kitWeaponsPage() {
  return (
    <div className="flex flex-col">
      <h1 className="flex items-center gap-2 p-2 text-accent-400">
        <GiPlainDagger /> Starting Weapons
      </h1>
      <StartingWeaponPicker />
    </div>
  );
}
