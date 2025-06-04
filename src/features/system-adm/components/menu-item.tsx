import { Icon } from "@iconify/react";

export type OrderProps = {
  name: string;
  description: string;
  price: string;
  foodImg: string;
};

export function MenuItem(order: OrderProps) {
  return (
    <div className="flex flex-col bg-white w-55 h-60 m-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <img
        src={order.foodImg || "placeholder.svg"}
        alt=""
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
            onClick={() => console.log("Abrir modal")}
            type="button"
            aria-label="Editar prato"
            className="group bg-white shadow-lg w-8 h-8 flex items-center justify-center transition-all duration-300 rounded hover:w-16 hover:bg-[#fe0000]/80"
          >
            <Icon
              icon="solar:pen-2-outline"
              className="w-5 h-5 text-gray-500 transition-colors duration-300 group-hover:text-white"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
