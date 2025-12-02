import { BsFastForwardFill } from "react-icons/bs";
import { FaFastForward, FaStar, FaInfinity, FaPlay } from "react-icons/fa";
import { IoPlayOutline } from "react-icons/io5";
import { GrUndo } from "react-icons/gr";
import { useGlossary } from "@/store/glossary";
import { ActionType } from "@/lib/data/tree";

type ActionCostIconProps = {
  actionCost?: ActionType;
};

export const ActionCostIcon = ({ actionCost }: ActionCostIconProps) => {
  const openEntry = useGlossary((state) => state.openEntry);
  const getIcon = () => {
    switch (actionCost) {
      case "1 Action":
        return <FaPlay />;
      case "2 Actions":
        return <BsFastForwardFill />;
      case "3 Actions":
        return <FaFastForward />;
      case "Free Action":
        return <IoPlayOutline />;
      case "Reaction":
        return <GrUndo />;
      case "Special Activation":
        return <FaStar />;
      case "Always Active":
        return <FaInfinity />;
      default:
        return null;
    }
  };

  if (!actionCost) return null;

  return (
    <span
      className="inline-flex items-center justify-center cursor-pointer hover:text-amber-500"
      title={actionCost}
      role="img"
      aria-label={`Action cost: ${actionCost}`}
      onClick={(e) => {
        e.stopPropagation;
        openEntry(actionCost);
      }}
    >
      {getIcon()}
    </span>
  );
};
