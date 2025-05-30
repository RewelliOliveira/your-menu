interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export function Button({
  children,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  const baseClasses = "bg-orange-600 text-white w-4/5 sm:w-1/2 h-14 rounded-[10px] font-medium font-sans text-lg lg:h-11 lg:w-3/5";
  
  return (
    <button
      onClick={onClick}
      type={type}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </button>
  );
}