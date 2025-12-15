import { motion } from "framer-motion";

export function Spinner({ size = 24, thickness = 3 }) {
  const radius = size / 2 - thickness;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center justify-center">
      <motion.svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="animate-spin">
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          className="stroke-current"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * 0.25 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        />
      </motion.svg>
    </div>
  );
}
