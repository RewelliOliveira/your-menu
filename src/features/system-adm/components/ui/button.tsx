interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className="bg-orange-600 text-white w-4/5 sm:w-1/2 h-14 rounded-[10px] font-medium font-sans text-lg"
    >
      {children}
    </button>
  );
}
