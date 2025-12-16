"use client";

import { PathInfo } from "@/lib/data/paths";
import { useCharacter } from "@/services/CharacterProvider";
import { IoShieldOutline } from "react-icons/io5";
import { attributes as attributeInfo } from "@/lib/data/attributes";
import { Attribute } from "@/lib/generated/prisma/enums";
import { AttributeRow } from "./AttributeRow";
import { startTransition, useOptimistic } from "react";
import { updateAttribute } from "@/lib/actions/character";
import { calculateMaxAttributePoints } from "@/lib/utils/derivedStats";

export const SelectAttributes = () => {
  const character = useCharacter().character;
  const attributeData = attributeInfo.map((info) => {
    const { name, description } = info;
    const data = character.attributes.find((attr) => attr.attribute === info.attribute);
    return {
      name,
      description,
      attribute: data?.attribute ?? info.attribute,
      value: data?.value ?? 0,
    };
  });
  const [optimisticAttributes, setOptimisticAttributes] = useOptimistic(
    attributeData,
    (previous, next: { attribute: Attribute; value: number }) => {
      const newData = [];
      for (let i = 0; i < previous.length; i++) {
        if (previous[i].attribute !== next.attribute) newData.push(previous[i]);
        else {
          const { name, description, attribute } = previous[i];
          newData.push({
            name,
            description,
            attribute,
            value: next.value,
          });
        }
      }
      return newData;
    }
  );
  const attributes = {
    physical: optimisticAttributes.slice(0, 2),
    cognitive: optimisticAttributes.slice(2, 4),
    spiritual: optimisticAttributes.slice(4, 6),
  };
  const selectedPaths = character.paths.map((path) => path.path);
  const recommendedAttributes: Attribute[] = [];
  for (const selectedPath of selectedPaths) {
    recommendedAttributes.push(...PathInfo[selectedPath].recommendedAttributes);
  }
  const usedAllPoints =
    optimisticAttributes.map((attribute) => attribute.value).reduce((prev, curr) => prev + curr, 0) >=
    calculateMaxAttributePoints(character.level);
  return (
    <div className="flex flex-col gap-4">
      <h1>Choose Your Attributes</h1>
      {/* show more section on what attributes are */}
      <div>
        Every character has six attributes that determine their innate characteristics: Strength, Speed, Intellect,
        Willpower, Awareness, and Presence.
      </div>
      {/* grid for managing attribute values */}
      <div className="items-center grid grid-cols-12 px-2 rounded font-semibold text-lg">
        <div className="hidden lg:block">Type</div>
        <div className="col-span-8 md:col-span-7">Attribute</div>
        <div className="flex justify-center items-center col-span-2 md:col-span-2">Modifier</div>
        <div className="flex md:justify-center justify-end items-center col-span-2">
          <span className="hidden md:block">Defense</span>
          <span className="md:hidden">Def</span>
        </div>
      </div>
      {Object.entries(attributes).map(([category, attrs], index) => (
        <div className="grid grid-cols-12" key={index}>
          <div
            className="hidden md:flex justify-center items-center font-semibold text-xl text-center rotate-180 cursor-default capitalize"
            style={{ writingMode: "vertical-lr" }}
          >
            {category}
          </div>
          <div className="flex md:hidden flex-row justify-between col-span-12">
            <h2 className="capitalize">{category}</h2>
            <div className="relative w-10">
              <div className="absolute inset-0">
                <div className="flex justify-center items-center h-full text-center">
                  <IoShieldOutline size={120} />
                </div>
              </div>
              <div className="absolute inset-0">
                <div className="flex justify-center items-center h-full font-bold text-sm lg:text-xl text-center">
                  {attrs[0].value + attrs[1].value + 10}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            {attrs.map((attr, i) => (
              <AttributeRow
                key={i}
                attribute={attr}
                isRecommended={recommendedAttributes.includes(attr.attribute)}
                onUpdateAttribute={(attribute, value) => {
                  startTransition(() => setOptimisticAttributes({ attribute, value }));
                  updateAttribute(character.id, attribute, value);
                }}
                disableIncrement={usedAllPoints}
              />
            ))}
          </div>
          <div className="relative hidden md:block md:col-span-2">
            <div className="absolute inset-0">
              <div className="flex justify-center items-center h-full text-center">
                <IoShieldOutline size={120} />
              </div>
            </div>
            <div className="absolute inset-0">
              <div className="flex justify-center items-center h-full font-bold text-sm lg:text-xl text-center">
                {attrs[0].value + attrs[1].value + 10}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
