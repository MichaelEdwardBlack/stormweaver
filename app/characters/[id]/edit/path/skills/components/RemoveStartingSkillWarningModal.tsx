"use client";
import { Button } from "@/components/ui/buttons/Button";
import { useModal } from "@/services/ModalProvider";

export const RemoveStartingSkillWarningModal = () => {
  const { closeModal } = useModal();
  return (
    <div className="flex flex-col gap-2">
      <div>This skill comes from your starting path. You cannot remove it without changing your starting path</div>
      <Button color="neutral" onClick={() => closeModal()}>
        Ok
      </Button>
    </div>
  );
};
