import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getOrderByIdApi,
  OrderDetailResponse,
} from "../../../services/ordersService";
import { Button } from "../components/ui/button";
import { Item } from "../components/ui/item";

export function CheckOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const restaurantId = localStorage.getItem("restaurantId") || "";
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrder() {
      try {
        const response = await getOrderByIdApi(
          restaurantId,
          Number(orderId),
          token
        );
        setOrder(response);
      } catch (error) {
        console.error("Erro ao buscar pedido", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, restaurantId, token]);

  return (
    <section className="flex flex-col items-center justify-center w-full min-h-screen px-4 py-8 bg-white">
      <div className="flex flex-col w-full max-w-3xl p-6 bg-[#f5f5f5] rounded-lg border border-gray-400 shadow-md">
        <div className="flex items-center justify-center w-full mb-4">
          <h1 className="text-2xl font-bold">Meu pedido</h1>
        </div>

        {loading ? (
          <p>Carregando pedido...</p>
        ) : order ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {order.orderItems.map((item) => (
                <Item
                  key={item.id}
                  name={item.dishName}
                  description={`${item.sizeOption.magnitude ?? ""} ${
                    item.sizeOption.abbreviation
                  }`}
                  price={item.price}
                  quantity={item.quantity}
                  imageUrl="/placeholder.png" // substitua se tiver a imagem real
                />
              ))}
            </div>

            <div className="flex justify-start m-4 gap-2">
              <p className="text-lg font-semibold">Total:</p>
              <p className="text-lg font-bold text-orange-600">
                R$ {order.price.toFixed(2)}
              </p>
            </div>

            <div className="flex justify-between m-4 gap-4">
              <Button type="button" variant="dark" onClick={() => navigate(-1)}>
                Voltar
              </Button>
              <Button type="button" onClick={() => navigate("/personal-data")}>
                Continuar
              </Button>
            </div>
          </>
        ) : (
          <p>Pedido não encontrado.</p>
        )}
      </div>
    </section>
  );
}
