import { Button } from "./button"; // Importe o componente Button
import type { Order } from "./card-order";

type OrderFooterProps = {
  orders: Order[];
  onVerMais: () => void;
};

export function OrderFooter({ orders, onVerMais }: OrderFooterProps) {
  const entregues = orders.filter((order) => order.status === "Entregue");
  const total = entregues.reduce((acc, order) => acc + order.price, 0);

  return (
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

      <Button
        onClick={onVerMais}
        type="button"
        className="!px-4 !py-2 !h-auto !w-1/5 !text-base"
      >
        Ver mais
      </Button>
    </div>
  );
}
