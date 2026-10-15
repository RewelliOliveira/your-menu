import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { WEEKDAY_LABELS, type BusinessHours } from "@/types/restaurant";

interface BusinessHoursEditorProps {
  value: BusinessHours[];
  onChange: (value: BusinessHours[]) => void;
}

export function BusinessHoursEditor({ value, onChange }: BusinessHoursEditorProps) {
  const update = (index: number, patch: Partial<BusinessHours>) =>
    onChange(value.map((day, i) => (i === index ? { ...day, ...patch } : day)));

  return (
    <ul className="divide-y rounded-xl border">
      {value.map((day, index) => (
        <li key={day.weekday} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <label className="flex w-36 cursor-pointer items-center gap-3">
            <Switch
              checked={day.isOpen}
              onCheckedChange={(isOpen) => update(index, { isOpen })}
              aria-label={`Abrir na ${WEEKDAY_LABELS[day.weekday]}`}
            />
            <span className={cn("text-sm font-semibold", !day.isOpen && "text-muted-foreground")}>
              {WEEKDAY_LABELS[day.weekday]}
            </span>
          </label>

          {day.isOpen ? (
            <div className="flex flex-1 items-center gap-2">
              <Input
                type="time"
                value={day.openingTime}
                onChange={(e) => update(index, { openingTime: e.target.value })}
                className="h-9 min-w-0 flex-1 sm:max-w-32"
                aria-label={`Abertura de ${WEEKDAY_LABELS[day.weekday]}`}
              />
              <span className="text-xs text-muted-foreground">às</span>
              <Input
                type="time"
                value={day.closingTime}
                onChange={(e) => update(index, { closingTime: e.target.value })}
                className="h-9 min-w-0 flex-1 sm:max-w-32"
                aria-label={`Fechamento de ${WEEKDAY_LABELS[day.weekday]}`}
              />
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Fechado</span>
          )}
        </li>
      ))}
    </ul>
  );
}
