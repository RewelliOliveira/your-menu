import { Icon } from "@iconify/react";

export type OrderProps = {
  id: number | string;
  sizeOptions?: {
    size: string;
    price: string;
  }[];
  name: string;
  description: string;
  price: string;
  foodImg: string;
  status: string;
};

export function MenuItem(order: OrderProps) {
  const handleBuy = () => {
    console.log("Abrir modal de compra");
  };

  return (
    <div className="flex flex-col bg-white w-55 h-60 m-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <img
        src={order.foodImg || "placeholder.svg"}
        alt={order.name || "Imagem do prato"}
        className="w-full h-24 object-cover rounded-t-lg"
      />

      <div className="p-3 flex flex-col flex-1">
        <h2 className="font-bold text-base">{order.name || "Nome do prato"}</h2>
        <p className="text-xs text-gray-500 break-words overflow-hidden">
          {order.description || "Descrição do prato"}
        </p>
        <div className="flex justify-between items-end flex-1 mt-2">
          <p className="font-semibold">R${order.price || " --,--"}</p>
          <button
            onClick={handleBuy}
            type="button"
            aria-label="Comprar prato"
            className="group bg-white shadow-lg w-8 h-8 flex items-center justify-center transition-all duration-300 rounded hover:w-16 hover:bg-green-600"
          >
            <Icon
              icon="mdi:cart"
              className="w-5 h-5 text-green-600 transition-colors duration-300 group-hover:text-white"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
