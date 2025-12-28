"use client";

import { createCharacter, initCharacterAttributes, initCharacterSkills } from "@/lib/actions/character";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const CharacterCreationProgress = ({ userId }: { userId: string }) => {
  const hasStarted = useRef(false);
  const [step, setStep] = useState<string>("Setting up basic template...");
  const [isPending, startTransition] = useTransition();

  const startCharacterCreation = () => {
    startTransition(async () => {
      await delay(1000);
      const character = await createCharacter();

      setStep("Setting up starting attributes...");
      await initCharacterAttributes(character.id);
      await delay(2000);

      setStep("Setting up starting skills...");
      await initCharacterSkills(character.id);
      await delay(2000);

      setStep("Preparing defaults and loading the editor...");
      await delay(1000);
      redirect(`/characters/${character.id}/edit/origin/ancestry`);
    });
  };

  useEffect(() => {
    if (hasStarted.current === true) return;
    hasStarted.current = true;
    console.log("starting character creation", hasStarted);
    startCharacterCreation();
  }, []);

  return (
    <div className="flex items-center justify-center h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center px-10 py-8 border shadow-lg rounded-2xl bg-neutral-100/40 dark:bg-neutral-900/40 backdrop-blur-lg border-neutral-200/20 dark:border-neutral-700/30"
      >
        {/* Animated Orb */}
        <motion.div
          className="
            w-12 h-12 rounded-full
            bg-linear-to-br from-primary-400 to-primary-600
            dark:from-primary-700 dark:to-primary-500
            shadow-[0_0_30px_-6px_var(--color-primary-500)]
          "
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />

        <p className="mt-5 font-medium text-neutral-700 dark:text-neutral-300">Creating your character…</p>

        <p className="mt-1 text-sm text-neutral-500">{step}</p>
      </motion.div>
    </div>
  );
};
