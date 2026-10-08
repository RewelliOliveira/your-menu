import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export interface ConfirmModalProps {
  title: string;
  content: string;
  buttonmsg?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmVariant?: "primary" | "danger";
}

export function ConfirmModal({
  title,
  content,
  buttonmsg = "Confirmar",
  onConfirm,
  onCancel,
  confirmVariant = "primary",
}: ConfirmModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onMouseDown={onCancel}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4 relative text-gray-900 border border-gray-100"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          type="button"
          aria-label="Fechar"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <p className="text-base text-gray-600 leading-relaxed">{content}</p>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            onClick={onCancel}
            variant="secondary"
            size="sm"
            type="button"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            variant={confirmVariant === "danger" ? "danger" : "primary"}
            size="sm"
            type="button"
          >
            {buttonmsg}
          </Button>
        </div>
      </div>
    </div>
  );
}
