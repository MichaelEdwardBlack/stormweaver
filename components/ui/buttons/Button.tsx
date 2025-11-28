"use client";

import Spinner from "@/components/Spinner";
import { cn } from "@/lib/utils/styles";
import { motion, type MotionProps } from "framer-motion";

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonColor = "primary" | "accent" | "neutral" | "destructive";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps & {
    children: React.ReactNode;
    variant?: ButtonVariant;
    color?: ButtonColor;
    className?: string;
    pending?: boolean;
  };

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "solid",
  color = "primary",
  disabled,
  className,
  pending,
  ...rest
}) => {
  const base =
    "flex justify-center gap-1 px-4 py-2 rounded-lg font-medium transition-all select-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  // ===========================
  // COLOR MAPS
  // ===========================
  const solidMap: Record<ButtonColor, string> = {
    primary: `
      bg-gradient-to-r from-primary-600 to-primary-500 
      text-white 
      hover:from-primary-500 hover:to-primary-400
    `,
    accent: `
      bg-gradient-to-r from-accent-600 to-accent-500 
      text-white 
      hover:from-accent-500 hover:to-accent-400
    `,
    neutral: `
      bg-neutral-700 text-white hover:bg-neutral-600
      dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700
    `,
    destructive: `
      bg-gradient-to-r from-red-600 to-red-500
      text-white 
      hover:from-red-500 hover:to-red-400
    `,
  };

  const outlineMap: Record<ButtonColor, string> = {
    primary: `
      border border-primary-500 text-primary-500 
      hover:bg-primary-500/10
    `,
    accent: `
      border border-accent-500 text-accent-500 
      hover:bg-accent-500/10
    `,
    neutral: `
      border border-neutral-400 text-neutral-700 
      hover:bg-neutral-200/20
      dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700/30
    `,
    destructive: `
      border border-red-500 text-red-500 
      hover:bg-red-500/10
    `,
  };

  const ghostMap: Record<ButtonColor, string> = {
    primary: "text-primary-400 hover:bg-primary-400/10",
    accent: "text-accent-400 hover:bg-accent-400/10",
    neutral: `
      text-neutral-600 hover:bg-neutral-200/20
      dark:text-neutral-300 dark:hover:bg-neutral-700/30
    `,
    destructive: "text-red-500 hover:bg-red-500/10",
  };

  const variantStyles =
    variant === "solid" ? solidMap[color] : variant === "outline" ? outlineMap[color] : ghostMap[color];

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(base, variantStyles, className)}
      disabled={disabled}
      {...rest}
    >
      {children}
      {pending && <Spinner />}
    </motion.button>
  );
};
