import { X } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

export interface ProductModalData {
  name: string;
  description: string;
  foodImg?: string;
  sizeOptions?: Array<{
    size: string;
    price: string;
  }>;
}

export interface ProductModalProps {
  produto: ProductModalData | null;
  onClose: () => void;
}

export function ProductModal({ produto, onClose }: ProductModalProps) {
  if (!produto) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl relative border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          aria-label="Fechar modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {produto.foodImg && (
          <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-gray-100">
            <img
              src={produto.foodImg}
              alt={produto.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 mb-1">{produto.name}</h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{produto.description}</p>

        {produto.sizeOptions && produto.sizeOptions.length > 0 && (
          <div className="border-t border-gray-100 pt-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Opções de Tamanho:
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-800">
              {produto.sizeOptions.map((option, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-1 border-b border-gray-50 last:border-none"
                >
                  <span className="font-medium text-gray-700">{option.size}</span>
                  <span className="font-bold text-orange-600">R$ {option.price}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
