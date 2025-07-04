import { useState } from "react";
import { Icon } from "@iconify/react";
import { ConfirmModal } from "./confirm-modal";
import { OrderTicket } from "./order-ticket-modal";

export type Order = {
  id: number;
  customer: string;
  items: string[]; // lista de itens agora
  address: string;
  price: number;
  status: "Solicitados" | "Em preparo" | "Em entrega" | "Entregue";
};

type CardOrderProps = {
  order: Order;
};

export function CardOrder({ order }: CardOrderProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAction, setShowAction] = useState(false);

  function handleDelete() {
    console.log(`Pedido ${order.id} deletado`);
    setShowConfirm(false);
  }

  function handleStatusChange(newStatus: string) {
    console.log(`Pedido ${order.id} atualizado para: ${newStatus}`);
    setShowAction(false);
  }

  // Mostra o primeiro item e se tiver mais, indica quantos itens a mais tem
  const firstItem = order.items[0] || "";
  const extraItemsCount = order.items.length - 1;

  return (
    <>
      <div className="flex flex-col bg-white w-55 h-60 m-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-base">{order.customer}</h2>
          <span className="text-xs text-gray-400">
            #{order.id.toString().padStart(3, "0")}
          </span>
        </div>

        <p className="text-sm text-gray-700">
          <span className="font-semibold">Pedido:</span> {firstItem}
          {extraItemsCount > 0 && (
            <span> e mais {extraItemsCount} item{extraItemsCount > 1 ? 's' : ''}</span>
          )}
        </p>
        <p className="text-sm text-gray-700 mt-1">
          <span className="font-semibold">Endereço:</span> {order.address}
        </p>

        <div className="flex justify-between items-end flex-1 mt-4">
          <p className="font-semibold text-sm">R$ {order.price.toFixed(2)}</p>

          <div className="flex space-x-2">
            {order.status !== "Entregue" && (
              <button
                onClick={() => setShowAction(true)}
                type="button"
                aria-label="Editar pedido"
                className="group bg-white shadow-lg w-8 h-8 flex items-center justify-center transition-all duration-300 rounded hover:w-16 hover:bg-blue-600/80"
              >
                <Icon
                  icon="solar:pen-2-outline"
                  className="w-5 h-5 text-gray-500 transition-colors duration-300 group-hover:text-white"
                />
              </button>
            )}

            <button
              onClick={() => setShowConfirm(true)}
              type="button"
              aria-label="Deletar pedido"
              className="group bg-white shadow-lg w-8 h-8 flex items-center justify-center transition-all duration-300 rounded hover:w-16 hover:bg-[#fe0000]/80"
            >
              <Icon
                icon="mdi:trash-can-outline"
                className="w-5 h-5 text-red-600 transition-colors duration-300 group-hover:text-white"
              />
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Confirmar exclusão"
          content={`Tem certeza que deseja deletar o pedido #${order.id}?`}
          buttonmsg="Deletar"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showAction && (
        <OrderTicket
          title="Editar pedido"
          currentStatus={order.status}
          onCancel={() => setShowAction(false)}
          onConfirm={(status) => {
            handleStatusChange(status);
            setShowAction(false);
          }}
          order={{
            id: order.id,
            customer: order.customer,
            address: order.address,
            items: order.items,
            subtotal: order.price,
            discount: 0,
          }}
        />
      )}
    </>
  );
}
