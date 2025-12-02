import { glossary } from "../data/glossary";

const glossaryKeys = Object.keys(glossary)
  .sort((a, b) => b.length - a.length) // longest first
  .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")); // escape regex chars

export const glossaryRegex = new RegExp(`\\b(${glossaryKeys.join("|")})\\b`, "gi");
