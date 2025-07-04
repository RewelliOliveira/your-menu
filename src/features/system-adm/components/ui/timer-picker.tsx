import { Input } from "@/components/ui/input";

interface TimerPickerProps {
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
    <div className="flex flex-col gap-1.5">
      {label && <label>{label}</label>}
      <div className="flex items-center justify-between gap-5">
        <div className="flex flex-col w-full">
          <Input
            id="abertura"
            type="time"
            className="w-full"
            value={valueStart}
            onChange={(e) => onChangeStart(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full">
          <Input
            id="fechamento"
            type="time"
            className="w-full"
            value={valueEnd}
            onChange={(e) => onChangeEnd(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
