import { ReactNode } from "react";

interface InputProps {
  placeholder?: string;
  label: ReactNode;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  size?: "full" | "medium" | "small"; // nova prop
}

export function Input({
  placeholder,
  label,
  type = "text",
  value,
  onChange,
  error,
  disabled = false,
  size = "full", // padrão
}: InputProps) {
  const sizeClasses = {
    full: "w-full",
    medium: "w-3/4 sm:w-2/3",
    small: "w-1/2 sm:w-1/3",
  };

  return (
    <div className={`flex flex-col gap-2 mb-4 ${sizeClasses[size]}`}>
      <label className="text-sm font-semibold text-black">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && (
        <span className="text-xs text-red-500 mt-[-10px]">{error}</span>
      )}
    </div>
  );
}
