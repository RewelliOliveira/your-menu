import { useLocation, useNavigate } from "react-router-dom";
import { OrderDetailResponse } from "../../../services/ordersService";
import { Button } from "../components/ui/button";
import { Item } from "../components/ui/item";

export function CheckOrder() {
  const navigate = useNavigate();
  const location = useLocation();

  const order: OrderDetailResponse | undefined = location.state?.item;

  if (!order) {
    return (
      <section className="flex flex-col items-center justify-center w-full min-h-screen px-4 py-8 bg-white">
        <p>Pedido não encontrado.</p>
        <Button type="button" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </section>
    );
  }

  console.log(order.orderItems);
  return (
    <section className="flex flex-col items-center justify-center w-full min-h-screen px-4 py-8 bg-white">
      <div className="flex flex-col w-full max-w-3xl p-6 bg-[#f5f5f5] rounded-lg border border-gray-400 shadow-md">
        <div className="flex items-center justify-center w-full mb-4">
          <h1 className="text-2xl font-bold">Meu pedido</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {order.orderItems.map((item) => (
            <Item
              key={item.id}
              name={item.dishName}
              description={`${item.sizeOption?.magnitude ?? ""} ${
                item.sizeOption?.abbreviation ?? ""
              }`}
              price={item.price}
              quantity={item.quantity}
              imageUrl={item.foodImg ?? "placeholder.svg"}
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
          <Button
            type="button"
            onClick={() => navigate("/personal-data", { state: { order } })}
          >
            Continuar
          </Button>
        </div>
      </div>
    </section>
  );
}
