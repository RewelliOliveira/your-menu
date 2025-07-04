import { Input } from "@/components/ui/input";
interface DeliveryInputProps {
    label?: string
    deliveryTimeMin: string
    deliveryTimeMax: string
    onChangeMin: (value: string) => void
    onChangeMax: (value: string) => void
}
export function DeliveryInput({
    label,
    deliveryTimeMin,
    deliveryTimeMax,
    onChangeMin,
    onChangeMax,
}: DeliveryInputProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label>{label}</label>
            <div className="flex gap-5">
                <Input
                    type="number"
                    value={deliveryTimeMin}
                    onChange={(e) => onChangeMin(e.target.value)}
                />
                <Input
                    type="number"
                    value={deliveryTimeMax}
                    onChange={(e) => onChangeMax(e.target.value)}
                />
            </div>
        </div>
    );
}