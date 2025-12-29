"use client";

import { TalentTree } from "@/app/characters/components/TalentTree";
import { ToggleSlider } from "@/app/characters/components/ToggleSlider";
import { Button } from "@/components/ui/buttons/Button";
import {
  addCharacterPath,
  refundCharacterTalent,
  removeCharacterPath,
  unlockCharacterTalent,
} from "@/lib/actions/character";
import { PathInfo as Info } from "@/lib/data/paths";
import { Path } from "@/lib/generated/prisma/enums";
import { useCharacter } from "@/services/CharacterProvider";
import { startTransition, useOptimistic, useState } from "react";
import { PathInfo } from "../../../components/PathInfo";
import { AddHeroPathSelector } from "../../components/AddHeroPathSelector";
import { HeroCard } from "@/app/characters/components/HeroCard";
import { ALL_EDGES, TalentNode } from "@/lib/data/tree";
import { calculateAvailablePoints, hasUnlockedChildren } from "@/lib/utils/derivedStats";

export const BonusTalentPicker = () => {
  const character = useCharacter().character;
  const unlockedTalents = character.talents.map((t) => t.talentId);
  const startingPath = character.paths.find((p) => p.isStartingPath)?.path;
  const selectedPaths = character.paths.map((path) => path.path);
  const [optimisticPaths, setOptimisticPaths] = useOptimistic(selectedPaths, (_previous, next: Path[]) => next);
  const [path, setPath] = useState<Path | null>(selectedPaths[0]);
  const [isStacked, setIsStacked] = useState(true);
  const pathInfo = path ? Info[path] : null;
  const [optimisticTalents, setOptimisticTalents] = useOptimistic(unlockedTalents, (_previous, next: string[]) => next);

  const toggleTalent = (talent: TalentNode) => {
    if (optimisticTalents.find((t) => t === talent.id)) {
      startTransition(() => {
        setOptimisticTalents(optimisticTalents.filter((t) => t !== talent.id));
      });
      refundCharacterTalent(character.id, talent.id);
    } else {
      startTransition(() => {
        setOptimisticTalents([...optimisticTalents, talent.id]);
      });
      unlockCharacterTalent(character.id, talent.id, true);
    }
  };

  const addPath = (selectedPath: Path, keyTalent: string) => {
    startTransition(() => {
      setOptimisticPaths([...optimisticPaths, selectedPath]);
      setOptimisticTalents([...optimisticTalents, keyTalent]);
    });
    addCharacterPath(character.id, selectedPath!);
    unlockCharacterTalent(character.id, keyTalent, true);
  };

  const removePath = (selectedPath: Path, keyTalent: string) => {
    startTransition(() => {
      setOptimisticPaths(optimisticPaths.filter((p) => p !== selectedPath));
      setOptimisticTalents(optimisticTalents.filter((t) => t !== keyTalent));
    });
    removeCharacterPath(character.id, selectedPath);
    refundCharacterTalent(character.id, keyTalent);
  };

  const hasPointsAvailable =
    calculateAvailablePoints(character.level, character.ancestry === "Singer", optimisticTalents.length) > 0;

  return (
    <div className="relative">
      <h1>Ancestry Talent</h1>
      <div className="flex flex-wrap gap-2">
        {optimisticPaths.map((p, i) => (
          <div key={p} className="w-32">
            <HeroCard path={p} isSelected={p === path} onClick={() => setPath(p)} />
          </div>
        ))}
        {hasPointsAvailable && (
          <AddHeroPathSelector onSelect={(path) => setPath(path)} selectedPath={path ?? optimisticPaths[0]} />
        )}
      </div>
      {pathInfo && (
        <>
          {path && !optimisticPaths.includes(path) && hasPointsAvailable && (
            <Button
              variant="ghost"
              color="accent"
              className="sticky -top-6 z-30 mr-0 ml-auto mt-4 text-xl"
              onClick={() => addPath(path!, pathInfo.keyTalent.id)}
            >
              Select Path
            </Button>
          )}
          {path &&
            optimisticPaths.includes(path) &&
            path !== startingPath &&
            !hasUnlockedChildren(pathInfo.keyTalent.id, ALL_EDGES, optimisticTalents) && (
              <Button
                variant="ghost"
                color="destructive"
                className="sticky -top-6 z-30 mr-0 ml-auto mt-4 text-xl"
                onClick={() => removePath(path!, pathInfo.keyTalent.id)}
              >
                Remove Path
              </Button>
            )}
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
      {path && (
        <TalentTree
          isStacked={isStacked}
          pathId={path}
          readonly={!selectedPaths.includes(path)}
          onTalentSelect={toggleTalent}
          unlockedTalents={optimisticTalents}
        />
      )}
    </div>
  );
};
