interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "dark";
}

export function Button({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  const variantClasses = {
    primary: "bg-orange-600 hover:bg-orange-500",
    dark: "bg-[#0A0F24] hover:bg-[#1a203d]",
  };

  const baseClasses =
    "text-[#FFFFFF] w-4/5 sm:w-1/2 h-14 rounded-[10px] font-medium font-sans text-lg lg:h-11 lg:w-2/5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${variantClasses[variant]} ${baseClasses} ${className}`}
    >
      {children}
    </button>
  );
}
