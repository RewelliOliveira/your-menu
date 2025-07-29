import { useAuth } from "@/contexts/auth-context";
import { createOrderApi } from "@/services/ordersService";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function FinalizeOrder() {
  const { token, restaurantId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasPosted = useRef(false);

  const { orderItems, orderClient, orderAdress } = location.state ?? {};

  useEffect(() => {
    if (hasPosted.current) return;
    hasPosted.current = true;
    if (
      !orderItems ||
      !orderClient ||
      !orderAdress ||
      !restaurantId ||
      !token
    ) {
      toast.error("Dados incompletos para finalizar pedido");
      return;
    }

    const payload = {
      dateTime: new Date().toISOString(),
      status: "PENDING" as const,
      restaurantId,
      orderItems: orderItems.map((item: any) => ({
        dishSizeOptionId: item.sizeOption.id,
        quantity: item.quantity,
      })),
      orderAdress,
      orderClient,
    };

    createOrderApi(token, payload)
      .then((res) => {
        localStorage.removeItem("orderItems");
        localStorage.removeItem("orderClient");
        localStorage.removeItem("orderAdress");
        toast.success(`Pedido criado com sucesso! ID: ${res.orderId}`);
        navigate("/payment");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Número ou CEP inválidos");
        navigate(`/${restaurantId}`);
      });
  }, [orderItems, orderClient, orderAdress, restaurantId, token]);

  return (
    <section className="flex items-center justify-center min-h-screen">
      <p>Finalizando pedido...</p>
    </section>
  );
}
