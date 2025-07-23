import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getOrdersApi} from "@/services/ordersService";
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
  const scrollPositionRef = useRef(0);

  const fetchOrders = useCallback(async () => {
    if (!token || !restaurantId) {
      toast.error("Credenciais inválidas. Faça login novamente.");
      return;
    }

    try {

      scrollPositionRef.current = window.scrollY;
      
      const data = await getOrdersApi(restaurantId, token);
      
      setOrders(prevOrders => {
        const newOrdersMap = new Map<number, Order>();
        
        prevOrders.forEach(order => newOrdersMap.set(order.id, order));
        

        data.forEach(apiOrder => {
          const status = apiStatusToStatusMap[apiOrder.status] || "Solicitados";
          const existingOrder = newOrdersMap.get(apiOrder.orderId);
          
          if (existingOrder) {
            if (existingOrder.status !== status) {
              newOrdersMap.set(apiOrder.orderId, {
                ...existingOrder,
                status
              });
            }
          } else {
            newOrdersMap.set(apiOrder.orderId, {
              id: apiOrder.orderId,
              items: apiOrder.orderItems.map(
                item => `${item.quantity}x ${item.dishName} (${item.sizeOption.abbreviation})`
              ),
              address: `${apiOrder.orderAdress.street}, ${apiOrder.orderAdress.number} - ${apiOrder.orderAdress.deliveryZone.zone}`,
              price: apiOrder.price,
              status,
            });
          }
        });
        
        return Array.from(newOrdersMap.values());
      });

    } catch {
      toast.error("Erro ao carregar pedidos.");
    } finally {
      setLoadingOrders(false);
    }
  }, [token, restaurantId]);

  useEffect(() => {
    if (scrollPositionRef.current > 0) {
      window.scrollTo(0, scrollPositionRef.current);
    }
  }, [orders]);

  useEffect(() => {
    if (!token || !restaurantId) return;


    setLoadingOrders(true);
    fetchOrders();

    const intervalId = setInterval(fetchOrders, 5000);
    
    return () => clearInterval(intervalId);
  }, [fetchOrders, token, restaurantId]);

  const updateOrderStatusLocally = useCallback((orderId: number, newStatus: Order["status"]) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  }, []);

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