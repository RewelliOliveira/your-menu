import { useAuth } from "@/contexts/auth-context";
import { createOrderApi } from "@/services/ordersService";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface OrderCheckoutItem {
  sizeOption: {
    id: number;
  };
  quantity: number;
}

export function FinalizeOrder() {
  const { token, restaurantId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasPosted = useRef(false);

  const { orderItems, orderClient, orderAdress } = location.state ?? {};
  const activeRestaurantId = restaurantId || "rest-mock-123";
  const activeToken = token || "mock-token";

  useEffect(() => {
    if (hasPosted.current) return;
    hasPosted.current = true;
    if (
      !orderItems ||
      !orderClient ||
      !orderAdress
    ) {
      toast.error("Dados incompletos para finalizar pedido");
      return;
    }

    const payload = {
      dateTime: new Date().toISOString(),
      status: "PENDING" as const,
      restaurantId: activeRestaurantId,
      orderItems: orderItems.map((item: OrderCheckoutItem) => ({
        dishSizeOptionId: item.sizeOption.id,
        quantity: item.quantity,
      })),
      orderAdress,
      orderClient,
    };

    createOrderApi(activeToken, payload)
      .then((res) => {
        localStorage.removeItem("orderItems");
        localStorage.removeItem("orderClient");
        localStorage.removeItem("orderAdress");
        toast.success(`Pedido criado com sucesso! ID: ${res.orderId}`);
        navigate("/payment");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erro ao finalizar pedido");
        navigate(`/${activeRestaurantId}`);
      });
  }, [orderItems, orderClient, orderAdress, activeRestaurantId, activeToken, navigate]);

  return (
    <section className="flex items-center justify-center min-h-screen">
      <p>Finalizando pedido...</p>
    </section>
  );
}
