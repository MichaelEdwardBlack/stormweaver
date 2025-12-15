"use client";

import { HeroGrid } from "@/app/characters/components/HeroGrid";
import { TalentTree } from "@/app/characters/components/TalentTree";
import { ToggleSlider } from "@/app/characters/components/ToggleSlider";
import { Button } from "@/components/ui/buttons/Button";
import { addCharacterPath, unlockCharacterTalent } from "@/lib/actions/character";
import { PathInfo as Info } from "@/lib/data/paths";
import { Path } from "@/lib/generated/prisma/enums";
import { useCharacter } from "@/services/CharacterProvider";
import { useState } from "react";
import { SelectedPath } from "./SelectedPath";
import { PathInfo } from "./PathInfo";

export const StartingPathPicker = () => {
  const character = useCharacter().character;
  const [path, setPath] = useState<Path | null>(null);
  const [isStacked, setIsStacked] = useState(true);
  const pathInfo = path ? Info[path] : null;
  const startingPath = character.paths.find((p) => p.isStartingPath);
  if (startingPath) return <SelectedPath path={startingPath.path} />;
  return (
    <div className="relative">
      <h1>Select a Heroic Path</h1>
      <HeroGrid onSelect={(path) => setPath(path)} selectedPath={path} />
      {pathInfo && (
        <>
          <Button
            variant="ghost"
            color="accent"
            className="sticky top-17 z-30 mr-0 ml-auto mt-4 text-xl"
            onClick={() => {
              if (!path) return;
              addCharacterPath(character.id, path, true);
              unlockCharacterTalent(character.id, pathInfo.keyTalent.id, false);
              if (pathInfo.startingPathSkill) {
                // increaseRank(pathInfo.startingPathSkill);
              }
              if (character.ancestry === "Singer") {
                addCharacterPath(character.id, "singer", false);
                unlockCharacterTalent(character.id, Info.singer.keyTalent.id, true);
              }
            }}
          >
            Select Path
          </Button>
          <PathInfo path={path!} />
          <div className="w-full flex justify-end">
            <ToggleSlider
              value={isStacked}
              onToggle={(stacked) => setIsStacked(stacked)}
              onLabel="Tall"
              offLabel="Broad"
              onColor="var(--color-primary-500)"
              offColor="var(--color-accent-500)"
            />
          </div>
        </>
      )}
      {path && <TalentTree isStacked={isStacked} pathId={path} readonly={true} />}
    </div>
  );
};
