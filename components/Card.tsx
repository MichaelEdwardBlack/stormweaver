import clsx from "clsx"; // optional, makes class merging cleaner

interface CardProps {
  children: React.ReactNode;
  className?: string; // allow extra classes
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={clsx(
        "bg-white/10 dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),rgba(0,0,0,0))] dark:bg-neutral-900/60 shadow-xl dark:shadow-[0_8px_24px_rgba(0,0,0,0.45),0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-md p-6 border border-white/10 dark:border-neutral-700/40 rounded-xl",
        className
      )}
    >
      {children}
    </div>
  );
};
