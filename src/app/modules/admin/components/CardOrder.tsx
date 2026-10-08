import { useState } from "react";
import { Icon } from "@iconify/react";
import { OrderTicketModal } from "./OrderTicketModal";
import { ConfirmModal } from "@/app/components/ui/ConfirmModal";
import {
  getOrderByIdApi,
  updateOrderStatusApi,
} from "@/infrastructure/services/order-service";
import { useAuth } from "@/app/hooks/use-auth";
import { toast } from "react-toastify";
import { OrderEntity, OrderStatus, OrderStatusLabel } from "@/core/types/order-types";
import { formatCurrencySimple } from "@/core/utils/utils";

export interface CardOrderData {
  id: number;
  items: string[];
  address: string;
  price: number;
  status: OrderStatusLabel;
}

export interface CardOrderProps {
  order: CardOrderData;
  onStatusChange: (orderId: number, newStatus: OrderStatusLabel) => void;
}

const statusMapToApi: Record<OrderStatusLabel, OrderStatus> = {
  Solicitados: "PENDING",
  "Em preparo": "CONFIRMED",
  "Em entrega": "IN_DELIVERY",
  Entregue: "DELIVERED",
  Cancelados: "CANCELLED",
};

const apiStatusToLabel: Record<OrderStatus, OrderStatusLabel> = {
  PENDING: "Solicitados",
  CONFIRMED: "Em preparo",
  IN_DELIVERY: "Em entrega",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelados",
};

export function CardOrder({ order, onStatusChange }: CardOrderProps) {
  const [showAction, setShowAction] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [detailedOrder, setDetailedOrder] = useState<OrderEntity | null>(null);
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

  async function handleStatusChange(newStatus: OrderStatusLabel) {
    if (!token || !restaurantId) {
      toast.error("Credenciais inválidas. Faça login novamente.");
      return;
    }

    const apiStatus = statusMapToApi[newStatus];
    if (!apiStatus) {
      toast.error("Status inválido.");
      return;
    }

    try {
      await updateOrderStatusApi(restaurantId, order.id, apiStatus, token);
      setShowAction(false);
      toast.success(`Status atualizado para: ${newStatus}`);
      onStatusChange(order.id, newStatus);
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
      <div
        className="flex flex-col bg-white w-full max-w-[260px] h-64 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:scale-[1.02] p-4 cursor-pointer justify-between"
        onClick={openOrderDetails}
      >
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-base text-gray-900">
              #{order.id.toString().padStart(3, "0")}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-50 text-orange-700 border border-orange-200">
              {order.status}
            </span>
          </div>

          <p className="text-sm text-gray-700 line-clamp-2">
            <span className="font-semibold text-gray-900">Itens:</span> {firstItem}
            {extraItemsCount > 0 && (
              <span className="text-gray-500 font-normal">
                {" "}
                +{extraItemsCount} outro{extraItemsCount > 1 ? "s" : ""}
              </span>
            )}
          </p>

          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
            <span className="font-semibold text-gray-700">Endereço:</span> {order.address}
          </p>
        </div>

        <div className="flex justify-between items-end pt-3 border-t border-gray-100">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-bold">Total</span>
            <p className="font-bold text-base text-gray-900">
              R$ {formatCurrencySimple(order.price)}
            </p>
          </div>

          <div className="flex space-x-1.5">
            {order.status !== "Entregue" && order.status !== "Cancelados" && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openOrderDetails();
                  }}
                  type="button"
                  aria-label="Editar status do pedido"
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                  title="Editar pedido"
                >
                  <Icon icon="solar:pen-2-outline" className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmCancelOrder();
                  }}
                  type="button"
                  aria-label="Cancelar pedido"
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                  title="Cancelar pedido"
                >
                  <Icon icon="mdi:trash-can-outline" className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showAction && detailedOrder && (
        <OrderTicketModal
          title="Detalhes do Pedido"
          currentStatus={apiStatusToLabel[detailedOrder.status] || "Solicitados"}
          onCancel={() => setShowAction(false)}
          onConfirm={handleStatusChange}
          order={{
            id: detailedOrder.id,
            customer: `${detailedOrder.orderClient?.firstName ?? ""} ${
              detailedOrder.orderClient?.lastName ?? ""
            }`.trim(),
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
            observation: detailedOrder.note || "",
          }}
        />
      )}

      {showConfirmCancel && (
        <ConfirmModal
          title="Confirmar cancelamento"
          content={`Tem certeza que deseja cancelar o pedido #${order.id}?`}
          buttonmsg="Confirmar Cancelamento"
          confirmVariant="danger"
          onConfirm={cancelOrder}
          onCancel={() => setShowConfirmCancel(false)}
        />
      )}
    </>
  );
}
