import { ReactNode } from "react";

interface SelectProps {
  label: ReactNode;
  options: { value: string; label: string }[];
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  disabled?: boolean;
  size?: "full" | "medium" | "small";
}

export function Select({
  label,
  options,
  placeholder = "Selecione uma opção",
  value,
  onChange,
  error,
  disabled = false,
  size = "full",
}: SelectProps) {
  const sizeClasses = {
    full: "w-full",
    medium: "w-3/4 sm:w-2/3",
    small: "w-1/2 sm:w-1/3",
  };

  return (
    <div className={`flex flex-col gap-2 mb-4 ${sizeClasses[size]}`}>
      <label className="text-sm font-semibold text-black">{label}</label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`px-3 py-2 border rounded-md text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs text-red-500 mt-[-10px]">{error}</span>
      )}
    </div>
  );
}
