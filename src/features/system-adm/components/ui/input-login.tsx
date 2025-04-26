import "./input-login.css";

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
    <div className="input-container">
      <label htmlFor="">{label}</label>
      <input
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
