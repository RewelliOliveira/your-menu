import React from "react";

interface LongButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function LongButton({
  children,
  onClick,
  type = "button",
}: LongButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className="
        bg-[#FE3E00] text-white
        w-full max-w-[500px]
        py-[10px] rounded-lg
        font-semibold
        text-bm
        mx-auto
      "
    >
      {children}
    </button>
  );
}