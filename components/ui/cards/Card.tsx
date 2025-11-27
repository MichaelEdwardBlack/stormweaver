import { cn } from "@/lib/utils/styles"; // optional, makes class merging cleaner

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  borderColor?: string;
};

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "bg-white/50 dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),rgba(0,0,0,0))] dark:bg-neutral-900/60 shadow-xl dark:shadow-[0_8px_24px_rgba(0,0,0,0.45),0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-xl p-6 rounded-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
