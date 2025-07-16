import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getOrdersApi, OrderListItemResponse } from "@/services/ordersService";
import { Header } from "../components/header";
import { Banner } from "../components/ui/banner";
import { CardOrder, Order } from "../components/ui/card-order";
import { TabbedSections } from "../components/ui/tabbed-sections";
import { toast } from "react-toastify";

const apiStatusToStatusMap: Record<string, Order["status"]> = {
  PENDING: "Solicitados",
  CONFIRMED: "Em preparo",
  IN_DELIVERY: "Em entrega",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelados",
};

export function Orders() {
  const { token, restaurantId, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!token || !restaurantId) {
      toast.error("Credenciais inválidas. Faça login novamente.");
      return;
    }

    setLoadingOrders(true);

    getOrdersApi(restaurantId, token)
      .then((data: OrderListItemResponse[]) => {
        const ordersApi: Order[] = data.map((order) => ({
          id: order.orderId,
          items: order.orderItems.map(
            (item) => `${item.quantity}x ${item.dishName} (${item.sizeOption.abbreviation})`
          ),
          address: `${order.orderAdress.street}, ${order.orderAdress.number} - ${order.orderAdress.deliveryZone.zone}`,
          price: order.price,
          status: apiStatusToStatusMap[order.status] || "Solicitados",
        }));

        setOrders(ordersApi);
      })
      .catch(() => {
        toast.error("Erro ao carregar pedidos.");
        setOrders([]);
      })
      .finally(() => setLoadingOrders(false));
  }, [token, restaurantId]);

  function updateOrderStatusLocally(orderId: number, newStatus: Order["status"]) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  }

  if (isLoading || loadingOrders) {
    return <div>Carregando pedidos...</div>;
  }

  const entregues = orders.filter((order) => order.status === "Entregue");
  const total = entregues.reduce((acc, order) => acc + order.price, 0);

  return (
    <>
      <Header />
      <Banner />
      <TabbedSections
        title="Pedidos"
        getCategory={(order) => order.status}
        data={orders}
        renderItem={(order) => (
          <CardOrder order={order} onStatusChange={updateOrderStatusLocally} />
        )}
        categoriesOrder={[
          "Solicitados",
          "Em preparo",
          "Em entrega",
          "Entregue",
          "Cancelados",
        ]}
      />

      <footer className="pb-15">
        <div className="flex justify-between items-center bg-gray-100 p-4 border-t border-gray-300 fixed bottom-0 left-0 w-full z-50">
          <div>
            <p className="text-sm text-gray-600">Total de vendas hoje</p>
            <p className="text-lg font-semibold">
              R$ {total.toFixed(2)}{" "}
              <span className="text-sm font-normal text-gray-600">
                / {entregues.length} pedidos
              </span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
