import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/hooks/use-auth";
import { getOrdersApi } from "@/infrastructure/services/order-service";
import { Header } from "@/app/components/layout/Header";
import { Banner } from "@/app/components/layout/Banner";
import { CardOrder, CardOrderData } from "../components/CardOrder";
import { TabbedSections } from "@/app/components/layout/TabbedSections";
import { toast } from "react-toastify";
import { OrderStatus, OrderStatusLabel } from "@/core/types/order-types";
import { formatCurrencySimple } from "@/core/utils/utils";

const apiStatusToStatusMap: Record<OrderStatus, OrderStatusLabel> = {
  PENDING: "Solicitados",
  CONFIRMED: "Em preparo",
  IN_DELIVERY: "Em entrega",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelados",
};

export function OrdersPage() {
  const { token, restaurantId, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<CardOrderData[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!token || !restaurantId) return;

    try {
      const data = await getOrdersApi(restaurantId, token);
      setOrders(
        data.map((apiOrder) => ({
          id: apiOrder.id,
          items: apiOrder.orderItems.map(
            (item) =>
              `${item.quantity}x ${item.dishName} (${item.sizeOption.abbreviation})`
          ),
          address: `${apiOrder.orderAdress.street}, ${apiOrder.orderAdress.number} - ${apiOrder.orderAdress.deliveryZone.zone}`,
          price: apiOrder.price,
          status: apiStatusToStatusMap[apiOrder.status] || "Solicitados",
        }))
      );
    } catch {
      toast.error("Erro ao carregar pedidos.");
    } finally {
      setLoadingOrders(false);
    }
  }, [token, restaurantId]);

  useEffect(() => {
    if (!token || !restaurantId) return;

    setLoadingOrders(true);
    fetchOrders();

    const intervalId = setInterval(fetchOrders, 8000);
    return () => clearInterval(intervalId);
  }, [fetchOrders, token, restaurantId]);

  const updateOrderStatusLocally = useCallback(
    (orderId: number, newStatus: OrderStatusLabel) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    },
    []
  );

  if (authLoading || (loadingOrders && orders.length === 0)) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f5f5f5]">
        <div className="text-base font-medium text-gray-600">Carregando pedidos...</div>
      </div>
    );
  }

  const entregues = orders.filter((order) => order.status === "Entregue");
  const total = entregues.reduce((acc, order) => acc + order.price, 0);

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24">
      <Header isAdmin={true} />
      <Banner isAdmin={true} />

      <TabbedSections
        title="Painel de Pedidos"
        getCategory={(order) => order.status}
        data={orders}
        renderItem={(order) => (
          <CardOrder
            key={`${order.id}-${order.status}`}
            order={order}
            onStatusChange={updateOrderStatusLocally}
          />
        )}
        categoriesOrder={[
          "Solicitados",
          "Em preparo",
          "Em entrega",
          "Entregue",
          "Cancelados",
        ]}
      />

      <footer className="fixed bottom-0 left-0 w-full z-40 bg-white border-t border-gray-200 px-6 py-4 shadow-lg flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 font-medium">Total de vendas hoje</p>
          <p className="text-xl font-bold text-gray-900">
            R$ {formatCurrencySimple(total)}{" "}
            <span className="text-xs font-normal text-gray-500">
              ({entregues.length} pedidos entregues)
            </span>
          </p>
        </div>

        <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold border border-green-200">
          Atualizado em tempo real
        </span>
      </footer>
    </div>
  );
}
