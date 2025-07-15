import { ReactNode } from "react";

interface InputProps {
  placeholder?: string;
  label: ReactNode;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  placeholder,
  label,
  type = "text",
  value,
  onChange,
}: InputProps) {
  return (
    <div className="flex flex-col w-full gap-2 mb-4">
      <label className="text-sm font-semibold text-black">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all"
      />
    </div>
  );
}
