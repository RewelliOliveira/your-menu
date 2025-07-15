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

  if (isLoading || loadingOrders) {
    return <div>Carregando pedidos...</div>;
  }

  return (
    <>
      <Header />
      <Banner />
      <TabbedSections
        title="Pedidos"
        getCategory={(order) => order.status}
        data={orders}
        renderItem={(order) => <CardOrder order={order} />}
        categoriesOrder={[
          "Solicitados",
          "Em preparo",
          "Em entrega",
          "Entregue",
          "Cancelados",
        ]}
      />
    </>
  );
}
