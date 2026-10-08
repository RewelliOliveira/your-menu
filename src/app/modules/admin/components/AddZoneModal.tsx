import { useEffect, useState, ChangeEvent } from "react";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { toast } from "react-toastify";
import { parseCurrencyInput, parseCurrencyToNumber } from "@/core/utils/utils";

export interface AddZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (zone: string, valor: string) => Promise<void> | void;
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
        setValor(parseCurrencyInput(editData.valor.replace(".", "")));
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

  const handleChangeValor = (e: ChangeEvent<HTMLInputElement>) => {
    setValor(parseCurrencyInput(e.target.value));
  };

  const handleSubmit = async () => {
    if (!zone.trim() || !valor.trim()) {
      toast.warn("Preencha todos os campos da zona de entrega.");
      return;
    }

    if (saving) return;

    try {
      setSaving(true);
      const numericVal = parseCurrencyToNumber(valor).toFixed(2);
      await onAdd(zone.trim(), numericVal);
      onClose();
    } catch {
      toast.error("Erro ao salvar zona.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onMouseDown={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4 border border-gray-100"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-900">
          {editData ? "Editar zona de entrega" : "Adicionar nova zona"}
        </h2>

        <Input
          label="Bairro / Região *"
          placeholder="Ex: Centro"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
        />

        <Input
          label="Taxa de Entrega (R$) *"
          value={valor}
          onChange={handleChangeValor}
          placeholder="0,00"
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Salvando..." : editData ? "Salvar" : "Adicionar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
