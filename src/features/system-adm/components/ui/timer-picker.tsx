import { Input } from "@/components/ui/input";
interface TimerPickerProps {
  label?: string;
}

export function TimerPicker({ label }: TimerPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label>{label}</label>
      <div className="flex items-center justify-between gap-5">
        <div className="flex flex-col w-full">
          <Input id="abertura" type="time" className="w-full" />
        </div>
        <div className="flex flex-col w-full">
          <Input id="fechamento" type="time" className="w-full" />
        </div>
      </div>
    </div>
  );
}
