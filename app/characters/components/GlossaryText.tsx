import { glossary } from "@/lib/data/glossary";
import { glossaryRegex } from "@/lib/utils/glossaryRegex";
import { useGlossary } from "@/store/glossary";

type GlossaryTextProps = {
  text: string;
};

export const GlossaryText = ({ text }: GlossaryTextProps) => {
  const { openEntry, selected } = useGlossary();
  const parts = text.split(glossaryRegex);

  return (
    <span>
      {parts.map((part, i) => {
        const key = part.toLowerCase();
        if (glossary[key] && !selected.includes(glossary[key])) {
          return (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                openEntry(key);
              }}
              className="glossary-link"
            >
              {part.replaceAll("_", "")}
            </button>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};
