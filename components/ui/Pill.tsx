import * as React from "react";
import { cn } from "@/lib/utils/styles";

export type PillVariant = "primary" | "accent" | "neutral" | "outline";

const baseStyles = "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition-colors";

const variantStyles: Record<PillVariant, string> = {
  primary: "bg-primary-600 text-white border-primary-700",

  accent: "bg-accent-500 text-black border-accent-600",

  neutral: "bg-neutral-200 text-neutral-900 border-neutral-300",

  outline: "bg-transparent text-neutral-800 border-neutral-400 dark:text-neutral-200 dark:border-neutral-600",
};

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: PillVariant;
}

export function Pill({ className, variant = "neutral", ...props }: PillProps) {
  return <span className={cn(baseStyles, variantStyles[variant], className)} {...props} />;
}
