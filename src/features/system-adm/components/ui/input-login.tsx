interface InputLoginProps {
  placeholder: string;
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
    <div className="flex flex-col">
      <label htmlFor="" className="text-black font-bold block mb-1">
        {label}
      </label>
      <input
        className="w-80 border border-gray-400 rounded-md p-2 focus:outline-none focus:border-orange-600"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
