import React from "react";
import { cn } from "@/core/utils/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "dark" | "outline" | "secondary" | "danger";
  size?: "sm" | "md" | "lg" | "full";
}

export function Button({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: "bg-orange-600 hover:bg-orange-500 text-white shadow-sm",
    dark: "bg-[#0A0F24] hover:bg-[#1a203d] text-white shadow-sm",
    outline: "bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-100",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-sm",
  };

  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5 text-base",
    lg: "h-14 px-8 text-lg",
    full: "w-full h-12 text-base",
  };

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={cn(
        "rounded-[10px] font-medium font-sans inline-flex items-center justify-center transition-colors cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
