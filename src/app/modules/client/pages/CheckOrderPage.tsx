import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/Button";
import { OrderItemCard } from "../components/OrderItemCard";
import { formatCurrencySimple } from "@/core/utils/utils";

interface CheckoutOrderData {
  orderItems: Array<{
    id: number;
    dishName: string;
    foodImg?: string;
    sizeOption?: {
      magnitude?: string;
      abbreviation?: string;
    };
    quantity: number;
    price: number;
  }>;
  price: number;
}

export function CheckOrderPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const order: CheckoutOrderData | undefined = location.state?.item;

  if (!order || !order.orderItems || order.orderItems.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50 gap-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center max-w-md w-full space-y-4">
          <p className="text-gray-600 text-base">
            Nenhum item selecionado no pedido.
          </p>
          <Button type="button" size="full" onClick={() => navigate(-1)}>
            Voltar ao Cardápio
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
      <div className="flex flex-col w-full max-w-2xl p-6 md:p-8 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="border-b pb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Meu Pedido</h1>
          <p className="text-xs text-gray-500 mt-1">Confira os itens antes de prosseguir</p>
        </div>

        <div className="space-y-3">
          {order.orderItems.map((item) => (
            <OrderItemCard
              key={item.id}
              name={item.dishName}
              description={`${item.sizeOption?.magnitude ?? ""} ${
                item.sizeOption?.abbreviation ?? ""
              }`.trim()}
              price={item.price}
              quantity={item.quantity}
              imageUrl={item.foodImg ?? "/placeholder.svg"}
            />
          ))}
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
          <span className="text-base font-semibold text-gray-700">Subtotal dos itens:</span>
          <span className="text-xl font-bold text-orange-600">
            R$ {formatCurrencySimple(order.price)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            ← Voltar ao cardápio
          </Button>
          <Button
            type="button"
            onClick={() => navigate("/personal-data", { state: { order } })}
          >
            Continuar com Dados Pessoais →
          </Button>
        </div>
      </div>
    </section>
  );
}
