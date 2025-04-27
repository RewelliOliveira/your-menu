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
      className="bg-[#FE3E00] text-white w-full sm:w-[330px] h-14 rounded-[10px] font-medium font-sans text-lg"
    >
      {children}
    </button>
  );
}
