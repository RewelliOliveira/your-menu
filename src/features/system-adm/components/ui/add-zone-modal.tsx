import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./button";

interface AddZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (zone: string, valor: string) => void;
  editData?: { zone: string; valor: string };
}

export function AddZoneModal({ isOpen, onClose, onAdd, editData }: AddZoneModalProps) {
  const [zone, setZone] = useState("");
  const [valor, setValor] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (editData) {
        setZone(editData.zone);
        setValor(editData.valor);
      } else {
        setZone("");
        setValor("");
      }
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, editData]);

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
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onMouseDown={onClose}
    >
      <div
        className="bg-white p-6 rounded-md shadow-lg w-full max-w-md space-y-4"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">
          {editData ? "Editar zona" : "Adicionar nova zona"}
        </h2>
        <Input label="Local" value={zone} onChange={(e) => setZone(e.target.value)} />
        <Input label="Valor" value={valor} onChange={(e) => setValor(e.target.value)} />

        <div className="flex justify-end gap-2 mt-8 w-full">
          <div className="flex gap-2">
            <Button
              className="!bg-gray-300 !text-black px-3 py-1 text-sm w-auto"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              className="px-5 py-1 text-sm min-w-[110px]"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Salvando..." : editData ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
