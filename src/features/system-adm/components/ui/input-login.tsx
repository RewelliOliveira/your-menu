interface InputLoginProps {
  placeholder?: string;
  label: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputLogin({
  placeholder,
  label,
  type = "text",
  value,
  onChange,
}: InputLoginProps) {
  return (
    <div className="flex flex-col items-center justify-center mb-5 w-full">
      <div className="w-full flex flex-col">
        <label className="text-black font-bold text-left block mb-2">
          {label}
        </label>
        <input
          className="border border-gray-400 rounded-md p-2 focus:outline-none focus:border-orange-600 w-full"
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}