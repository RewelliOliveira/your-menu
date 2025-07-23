import { useState } from "react";
import { Icon } from "@iconify/react";
import { OrderTicket } from "./order-ticket-modal";
import { ConfirmModal } from "./confirm-modal";
import {
  getOrderByIdApi,
  updateOrderStatusApi,
  OrderDetailResponse,
} from "@/services/ordersService";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "react-toastify";

export type Order = {
  id: number;
  items: string[];
  address: string;
  price: number;
  status:
    | "Solicitados"
    | "Em preparo"
    | "Em entrega"
    | "Entregue"
    | "Cancelados";
};

type CardOrderProps = {
  order: Order;
  onStatusChange: (orderId: number, newStatus: Order["status"]) => void;
};

const statusMap: Record<string, string> = {
  Solicitados: "PENDING",
  "Em preparo": "CONFIRMED",
  "Em entrega": "IN_DELIVERY",
  Entregue: "DELIVERED",
  Cancelados: "CANCELLED",
};

const apiStatusToPt: Record<string, string> = {
  PENDING: "Solicitados",
  CONFIRMED: "Em preparo",
  IN_DELIVERY: "Em entrega",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelados",
};

export function CardOrder({ order, onStatusChange }: CardOrderProps) {
  const [showAction, setShowAction] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [detailedOrder, setDetailedOrder] = useState<OrderDetailResponse | null>(null);
  const { token, restaurantId } = useAuth();

  async function openOrderDetails() {
    if (!token || !restaurantId) {
      toast.error("Credenciais inválidas. Faça login novamente.");
      return;
    }

    try {
      const response = await getOrderByIdApi(restaurantId, order.id, token);
      setDetailedOrder(response);
      setShowAction(true);
    } catch {
      toast.error("Erro ao carregar detalhes do pedido.");
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!token || !restaurantId) {
      toast.error("Credenciais inválidas. Faça login novamente.");
      return;
    }

    const apiStatus = statusMap[newStatus];
    if (!apiStatus) {
      toast.error("Status inválido.");
      return;
    }

    try {
      await updateOrderStatusApi(restaurantId, order.id, apiStatus, token);
      setShowAction(false);
      toast.success(`Status atualizado para: ${newStatus}`);
      onStatusChange(order.id, newStatus as Order["status"]);
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  }

  function confirmCancelOrder() {
    setShowConfirmCancel(true);
  }

  async function cancelOrder() {
    await handleStatusChange("Cancelados");
    setShowConfirmCancel(false);
  }

  const firstItem = order.items[0] || "";
  const extraItemsCount = order.items.length - 1;

  return (
    <>
      <div className="flex flex-col bg-white w-55 h-60 m-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-base">
            {`Pedido #${order.id.toString().padStart(3, "0")}`}
          </h2>
        </div>

        <p className="text-sm text-gray-700">
          <span className="font-semibold">Pedido:</span> {firstItem}
          {extraItemsCount > 0 && (
            <span>
              {" "}
              e mais {extraItemsCount} item{extraItemsCount > 1 ? "s" : ""}
            </span>
          )}
        </p>
        <p className="text-sm text-gray-700 mt-1">
          <span className="font-semibold">Endereço:</span> {order.address}
        </p>

        <div className="flex justify-between items-end flex-1 mt-4">
          <p className="font-semibold text-sm">R$ {order.price.toFixed(2)}</p>

          <div className="flex space-x-2">
            {order.status !== "Entregue" && order.status !== "Cancelados" && (
              <>
                <button
                  onClick={openOrderDetails}
                  type="button"
                  aria-label="Editar pedido"
                  className="group bg-white shadow-lg w-8 h-8 flex items-center justify-center transition-all duration-300 rounded hover:w-16 hover:bg-blue-600/80"
                >
                  <Icon
                    icon="solar:pen-2-outline"
                    className="w-5 h-5 text-gray-500 transition-colors duration-300 group-hover:text-white"
                  />
                </button>

                <button
                  onClick={confirmCancelOrder}
                  type="button"
                  aria-label="Cancelar pedido"
                  className="group bg-white shadow-lg w-8 h-8 flex items-center justify-center transition-all duration-300 rounded hover:w-16 hover:bg-[#fe0000]/80"
                >
                  <Icon
                    icon="mdi:trash-can-outline"
                    className="w-5 h-5 text-red-600 transition-colors duration-300 group-hover:text-white"
                  />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showAction && detailedOrder && (
        <OrderTicket
          title="Editar pedido"
          currentStatus={apiStatusToPt[detailedOrder.status] || "Solicitados"}
          onCancel={() => setShowAction(false)}
          onConfirm={handleStatusChange}
          order={{
            id: detailedOrder.id,
            customer: `${detailedOrder.orderClient?.firstName ?? ""} ${detailedOrder.orderClient?.lastName ?? ""}`.trim(),
            phone: String(detailedOrder.orderClient?.phone ?? ""),
            address: `${detailedOrder.orderAdress.street}, ${detailedOrder.orderAdress.number}`,
            cep: String(detailedOrder.orderAdress.cep),
            zone: detailedOrder.orderAdress.deliveryZone.zone,
            complement: detailedOrder.orderAdress.complement,
            reference: detailedOrder.orderAdress.reference,
            dateTime: detailedOrder.dateTime,
            items: detailedOrder.orderItems.map((item) => ({
              name: item.dishName,
              quantity: item.quantity,
              size: item.sizeOption.abbreviation,
              price: item.price,
            })),
            subtotal: detailedOrder.price,
            discount: 0,
            deliveryFee: detailedOrder.orderAdress.deliveryZone.deliveryFee,
            observation: "",
          }}
        />
      )}

      {showConfirmCancel && (
        <ConfirmModal
          title="Confirmar cancelamento"
          content={`Tem certeza que deseja cancelar o pedido #${order.id}?`}
          buttonmsg="Confirmar"
          onConfirm={cancelOrder}
          onCancel={() => setShowConfirmCancel(false)}
        />
      )}
    </>
  );
}
