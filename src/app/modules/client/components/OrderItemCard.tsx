import { formatCurrencySimple } from "@/core/utils/utils";

export interface OrderItemCardProps {
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export function OrderItemCard({
  name,
  description,
  price,
  quantity,
  imageUrl,
}: OrderItemCardProps) {
  return (
    <div className="flex bg-white w-full p-3 rounded-2xl shadow-xs border border-gray-100 items-center gap-4">
      <img
        src={imageUrl}
        alt={name}
        className="w-16 h-16 rounded-xl object-cover border border-gray-100 bg-gray-50 flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-gray-900 truncate">{name}</h3>
        <p className="text-xs text-gray-500 truncate">{description}</p>
        <p className="text-xs font-semibold text-gray-700 mt-1">
          Qtd: <span className="text-orange-600 font-bold">{quantity}</span>
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-gray-900">
          R$ {formatCurrencySimple(price * quantity)}
        </p>
      </div>
    </div>
  );
}
