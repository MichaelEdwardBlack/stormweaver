"use client";

import { TalentTree } from "@/app/characters/components/TalentTree";
import { Path } from "@/lib/generated/prisma/enums";
import { PathInfo } from "./PathInfo";
import { Button } from "@/components/ui/buttons/Button";
import { useModal } from "@/services/ModalProvider";
import { useCharacter } from "@/services/CharacterProvider";
import { changeStartingPath } from "@/lib/actions/character";
import { useState } from "react";

type Props = {
  path: Path;
};
export function SelectedPath({ path }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { openModal, closeModal } = useModal();
  const characterId = useCharacter().character.id;
  return (
    <div>
      <Button
        variant="ghost"
        color="destructive"
        className="fixed top-16 z-30 right-6"
        onClick={() => {
          openModal({
            title: "Are you sure?",
            content: (
              <div className="flex flex-col gap-4">
                <div>
                  Changing paths will aslo reset all of your attributes, skills, talents, and anything else you've
                  selected since selecting your starting path.
                </div>
                <div className="flex flex-row gap-4">
                  <Button
                    color="destructive"
                    onClick={async () => {
                      setIsLoading(true);
                      await changeStartingPath(characterId);
                      setIsLoading(false);
                      closeModal();
                    }}
                    pending={isLoading}
                  >
                    Change Path
                  </Button>
                  <Button color="neutral" onClick={closeModal}>
                    Cancel
                  </Button>
                </div>
              </div>
            ),
          });
        }}
      >
        Change Path
      </Button>
      <PathInfo path={path} />
      {path && <TalentTree pathId={path} readonly={true} />}
    </div>
  );
}
