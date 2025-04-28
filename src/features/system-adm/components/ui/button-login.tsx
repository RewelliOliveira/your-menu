interface ButtonLoginProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function ButtonLogin({
  children,
  onClick,
  type = "button",
}: ButtonLoginProps) {
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
