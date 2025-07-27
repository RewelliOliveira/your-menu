// components/ui/product-modal.tsx
import { OrderProps } from "./menu-item";

interface ProductModalProps {
  produto: OrderProps | null;
  onClose: () => void;
}

export function ProductModal({ produto, onClose }: ProductModalProps) {
  if (!produto) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-80 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-2">{produto.name}</h2>
        <p className="text-sm text-gray-600 mb-4">{produto.description}</p>

        <h3 className="text-md font-semibold mb-2">Tamanhos:</h3>
        <ul className="list-disc list-inside text-sm text-gray-800">
          {produto.sizeOptions?.map((option, index) => (
            <li key={index}>
              {option.size} - R${option.price}
            </li>
          ))}
        </ul>

        <button
          className="mt-4 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
