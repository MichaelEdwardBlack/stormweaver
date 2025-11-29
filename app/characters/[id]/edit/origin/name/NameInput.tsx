"use client";

import { useState, useEffect } from "react";
import { updateName } from "@/lib/actions/character";
import { motion } from "framer-motion";
import { useDebounce } from "@/lib/hooks/debounce";
import { AllFemaleNames, AllMaleNames, AllNames, CulturalInfo } from "@/lib/data/culture";
import { FaDiceD20 } from "react-icons/fa6";
import { cn } from "@/lib/utils/styles";
import { GiFemale, GiMale } from "react-icons/gi";
import { MotionButton } from "@/components/ui/buttons/MotionButton";

interface Props {
  characterId: string;
  characterName: string;
  characterCulture: string[];
}

export function NameInput({ characterId, characterName, characterCulture }: Props) {
  const [name, setName] = useState(characterName);
  const [rolling, setRolling] = useState(false);
  const [gender, setGender] = useState<"male" | "female" | "unisex">("unisex");

  // Wait 600ms after typing stops
  const debouncedName = useDebounce(name, 600);

  // Save function (API call)
  async function saveName(newName: string) {
    updateName(characterId, newName);
  }

  // Auto-save when debounced value changes
  useEffect(() => {
    if (debouncedName !== characterName) {
      saveName(debouncedName);
    }
  }, [debouncedName]);

  const originOfName = CulturalInfo.find((c) => c.names.includes(name))?.name;

  const generateRandomName = () => {
    let names = CulturalInfo.filter((c) => characterCulture.includes(c.name)).flatMap((c) =>
      gender === "male" ? c.maleNames : gender === "female" ? c.femaleNames : c.names
    );
    if (names.length === 0) names = gender === "male" ? AllMaleNames : gender === "female" ? AllFemaleNames : AllNames;
    if (names.length > 0) {
      setRolling(true); // start spin
      setTimeout(() => {
        const randomName = names[Math.floor(Math.random() * names.length)];
        setName(randomName);
        setRolling(false); // stop spin after animation
      }, 600); // matches animation duration
    }
  };

  const onGenderSelect = (selectedGender: "male" | "female") => {
    if (gender === selectedGender) {
      setGender("unisex");
    } else {
      setGender(selectedGender);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xl font-bold">Enter Your Heroe's Name:</label>

      <div className="flex items-center justify-center w-full max-w-md">
        <input
          type="text"
          className="w-full p-2 pr-20 border border-r-0 rounded-md rounded-r-none border-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500 peer"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your hero's name..."
        />

        <button
          type="button"
          onClick={generateRandomName}
          className="flex items-center gap-1 px-3 py-2 text-white border rounded-md rounded-l-none cursor-pointer peer-focus:ring-2 peer-focus:ring-accent-500 peer-focus:outline-none bg-accent-500 hover:bg-accent-600 border-accent-500 hover:border-accent-600"
        >
          <motion.div
            animate={rolling ? { rotate: 360 } : { rotate: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              repeat: rolling ? Infinity : 0,
            }}
          >
            <FaDiceD20 size={16} />
          </motion.div>
          Random
        </button>
      </div>
      <div className="relative">
        {originOfName && (
          <div className="absolute -top-3 left-1 text-neutral-600 dark:text-neutral-400 font">{originOfName} name</div>
        )}
      </div>
      <div className="py-4 text-xl font-semibold">Filter Names by Gender</div>
      <div className="flex flex-row gap-4">
        <MotionButton
          className={cn(
            "p-2 rounded border peer-focus:ring-2 peer-focus:ring-accent-500 peer-focus:outline-none border-neutral-300 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950",
            gender === "male" && "text-primary-400 border-primary-400"
          )}
          type="button"
          onClick={() => onGenderSelect("male")}
        >
          <GiMale size={24} />
        </MotionButton>

        <MotionButton
          className={cn(
            "p-2 rounded border peer-focus:ring-2 peer-focus:ring-accent-500 peer-focus:outline-none border-neutral-300 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950",
            gender === "female" && "text-primary-400 border-primary-400"
          )}
          type="button"
          onClick={() => onGenderSelect("female")}
        >
          <GiFemale size={24} />
        </MotionButton>
      </div>
    </div>
  );
}
