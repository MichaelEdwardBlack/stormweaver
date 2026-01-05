import { create } from "zustand";

type ColorStore = {
  diceColor: string;
  diceText: string;
  setDiceColor: (color: string) => void;
  setDiceText: (color: string) => void;
};
export const useColors = create<ColorStore>((set) => ({
  diceColor: "#FFD700",
  diceText: "black",
  setDiceColor: (color: string) => set({ diceColor: color }),
  setDiceText: (color: string) => set({ diceText: color }),
}));
