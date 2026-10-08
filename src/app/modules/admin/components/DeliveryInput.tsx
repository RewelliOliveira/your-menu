import { Input } from "@/app/components/ui/Input";

export interface DeliveryInputProps {
  label?: string;
  deliveryTimeMin: string;
  deliveryTimeMax: string;
  onChangeMin: (value: string) => void;
  onChangeMax: (value: string) => void;
}

export function DeliveryInput({
  label,
  deliveryTimeMin,
  deliveryTimeMax,
  onChangeMin,
  onChangeMax,
}: DeliveryInputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <span className="text-sm font-semibold text-gray-800">{label}</span>}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="number"
            placeholder="Min (ex: 30)"
            value={deliveryTimeMin}
            onChange={(e) => onChangeMin(e.target.value)}
          />
        </div>
        <span className="text-gray-500 font-medium">até</span>
        <div className="flex-1">
          <Input
            type="number"
            placeholder="Max (ex: 45)"
            value={deliveryTimeMax}
            onChange={(e) => onChangeMax(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
