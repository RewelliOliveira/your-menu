interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: ButtonProps) {
  const baseClasses =
    "bg-orange-600 text-[#FFFFFF] w-4/5 sm:w-1/2 h-14 rounded-[10px] font-medium font-sans text-lg lg:h-11 lg:w-3/5 hover:bg-orange-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </button>
  );
}
