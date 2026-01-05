import { StartingMarksRoller } from "./StartingMarksRoller";

export default function StartingMarksPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1>Starting Spheres (Marks)</h1>
      <div>Marks are the currency used in Rosahar</div>
      <StartingMarksRoller />
    </div>
  );
}
