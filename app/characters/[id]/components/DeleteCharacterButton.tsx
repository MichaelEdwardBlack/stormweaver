"use client";

import { Button } from "@/components/ui/buttons/Button";
import { Spinner } from "@/components/Spinner";
import { deleteCharacter } from "@/lib/actions/character";
import { useModal } from "@/services/ModalProvider";
import { useTransition } from "react";

export function DeleteCharacterButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const { openModal, closeModal } = useModal();

  return (
    <Button
      color="destructive"
      onClick={() => {
        openModal({
          title: "Delete Character",
          content: (
            <div className="space-y-4">
              <p>Are you 100% sure?</p>

              <div className="flex justify-end gap-3">
                <Button onClick={() => closeModal()} color="neutral" variant="outline">
                  Cancel
                </Button>

                <Button
                  onClick={() => {
                    startTransition(() => deleteCharacter(id));
                    closeModal();
                  }}
                  variant="outline"
                  color="destructive"
                >
                  Yes, Delete
                </Button>
              </div>
            </div>
          ),
        });
      }}
      disabled={isPending}
      className="px-4 py-2 text-sm font-medium text-white transition bg-red-600 rounded-md hover:bg-red-500 disabled:opacity-50"
    >
      <div className="flex gap-2">Delete {isPending && <Spinner />}</div>
    </Button>
  );
}
