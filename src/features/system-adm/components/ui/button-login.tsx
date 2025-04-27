interface ButtonLoginProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function ButtonLogin({ children, onClick, type = "button" }: ButtonLoginProps) {
    return (
        <button onClick={onClick} type={type} className="bg-[#FE3E00] text-white w-[330px] h-[54px] rounded-[10px] font-medium font-sans text-lg">
            {children}
        </button>
    );
}
