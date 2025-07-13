import React, { useEffect, useState } from "react";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderTicketProps {
  title: string;
  onConfirm: (selectedStatus: string) => void;
  onCancel: () => void;
  currentStatus: string;
  order: {
    id: number;
    customer: string;
    address: string;
    phone?: string;
    items: string[];
    subtotal: number;
    discount?: number;
    observation?: string;
  };
}

const options = [
  { value: "Solicitados", label: "Solicitado" },
  { value: "Em preparo", label: "Em preparo" },
  { value: "Em entrega", label: "Em entrega" },
  { value: "Entregue", label: "Entregue" },
];

export const OrderTicket: React.FC<OrderTicketProps> = ({
  title,
  onConfirm,
  onCancel,
  currentStatus,
  order,
}) => {
  const [selected, setSelected] = useState(currentStatus);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // CSS para esconder scrollbar mas permitir scroll
  const hideScrollbarStyle = {
    scrollbarWidth: "none" as const, // Firefox
    msOverflowStyle: "none" as const, // IE 10+
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center"
      onClick={onCancel}
    >
      <div
        className="
          bg-white p-6 rounded-md shadow-lg w-full max-w-md
          max-h-[80vh] overflow-y-auto
          space-y-4 relative text-black
        "
        style={hideScrollbarStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Para Webkit (Chrome, Safari, Edge) esconder scrollbar via style tag */}
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <h2 className="text-xl font-semibold">{title}</h2>

        <div className="bg-[#f6edd9] p-4 rounded space-y-1 text-sm text-black border">
          <div className="flex justify-between border-b pb-1 font-medium">
            <span>Comanda</span>
            <span>#{order.id}</span>
          </div>

          <div>
            <p>Data: <span className="font-medium">17/05/2025</span></p>
            <p>Horário: <span className="font-medium">20:14</span></p>
          </div>

          <div className="pt-2">
            <p className="font-medium">Pedido:</p>
            {order.items.map((item, idx) => (
              <p key={idx}>- {item}</p>
            ))}
          </div>

          {order.observation && (
            <div className="pt-2">
              <p className="font-medium">Observação:</p>
              <p>{order.observation}</p>
            </div>
          )}

          <div className="pt-2 border-t">
            <p>Subtotal: R$ {order.subtotal.toFixed(2)}</p>
            <p>Desconto: R$ {(order.discount ?? 0).toFixed(2)}</p>
            <p className="font-medium">
              Valor total: R$ {(order.subtotal - (order.discount ?? 0)).toFixed(2)}
            </p>
          </div>

          <div className="pt-2 border-t">
            <p>Cliente: {order.customer}</p>
            <p>Endereço: {order.address}</p>
            {order.phone && <p>Telefone: {order.phone}</p>}
          </div>

          <p className="pt-2 text-center text-xs italic">
            O restaurante agradece sua preferência!
          </p>
        </div>

        <div className="space-y-2 mt-4">
          <label htmlFor="status-select" className="block font-medium text-sm">
            Novo status:
          </label>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger id="status-select">
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent className="z-[70]">
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <Button
            onClick={onCancel}
            className="!bg-gray-300 !text-black !px-3 !py-1 !text-sm !w-[90px]"
            type="button"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => onConfirm(selected)}
            type="button"
            className="!px-5 !py-1 !text-sm !w-[120px]"
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};
