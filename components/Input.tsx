import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errors?: string[];
}

export const Input = ({ label, helperText, errors, className, ...props }: InputProps) => {
  const hasError = errors && errors.length > 0;
  return (
    <div className={clsx("flex flex-col", className)}>
      {label && <label className="mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-200">{label}</label>}
      <input
        {...props}
        className={`bg-neutral-100/50 dark:bg-neutral-900/50 px-3 py-2 border border-neutral-300/40 dark:border-neutral-700/40 rounded-md focus:outline-none focus:ring-2 transition
          ${
            hasError
              ? "invalid:border-red-500 invalid:focus:ring-red-500"
              : "focus:ring-primary-500 dark:focus:ring-primary-400"
          }`}
      />
      {helperText && !hasError && (
        <span className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{helperText}</span>
      )}
      {hasError &&
        errors.map((error, i) => (
          <span key={i} className="mt-1 text-xs text-red-500">
            {error}
          </span>
        ))}
    </div>
  );
};
