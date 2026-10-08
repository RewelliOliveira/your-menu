import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { ConfirmModal } from "@/app/components/ui/ConfirmModal";
import { SimpleSelect } from "@/app/components/ui/Select";
import { formatDate, formatCurrency } from "@/core/utils/utils";
import { OrderStatusLabel } from "@/core/types/order-types";

export interface OrderTicketProps {
  title: string;
  onConfirm: (selectedStatus: OrderStatusLabel) => void;
  onCancel: () => void;
  currentStatus: OrderStatusLabel;
  order: {
    id: number;
    customer: string;
    address: string;
    phone?: string;
    items: Array<{
      name: string;
      quantity: number;
      size: string;
      price: number;
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

const statusOptions: Array<{ value: OrderStatusLabel; label: string }> = [
  { value: "Solicitados", label: "Solicitado" },
  { value: "Em preparo", label: "Em preparo" },
  { value: "Em entrega", label: "Em entrega" },
  { value: "Entregue", label: "Entregue" },
  { value: "Cancelados", label: "Cancelado" },
];

export function OrderTicketModal({
  title,
  onConfirm,
  onCancel,
  currentStatus,
  order,
}: OrderTicketProps) {
  const [selected, setSelected] = useState<OrderStatusLabel>(currentStatus);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    content: "",
    confirmVariant: "primary" as "primary" | "danger",
    confirmAction: () => {},
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleConfirmClick() {
    if (selected === "Cancelados") {
      setModalConfig({
        title: "Confirmar cancelamento",
        content: `Tem certeza que deseja cancelar o pedido #${order.id}?`,
        confirmVariant: "danger",
        confirmAction: () => {
          onConfirm("Cancelados");
          setShowConfirmModal(false);
        },
      });
      setShowConfirmModal(true);
    } else if (selected === "Entregue") {
      setModalConfig({
        title: "Confirmar entrega",
        content: `Você confirma que o pedido #${order.id} foi finalizado e entregue com sucesso?`,
        confirmVariant: "primary",
        confirmAction: () => {
          onConfirm("Entregue");
          setShowConfirmModal(false);
        },
      });
      setShowConfirmModal(true);
    } else {
      onConfirm(selected);
    }
  }

  const total =
    order.subtotal - (order.discount ?? 0) + (order.deliveryFee ?? 0);

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        onClick={onCancel}
      >
        <div
          className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto space-y-5 text-gray-900 border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">{title}</h2>
            <span className="text-xs font-mono font-bold bg-gray-100 px-2.5 py-1 rounded-md text-gray-700">
              #{order.id}
            </span>
          </div>
          <div className="bg-amber-50/70 border border-amber-200/60 p-4 rounded-xl text-xs space-y-3 font-sans">
            <div className="flex justify-between font-bold text-gray-800 border-b border-amber-200/60 pb-2 text-sm">
              <span>Comanda de Pedido</span>
              <span>{order.dateTime ? formatDate(order.dateTime) : ""}</span>
            </div>

            <div>
              <p className="font-bold text-gray-800 mb-1">Itens do Pedido:</p>
              <div className="space-y-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-gray-700">
                    <span>
                      {item.quantity}x {item.name} ({item.size})
                    </span>
                    <span className="font-medium">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-amber-200/60 pt-2 space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount ? (
                <div className="flex justify-between text-green-700">
                  <span>Desconto:</span>
                  <span>- {formatCurrency(order.discount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-gray-600">
                <span>Taxa de entrega ({order.zone || "Zona"}):</span>
                <span>{formatCurrency(order.deliveryFee ?? 0)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-amber-200/60 text-sm">
                <span>Valor Total:</span>
                <span className="text-orange-600">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="border-t border-amber-200/60 pt-2 space-y-1 text-gray-700">
              <p>
                <span className="font-bold">Cliente:</span> {order.customer}
              </p>
              {order.phone && (
                <p>
                  <span className="font-bold">Telefone:</span> {order.phone}
                </p>
              )}
              <p>
                <span className="font-bold">Endereço:</span> {order.address}
                {order.complement ? `, ${order.complement}` : ""}
              </p>
              {order.reference && (
                <p>
                  <span className="font-bold">Referência:</span> {order.reference}
                </p>
              )}
              {order.observation && (
                <p className="italic text-amber-800">
                  <span className="font-bold not-italic">Obs:</span> {order.observation}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <SimpleSelect
              label="Atualizar Status do Pedido:"
              options={statusOptions}
              value={selected}
              onChange={(val) => setSelected(val as OrderStatusLabel)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button variant="secondary" size="sm" onClick={onCancel} type="button">
              Cancelar
            </Button>
            <Button size="sm" onClick={handleConfirmClick} type="button">
              Salvar Status
            </Button>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          title={modalConfig.title}
          content={modalConfig.content}
          buttonmsg="Confirmar"
          confirmVariant={modalConfig.confirmVariant}
          onConfirm={modalConfig.confirmAction}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
}
