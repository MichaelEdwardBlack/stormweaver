import { motion } from "framer-motion";
import { useState } from "react";

type ToggleSliderProps = {
  value: boolean;
  onToggle: (value: boolean) => void;
  onLabel?: string;
  offLabel?: string;
  onColor?: string;
  offColor?: string;
  className?: string;
};

export const ToggleSlider = ({
  value,
  onToggle,
  onLabel = "On",
  offLabel = "Off",
  onColor = "#22c55e", // green-500
  offColor = "#6b7280", // gray-500
  className = "",
}: ToggleSliderProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.button
      onClick={() => onToggle(!value)}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      className={`relative w-28 h-12 rounded-full flex items-center justify-center transition-colors duration-300 overflow-hidden cursor-pointer ${className} hover:opacity-90`}
      style={{
        backgroundColor: value ? onColor : offColor,
      }}
    >
      {/* Label text */}
      <motion.span
        key={value ? "on" : "off"}
        className={`${
          value ? "pr-8" : "pl-8"
        } absolute inset-0 flex justify-center items-center font-semibold text-white text-sm select-none`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {value ? onLabel : offLabel}
      </motion.span>

      {/* Thumb */}
      <motion.div
        className="absolute w-10 h-10 bg-white rounded-full shadow-md top-1 left-1"
        animate={{
          x: value ? "64px" : "0px", // clean distance to stay inside
          scale: isHovering ? 1.05 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 28,
        }}
      />
    </motion.button>
  );
};
