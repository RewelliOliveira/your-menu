import { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { formatCurrencySimple } from "@/core/utils/utils";

export interface MenuItemClientSizeOption {
  id: number;
  size: string;
  price: string;
}

export interface MenuItemClientProps {
  id: number;
  name: string;
  description: string;
  price: string;
  foodImg: string;
  status: string;
  sizeOptions?: MenuItemClientSizeOption[];
}

export function MenuItemClient({
  id,
  name,
  description,
  price,
  foodImg,
  sizeOptions,
}: MenuItemClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState<MenuItemClientSizeOption | null>(null);
  const navigate = useNavigate();

  const handleBuy = () => {
    if (sizeOptions && sizeOptions.length === 1) {
      setSelectedSize(sizeOptions[0]);
    }
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (!selectedSize) {
      toast.warn("Selecione um tamanho antes de continuar!");
      return;
    }

    const orderData = {
      orderItems: [
        {
          id: Date.now(),
          dishId: id,
          dishName: name,
          foodImg: foodImg || "/placeholder.svg",
          sizeOption: {
            id: selectedSize.id,
            magnitude: selectedSize.size,
            measureUnit: "UN",
            abbreviation: selectedSize.size,
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
      <div className="flex flex-col bg-white w-full max-w-[240px] h-76 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:scale-[1.02] p-3 justify-between">
        <div className="w-full h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={foodImg || "/placeholder.svg"}
            alt={name || "Imagem do prato"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col flex-1 justify-between pt-2">
          <div>
            <h3 className="font-bold text-base text-gray-900 truncate">{name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-50">
            <div>
              <span className="text-[10px] text-gray-400 block uppercase">A partir de</span>
              <p className="font-bold text-sm text-gray-900">
                R$ {typeof price === "number" ? formatCurrencySimple(price) : price}
              </p>
            </div>

            <button
              onClick={handleBuy}
              type="button"
              aria-label={`Comprar ${name}`}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-orange-600 hover:bg-orange-500 text-white transition-colors cursor-pointer shadow-xs"
            >
              <Icon icon="mdi:cart-plus" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full relative space-y-4 border border-gray-100"
          >
            <button
              onClick={() => setShowModal(false)}
              type="button"
              aria-label="Fechar"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-gray-900">{name}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Escolha o tamanho:
              </span>

              <div className="flex gap-2 flex-wrap">
                {sizeOptions && sizeOptions.length > 0 ? (
                  sizeOptions.map((opt, idx) => {
                    const isSelected = selectedSize?.id === opt.id;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSize(opt)}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {opt.size} — R$ {opt.price.replace(".", ",")}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400">
                    Opção padrão única disponível.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!selectedSize}
                onClick={handleConfirm}
                className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                Adicionar ao Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
