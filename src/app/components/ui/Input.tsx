import React, { ReactNode } from "react";
import { cn } from "@/core/utils/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  id,
  className,
  containerClassName,
  type = "text",
  disabled,
  ...props
}: InputProps) {
  const generatedId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={cn("flex flex-col w-full gap-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={generatedId}
          className="text-sm font-semibold text-gray-800 dark:text-gray-200 select-none"
        >
          {label}
        </label>
      )}
      <input
        id={generatedId}
        type={type}
        disabled={disabled}
        className={cn(
          "w-full px-3 py-2 text-sm md:text-base border rounded-md transition-all outline-none",
          "bg-white text-gray-900 placeholder:text-gray-400",
          "focus:ring-2 focus:ring-orange-600 focus:border-transparent",
          "disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed",
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}
