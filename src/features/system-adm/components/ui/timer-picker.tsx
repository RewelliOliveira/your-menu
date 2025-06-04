import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
interface TimerPickerProps {
  label?: string;
}

export function TimerPicker({ label }: TimerPickerProps) {
  return (
    <div className="flex flex-col gap-4">
      <label>{label}</label>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="abertura">Abertura</Label>
          <Input id="abertura" type="time" className="w-full" />
        </div>
        <span className="text-black px-2 mt-5">-</span>
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="fechamento">Fechamento</Label>
          <Input id="fechamento" type="time" className="w-full" />
        </div>
      </div>
    </div>
  );
}
