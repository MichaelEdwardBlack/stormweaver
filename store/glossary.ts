import { glossary, GlossaryEntry } from "@/lib/data/glossary";
import { create } from "zustand";

type GlossaryStore = {
  selected: GlossaryEntry[];
  openEntry: (term: string) => void;
  close: () => void;
};

export const useGlossary = create<GlossaryStore>((set, get) => ({
  selected: [],
  openEntry: (term: string) => set({ selected: [...get().selected, glossary[term.toLowerCase()]] }),
  close: () => {
    const selected = get().selected;
    selected.pop();
    set({ selected });
  },
}));
