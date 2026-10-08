import { useAuth } from "@/app/hooks/use-auth";
import { createOrderApi } from "@/infrastructure/services/order-service";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CreateOrderPayload } from "@/core/types/order-types";

interface FinalizeOrderItem {
  dishId: number;
  dishName: string;
  foodImg?: string;
  price: number;
  sizeOption: {
    id: number;
    magnitude: string;
    measureUnit: string;
    abbreviation: string;
  };
  quantity: number;
}

export function FinalizeOrderPage() {
  const { token, restaurantId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasSubmitted = useRef(false);
  const [isProcessing, setIsProcessing] = useState(true);

  const { orderItems, orderClient, orderAdress } = location.state ?? {};
  const activeRestaurantId = restaurantId || "rest-mock-123";
  const activeToken = token || "mock-token";

  useEffect(() => {
    if (hasSubmitted.current) return;

    if (!orderItems || !orderClient || !orderAdress) {
      toast.error("Dados incompletos para finalizar o pedido.");
      navigate(`/${activeRestaurantId}`);
      return;
    }

    hasSubmitted.current = true;

    const payload: CreateOrderPayload = {
      dateTime: new Date().toISOString(),
      status: "PENDING",
      restaurantId: activeRestaurantId,
      orderItems: orderItems.map((item: FinalizeOrderItem) => ({
        dishSizeOptionId: item.sizeOption.id,
        quantity: item.quantity,
        dishName: item.dishName,
        foodImg: item.foodImg,
        price: item.price,
        sizeOption: item.sizeOption,
      })),
      orderAdress,
      orderClient,
    };

    createOrderApi(activeToken, payload)
      .then((res) => {
        toast.success(`Pedido #${res.orderId} criado com sucesso!`);
        navigate("/payment");
      })
      .catch((err) => {
        console.error("Erro ao criar pedido:", err);
        toast.error("Erro ao finalizar pedido. Tente novamente.");
        navigate(`/${activeRestaurantId}`);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }, [orderItems, orderClient, orderAdress, activeRestaurantId, activeToken, navigate]);

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center max-w-sm w-full space-y-4">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-gray-800">
          {isProcessing ? "Confirmando seu pedido..." : "Concluído!"}
        </h2>
        <p className="text-sm text-gray-500">
          Aguarde um instante enquanto registramos os dados no sistema.
        </p>
      </div>
    </section>
  );
}
