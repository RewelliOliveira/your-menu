import { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export type OrderProps = {
  id: number | string;
  sizeOptions?: {
    id?: number;
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
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState<{
    id?: number;
    size: string;
    price: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleBuy = () => {
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (!selectedSize) {
      toast.error("Selecione um tamanho!");
      return;
    }

    const orderData = {
      orderItems: [
        {
          id: Number(new Date()),
          dishId: order.id,
          dishName: order.name,
          foodImg: order.foodImg,
          sizeOption: {
            id: selectedSize.id,
            magnitude: selectedSize.size,
          },
          quantity: 1,
          price: parseFloat(selectedSize.price),
        },
      ],
      price: parseFloat(selectedSize.price),
    };

    setShowModal(false);
    navigate("/check-order", { state: { item: orderData } });
  };

  return (
    <>
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
            <p className="font-semibold">R$ {order.price || "--,--"}</p>
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

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm border-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
          >
            <h2 className="text-xl font-semibold mb-4">{order.name}</h2>
            <p className="mb-4">{order.description}</p>

            <h3 className="font-medium mb-2">Escolha o tamanho:</h3>

            <div className="flex gap-2 flex-wrap mb-4">
              {order.sizeOptions && order.sizeOptions.length > 0 ? (
                order.sizeOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(opt)}
                    className={`px-4 py-2 border rounded-full transition-all duration-200 ${
                      selectedSize?.size === opt.size
                        ? "bg-green-600 text-white border-green-700"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {opt.size} - R$ {opt.price.replace(".", ",")}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">Nenhuma opção de tamanho disponível.</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                disabled={!selectedSize}
                onClick={handleConfirm}
                className={`px-4 py-2 rounded text-white ${
                  selectedSize
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
