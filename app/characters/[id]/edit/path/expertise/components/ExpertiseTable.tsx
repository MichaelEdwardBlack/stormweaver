"use client";
import { GlossaryText } from "@/components/GlossaryText";
import { MotionButton } from "@/components/ui/buttons/MotionButton";
import { addExpertise, removeExpertise } from "@/lib/actions/character";
import { Armor } from "@/lib/data/armor";
import { CulturalInfo } from "@/lib/data/culture";
import { LightAndHeavyWeapons, SpecialtyWeapons } from "@/lib/data/weapons";
import { ExpertiseType } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils/styles";
import { useCharacter } from "@/services/CharacterProvider";
import { startTransition, useOptimistic, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { GiArmorVest, GiBarracksTent, GiBeltArmor, GiShardSword, GiSwitchWeapon } from "react-icons/gi";

const expertiseTabs: ExpertiseType[] = ["armor", "weapon", "specialty", "cultural", "utility"];

type ExpertiseTab = (typeof expertiseTabs)[number];
type ExpertiseTableValues = {
  name: string;
  traits: string[];
  expertiseTraits: string[];
  type: ExpertiseType;
};
const data: Record<ExpertiseTab, ExpertiseTableValues[]> = {
  armor: Armor.map((x) => {
    return { name: x.name, traits: x.traits, expertiseTraits: x.expertTraits, type: "armor" };
  }),
  weapon: LightAndHeavyWeapons.map((x) => {
    return { name: x.name, traits: x.traits, expertiseTraits: x.expertTraits, type: "weapon" };
  }),
  specialty: SpecialtyWeapons.map((x) => {
    return { name: x.name, traits: x.traits, expertiseTraits: x.expertTraits, type: "specialty" };
  }),
  cultural: CulturalInfo.map((x) => {
    return { name: x.name, traits: [], expertiseTraits: [x.expertise], type: "cultural" };
  }),
  utility: [],
};

export const ExpertiseTable = () => {
  const character = useCharacter().character;
  const dbExpertises = character.expertises.map((expertise) => ({
    name: expertise.name,
    type: expertise.type,
    isOrigin: expertise.isOrigin,
  }));
  const originCultures = dbExpertises.filter((expertise) => expertise.isOrigin).map((culture) => culture.name);
  const [optimisticExpertises, setOptimisticExpertises] = useOptimistic(
    dbExpertises,
    (previous, next: { name: string; type: ExpertiseType }) => {
      if (!!previous.find((e) => e.name === next.name)) {
        return previous.filter((expertise) => expertise.name !== next.name);
      } else {
        return [
          ...previous,
          {
            name: next.name,
            type: next.type,
            isOrigin: false,
          },
        ];
      }
    }
  );
  const intellect = character.attributes.find((attr) => attr.attribute === "intellect");
  const [tab, setTab] = useState<ExpertiseTab>("armor");
  const utilityExpertises = optimisticExpertises.filter((expertise) => expertise.type === "utility");
  const [customUtilityExpertise, setCustomUtilityExpertise] = useState<string>("");
  const usedAllPoints = optimisticExpertises.length >= (intellect?.value ?? 0) + 2;

  const doesHaveExpertise = (name: string) => {
    return !!optimisticExpertises.find((e) => e.name === name);
  };
  const toggleExpertise = (expertise: Omit<ExpertiseTableValues, "traits" | "expertiseTraits">) => {
    startTransition(() => setOptimisticExpertises({ name: expertise.name, type: expertise.type }));
    if (doesHaveExpertise(expertise.name)) {
      removeExpertise(character.id, expertise.name);
    } else {
      addExpertise(character.id, expertise);
    }
  };
  const getNumExpertises = (t: ExpertiseType) => {
    return optimisticExpertises.filter((e) => e.type === t).length;
  };
  const getIconFromTab = (t: ExpertiseTab) => {
    switch (t) {
      case "armor":
        return <GiArmorVest />;
      case "cultural":
        return <GiBarracksTent />;
      case "utility":
        return <GiBeltArmor />;
      case "specialty":
        return <GiShardSword />;
      case "weapon":
        return <GiSwitchWeapon />;
      default:
        return;
    }
  };

  return (
    <div className="border border-accent-500 rounded-lg">
      <div className="flex bg-white/50 dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),rgba(0,0,0,0))] dark:bg-neutral-900/60 shadow-xl dark:shadow-[0_8px_24px_rgba(0,0,0,0.45),0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-xl rounded-t-lg w-full overflow-x-auto">
        {expertiseTabs.map((t, i) => (
          <div
            key={t}
            className={`relative flex-1 text-center py-3 px-4 cursor-pointer font-semibold transition-all duration-200 
              ${
                tab === t
                  ? "bg-amber-500 text-neutral-900 shadow-inner"
                  : "bg-neutral-800/40 text-neutral-300 hover:bg-neutral-700/60"
              } 
              ${i === 0 ? "rounded-tl-lg" : i === expertiseTabs.length - 1 ? "rounded-tr-lg" : ""}`}
            onClick={() => setTab(t)}
          >
            <span className="flex justify-center items-center gap-2 text-base capitalize">
              {t} {getIconFromTab(t)}
            </span>

            {/* Badge counter */}
            <div
              className={`absolute top-1 right-2 font-bold 
                ${tab === t ? "text-neutral-900" : "text-amber-400"}
              `}
            >
              {getNumExpertises(t)}
            </div>
          </div>
        ))}
      </div>

      {tab !== "utility" ? (
        <div className="overflow-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                {tab !== "cultural" && <th>Traits</th>}
                <th className={cn(tab === "cultural" && "min-w-xs")}>Expertise Traits</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {data[tab].map((row, i) => {
                const hasExpertise = doesHaveExpertise(row.name);
                const isOriginCulture = originCultures.includes(row.name);
                const disabled = (!hasExpertise && usedAllPoints) || isOriginCulture;
                return (
                  <tr
                    key={i}
                    className={`${disabled ? "disabled" : "cursor-pointer"} ${
                      hasExpertise || isOriginCulture ? "selected" : ""
                    }`}
                    onClick={() => {
                      if (!disabled) toggleExpertise(row);
                    }}
                  >
                    <td>{row.name}</td>
                    {tab !== "cultural" && (
                      <td>
                        <GlossaryText text={row.traits.join(", ")} />
                      </td>
                    )}
                    <td>
                      <GlossaryText text={row.expertiseTraits.join(", ")} />
                    </td>
                    <td>
                      <MotionButton
                        className={`px-2 py-1 rounded  ${
                          hasExpertise || isOriginCulture ? "bg-accent-600" : "bg-neutral-700"
                        } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                        disabled={disabled}
                      >
                        {isOriginCulture ? "Origin" : hasExpertise ? "Selected" : "Select"}
                      </MotionButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col gap-6 bg-neutral-800/30 shadow-md p-6 border border-neutral-700/40 rounded-xl">
          {/* Header */}
          <h2 className="pb-2 border-neutral-700 border-b font-bold text-neutral-100 text-xl">Utility Expertises</h2>

          {/* Expertise list */}
          <div className="flex flex-col gap-2">
            {utilityExpertises.length > 0 ? (
              utilityExpertises.map((expertise, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-neutral-700/30 px-3 py-2 border border-neutral-600/40 rounded-lg"
                >
                  <span className="font-medium text-neutral-100">{expertise.name}</span>
                  <button
                    onClick={() => toggleExpertise(expertise)}
                    className="text-red-400 hover:text-red-300 text-sm transition-colors cursor-pointer"
                  >
                    <FaTrashCan size={20} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-neutral-400 italic">No expertises added yet.</p>
            )}
          </div>

          {/* Add new expertise */}
          <div className="relative flex gap-2">
            <input
              value={customUtilityExpertise}
              onChange={(e) => setCustomUtilityExpertise(e.target.value)}
              placeholder="Enter new expertise..."
              className="flex-1 bg-neutral-900/50 p-2 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-neutral-100 placeholder-neutral-500"
            />
            <button
              onClick={() => {
                if (!usedAllPoints && !doesHaveExpertise(customUtilityExpertise))
                  toggleExpertise({
                    name: customUtilityExpertise,
                    type: "utility",
                  });
              }}
              className={`right-0 absolute ${
                usedAllPoints || doesHaveExpertise(customUtilityExpertise)
                  ? "bg-neutral-500"
                  : "bg-primary-600 hover:bg-primary-500 cursor-pointer"
              }  px-4 py-2 rounded-lg rounded-l-none font-semibold text-white transition-colors`}
            >
              + Add
            </button>
          </div>

          {/* Description */}
          <div className="space-y-3 text-neutral-300 text-sm leading-relaxed">
            <p>
              <strong className="text-neutral-100">Utility expertises</strong> pertain to tools, trades, technical
              knowledge, and similar areas of study.
            </p>
            <p>
              If you have a utility expertise, you're practiced in an area of technical knowledge — such as creating a
              certain type of equipment or specializing in a discipline like military planning and strategy. You're
              skilled in specific techniques, specialized equipment, and technical jargon related to your field.
            </p>
            <p>
              <strong className="text-neutral-100">Examples:</strong> Animal Care, Armor Crafting, Engineering,
              Equipment Crafting, History, Military Strategy, Religion, Riding Horses, or Weapon Crafting.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
