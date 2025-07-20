import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { ConfirmModal } from "./confirm-modal";
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
    items: Array<{
      name: string;
      quantity: number;
      size: string;
      price: number; // preço total do item (quantidade x preço unitário)
    }>;
    subtotal: number;
    discount?: number;
    observation?: string;
    dateTime?: string;
    cep?: string;
    complement?: string;
    reference?: string;
    zone?: string;
    deliveryFee?: number;
  };
}

const options = [
  { value: "Solicitados", label: "Solicitado" },
  { value: "Em preparo", label: "Em preparo" },
  { value: "Em entrega", label: "Em entrega" },
  { value: "Entregue", label: "Entregue" },
  { value: "Cancelados", label: "Cancelado" },
];

export const OrderTicket: React.FC<OrderTicketProps> = ({
  title,
  onConfirm,
  onCancel,
  currentStatus,
  order,
}) => {
  const [selected, setSelected] = useState(currentStatus);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const hideScrollbarStyle = {
    scrollbarWidth: "none" as const,
    msOverflowStyle: "none" as const,
  };

  function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function onConfirmClick() {
    if (selected === "Cancelados") {
      setShowConfirmModal(true);
    } else {
      onConfirm(selected);
    }
  }

  function confirmCancel() {
    onConfirm("Cancelados");
    setShowConfirmModal(false);
  }

  return (
    <>
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

            {order.dateTime && (
              <div>
                <p>
                  Data e hora:{" "}
                  <span className="font-medium">{formatDate(order.dateTime)}</span>
                </p>
              </div>
            )}

            <div className="pt-2">
              <p className="font-medium">Pedido:</p>
              {order.items.map((item, idx) => {
                const unitPrice = item.price / item.quantity;
                return (
                  <p key={idx}>
                    {item.quantity} x {item.name} ({item.size}) —{" "}
                    <span className="text-gray-500">R$ {unitPrice.toFixed(2)}</span>{" "}
                    <span> (R$ {item.price.toFixed(2)})</span>
                  </p>
                );
              })}
            </div>

            <div className="pt-2 border-t">
              <p>Subtotal: R$ {order.subtotal.toFixed(2)}</p>
              <p>Desconto: R$ {(order.discount ?? 0).toFixed(2)}</p>
              <p>Taxa de entrega: R$ {(order.deliveryFee ?? 0).toFixed(2)}</p>
              <p className="font-medium">
                Valor total:{" "}
                R$ {(order.subtotal - (order.discount ?? 0) + (order.deliveryFee ?? 0)).toFixed(2)}
              </p>
            </div>

            <div className="pt-2 border-t space-y-1">
              <p>
                <span className="font-medium">Cliente:</span> {order.customer}
              </p>
              {order.phone && (
                <p>
                  <span className="font-medium">Telefone:</span> {order.phone}
                </p>
              )}
              <p>
                <span className="font-medium">Endereço:</span> {order.address}
              </p>
              {order.cep && (
                <p>
                  <span className="font-medium">CEP:</span> {order.cep}
                </p>
              )}
              {order.zone && (
                <p>
                  <span className="font-medium">Zona:</span> {order.zone}
                </p>
              )}
              {order.complement && (
                <p>
                  <span className="font-medium">Complemento:</span> {order.complement}
                </p>
              )}
              {order.reference && (
                <p>
                  <span className="font-medium">Referência:</span> {order.reference}
                </p>
              )}
              {order.observation && (
                <p>
                  <span className="font-medium">Observação:</span> {order.observation}
                </p>
              )}
            </div>

            <p className="pt-2 text-center text-xs italic">
              Agradecemos sua preferência!
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
              <SelectContent side="top" className="z-[70]">
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
              onClick={onConfirmClick}
              type="button"
              className="!px-5 !py-1 !text-sm !w-[120px]"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          title="Confirmar cancelamento"
          content={`Tem certeza que deseja cancelar o pedido #${order.id}?`}
          buttonmsg="Confirmar"
          onConfirm={confirmCancel}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
};
