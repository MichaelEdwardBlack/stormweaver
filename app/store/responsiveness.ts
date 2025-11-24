import { create } from "zustand";

type ResponsivenessStore = {
  panel: "left" | "right" | "nav";
  isMobile: boolean;
  activeTab: string;
  setPanel: (panel: "left" | "right" | "nav") => void;
  setIsMobile: (isMobile: boolean) => void;
  setActiveTab: (activeTab: string) => void;
};

export const useResponsivenessStore = create<ResponsivenessStore>((set) => ({
  panel: "nav",
  isMobile: true,
  activeTab: "",
  setPanel: (panel: "left" | "right" | "nav") => set({ panel }),
  setIsMobile: (isMobile: boolean) => set({ isMobile }),
  setActiveTab: (activeTab: string) => set({ activeTab }),
}));
