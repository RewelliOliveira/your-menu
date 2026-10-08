import { Input } from "@/app/components/ui/Input";

export interface TimerPickerProps {
  label?: string;
  valueStart: string;
  valueEnd: string;
  onChangeStart: (value: string) => void;
  onChangeEnd: (value: string) => void;
}

export function TimerPicker({
  label,
  valueStart,
  valueEnd,
  onChangeStart,
  onChangeEnd,
}: TimerPickerProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <span className="text-sm font-semibold text-gray-800">{label}</span>}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            id="abertura"
            type="time"
            label="Abertura"
            value={valueStart}
            onChange={(e) => onChangeStart(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Input
            id="fechamento"
            type="time"
            label="Fechamento"
            value={valueEnd}
            onChange={(e) => onChangeEnd(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
