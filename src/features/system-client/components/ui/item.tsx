interface ItemProps {
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

function truncateText(text: string, maxLength: number) {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export function Item({
  name,
  description,
  price,
  quantity,
  imageUrl,
}: ItemProps) {
  return (
    <div className="flex bg-white w-full max-h-30 h-auto p-2 m-2 rounded-xl shadow-lg items-center gap-4">
      <img
        src={imageUrl}
        alt={name}
        className="w-20 h-20 rounded-md object-cover border"
      />

      <div className="flex-1">
        <h2 className="text-base font-semibold">{truncateText(name, 12)}</h2>
        <p className="text-sm text-gray-500">{truncateText(description, 30)}</p>
        <p className="text-sm font-medium mt-1">Quantidade: {quantity}</p>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-orange-600">
          R$ {(price * quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
