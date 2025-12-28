"use client";

import { HeroGrid } from "@/app/characters/components/HeroGrid";
import { TalentTree } from "@/app/characters/components/TalentTree";
import { ToggleSlider } from "@/app/characters/components/ToggleSlider";
import { Button } from "@/components/ui/buttons/Button";
import { addCharacterPath, unlockCharacterTalent, updateSkill } from "@/lib/actions/character";
import { PathInfo as Info } from "@/lib/data/paths";
import { Path } from "@/lib/generated/prisma/enums";
import { useCharacter } from "@/services/CharacterProvider";
import { useState } from "react";
import { SelectedPath } from "./SelectedPath";
import { PathInfo } from "../../../../components/PathInfo";
import { allBaseSkills } from "@/lib/data/skills";
import { useToast } from "@/services/ToastProvider";

export const StartingPathPicker = () => {
  const character = useCharacter().character;
  const { toast } = useToast();
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
            className="sticky -top-6 z-30 mr-0 ml-auto mt-4 text-xl"
            onClick={() => {
              if (!path) return;
              addCharacterPath(character.id, path, true);
              unlockCharacterTalent(character.id, pathInfo.keyTalent.id, false);
              try {
                if (pathInfo.startingPathSkill) {
                  const skillAttribute = allBaseSkills.find((s) => s.skill === pathInfo.startingPathSkill)?.attribute;
                  if (skillAttribute) {
                    updateSkill(character.id, { skill: pathInfo.startingPathSkill, attribute: skillAttribute }, 1);
                  } else {
                    throw new Error("Starting path attribute not found for skill: " + pathInfo.startingPathSkill);
                  }
                } else {
                  throw new Error("No starting path skill defined for path: " + pathInfo.name);
                }
              } catch (error) {
                toast({
                  title: "Error updating starting path skill",
                  message: (error as Error).message,
                  variant: "error",
                  duration: 10000,
                });
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
