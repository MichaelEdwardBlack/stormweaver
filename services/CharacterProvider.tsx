"use client";
import { FullCharacter } from "@/lib/actions/character";
import { createContext, useContext, useState, ReactNode } from "react";

type CharacterContextType = {
  character: FullCharacter;
};

const CharacterContext = createContext<CharacterContextType | null>(null);
export const useCharacter = () => {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error("useCharacter must be used inside CharacterProvider");
  return ctx;
};
export function CharacterProvider({ children, character }: { children: ReactNode; character: FullCharacter }) {
  return <CharacterContext.Provider value={{ character }}>{children}</CharacterContext.Provider>;
}
