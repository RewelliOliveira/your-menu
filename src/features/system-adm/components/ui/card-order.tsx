import { Icon } from "@iconify/react";

export type Order = {
  id: number;
  customer: string;
  item: string;
  address: string;
  price: number;
  status: "Solicitados" | "Em preparo" | "Em entrega" | "Entregue";
};

type CardOrderProps = {
  order: Order;
};

export function CardOrder({ order }: CardOrderProps) {
  return (
    <div className="flex flex-col bg-white w-55 h-60 m-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] p-4">

      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-base">{order.customer}</h2>
        <span className="text-xs text-gray-400">#{order.id.toString().padStart(3, "0")}</span>
      </div>

      <p className="text-sm text-gray-700">
        <span className="font-semibold">Pedido:</span> {order.item}
      </p>
      <p className="text-sm text-gray-700 mt-1">
        <span className="font-semibold">Endereço:</span> {order.address}
      </p>

      <div className="flex justify-between items-end flex-1 mt-4">
        <p className="font-semibold text-sm">R$ {order.price.toFixed(2)}</p>
        <button
          onClick={() => console.log("Editar pedido")}
          type="button"
          aria-label="Editar pedido"
          className="group bg-white shadow-lg w-8 h-8 flex items-center justify-center transition-all duration-300 rounded hover:w-16 hover:bg-[#fe0000]/80"
        >
          <Icon
            icon="solar:pen-2-outline"
            className="w-5 h-5 text-gray-500 transition-colors duration-300 group-hover:text-white"
          />
        </button>
      </div>
    </div>
  );
}
