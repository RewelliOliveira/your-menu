import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./button";

interface AddZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (zone: string, valor: string) => void;
}

export function AddZoneModal({ isOpen, onClose, onAdd }: AddZoneModalProps) {
  const [zone, setZone] = useState("");
  const [valor, setValor] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!zone || !valor) {
      alert("Preencha todos os campos");
      return;
    }

    if (saving) return;

    setSaving(true);
    await onAdd(zone, valor);
    setSaving(false);
    setZone("");
    setValor("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-md shadow-lg w-full max-w-md space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">Adicionar nova zona</h2>
        <Input label="Local" value={zone} onChange={(e) => setZone(e.target.value)} />
        <Input label="Valor" value={valor} onChange={(e) => setValor(e.target.value)} />

        <div className="flex justify-end gap-3">
          <Button
            className="!bg-gray-300 !text-black w-fit h-fit px-4 py-2"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            className="!bg-green-600 !hover:bg-green-500 text-white w-fit h-fit px-4 py-2"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Salvando..." : "Adicionar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
