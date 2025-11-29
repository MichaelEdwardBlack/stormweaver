"use client";
import { ExpandableCard } from "@/components/ui/cards/ExpandableCard";
import { toggleOriginCulture } from "@/lib/actions/character";
import { CulturalInfo } from "@/lib/data/culture";
import { startTransition, useOptimistic } from "react";

type Props = {
  characterId: string;
  selectedCultures: string[];
};
export const CulturePicker = ({ characterId, selectedCultures }: Props) => {
  const [optimisticCultures, setOptimisticCultures] = useOptimistic(
    selectedCultures,
    (currentState: string[], cultureName: string) => {
      if (currentState.includes(cultureName)) {
        return currentState.filter((c) => c !== cultureName);
      } else {
        return [...currentState, cultureName];
      }
    }
  );
  const isDisabled = optimisticCultures.length >= 2;

  const select = async (cultureName: string) => {
    if (isDisabled && !optimisticCultures.includes(cultureName)) return;
    startTransition(() => setOptimisticCultures(cultureName));
    await toggleOriginCulture(characterId, cultureName);
  };
  return (
    <>
      {CulturalInfo.map((info) => (
        <ExpandableCard
          key={info.name}
          title={info.name}
          description={info.description}
          action={() => select(info.name)}
          actionLabel={optimisticCultures.includes(info.name) ? "Selected" : "Select"}
          className={optimisticCultures.includes(info.name) ? "border-2 border-accent-500" : ""}
          actionClassName={
            optimisticCultures.includes(info.name)
              ? "bg-accent-400 dark:bg-accent-600"
              : isDisabled
              ? "bg-deutral-200 dark:bg-neutral-800 opacity-50 cursor-not-allowed"
              : ""
          }
        >
          <div className="flex flex-col gap-3">
            {info.descriptions.map((desc, idx) => (
              <p key={idx}>{desc}</p>
            ))}
            <div className="my-4 text-2xl font-bold">{info.name} Names</div>
            <p>{info.names.join(", ")}</p>
            <div className="my-4 text-2xl font-bold">{info.name} Expertise</div>
            <p>{info.expertise}</p>
          </div>
        </ExpandableCard>
      ))}
    </>
  );
};
